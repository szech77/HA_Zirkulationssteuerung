// Isolated local Chrome for repository tools. Browser assertions never retry.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { access, mkdtemp, readFile, realpath, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
async function waitForExit(exit, timeoutMs) {
  let timer
  try { await Promise.race([exit, new Promise(resolve => { timer = setTimeout(resolve, timeoutMs) })]) }
  finally { clearTimeout(timer) }
}

export async function findChrome() {
  const candidates = [process.env.CHROME_BIN,
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    process.env.ProgramFiles && join(process.env.ProgramFiles, 'Google/Chrome/Application/chrome.exe'),
    process.env['ProgramFiles(x86)'] && join(process.env['ProgramFiles(x86)'], 'Microsoft/Edge/Application/msedge.exe')].filter(Boolean)
  for (const path of candidates) { try { await access(path); return path } catch {} }
  throw new Error('Install Chrome/Chromium or set CHROME_BIN')
}

export async function startChrome(executable, url, { timeoutMs = 30000, attempts = 2, spawnProcess = spawn } = {}) {
  const failures = []
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const profile = await mkdtemp(join(tmpdir(), 'circulation-chrome-'))
    let child, exit, spawnError, stderr = ''
    const details = () => stderr.trim() ? `\nChrome stderr:\n${stderr.trim()}` : ''
    const stop = async () => {
      if (child && child.exitCode === null && child.signalCode === null) {
        child.kill()
        await waitForExit(exit, 2000)
        if (child.exitCode === null && child.signalCode === null) {
          child.kill('SIGKILL')
          await waitForExit(exit, 2000)
        }
      }
      const target = await realpath(profile)
      assert.equal(dirname(target), await realpath(tmpdir()))
      assert.ok(basename(target).startsWith('circulation-chrome-'))
      await rm(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
    }
    try {
      child = spawnProcess(executable, ['--headless=new', '--no-first-run', '--no-default-browser-check',
        '--disable-background-networking', '--remote-debugging-port=0', `--user-data-dir=${profile}`, url],
      { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true })
      exit = new Promise(resolve => {
        child.once('exit', resolve)
        child.once('error', error => { spawnError = error; resolve() })
      })
      child.stderr?.on('data', chunk => { stderr = (stderr + chunk.toString()).slice(-4096) })
      const deadline = Date.now() + timeoutMs
      let port
      while (Date.now() < deadline) {
        if (spawnError) throw new Error(`Chrome failed to start: ${spawnError.message}${details()}`)
        if (child.exitCode !== null || child.signalCode !== null) {
          throw new Error(`Chrome exited before DevTools was ready (code ${child.exitCode}, signal ${child.signalCode})${details()}`)
        }
        try {
          const value = Number((await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0])
          if (Number.isInteger(value) && value > 0 && value <= 65535) { port = value; break }
        } catch (error) { if (error.code !== 'ENOENT') throw error }
        await delay(25)
      }
      if (!port) throw new Error(`Chrome DevTools did not become ready within ${timeoutMs} ms${details()}`)
      return { process: child, port, profile, stop }
    } catch (error) {
      await stop()
      failures.push(error)
      if (attempt < attempts) console.warn(`Chrome startup attempt ${attempt} failed; retrying once with a fresh profile. ${error.message}`)
    }
  }
  throw new AggregateError(failures, failures.map((error, index) => `Attempt ${index + 1}: ${error.message}`).join('\n'))
}
