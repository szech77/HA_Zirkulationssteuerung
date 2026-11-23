import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { access, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { PassThrough } from 'node:stream'
import test from 'node:test'
import { startChrome } from './chrome.mjs'

function fixture(actions) {
  const calls = []
  const spawnProcess = (executable, args, options) => {
    const child = new EventEmitter()
    Object.assign(child, { stderr: new PassThrough(), exitCode: null, signalCode: null,
      kill(signal = 'SIGTERM') { child.signalCode = signal; queueMicrotask(() => child.emit('exit', null, signal)); return true } })
    const profile = args.find(arg => arg.startsWith('--user-data-dir=')).slice('--user-data-dir='.length)
    calls.push({ executable, args, options, profile, child })
    setImmediate(() => actions[calls.length - 1](child, profile))
    return child
  }
  return { calls, spawnProcess }
}
const ready = async (_child, profile) => writeFile(join(profile, 'DevToolsActivePort'), '12345\n/devtools/browser/synthetic')
const fail = child => { child.stderr.write('synthetic Chrome startup failure'); child.exitCode = 7; child.emit('exit', 7, null) }
async function removed(profile) { await assert.rejects(access(profile), { code: 'ENOENT' }) }

test('starts with an isolated profile, preserves the sandbox and cleans up', async () => {
  const { calls, spawnProcess } = fixture([ready])
  const browser = await startChrome('synthetic-browser', 'about:blank', { spawnProcess })
  try {
    assert.equal(browser.port, 12345)
    assert.equal(calls.length, 1)
    assert.ok(calls[0].args.includes('--headless=new'))
    assert.ok(!calls[0].args.includes('--no-sandbox'))
    assert.deepEqual(calls[0].options.stdio, ['ignore', 'ignore', 'pipe'])
  } finally { await browser.stop() }
  await removed(browser.profile)
})

test('an early exit reports the code and stderr instead of waiting for a timeout', async () => {
  const { calls, spawnProcess } = fixture([fail])
  await assert.rejects(startChrome('synthetic-browser', 'about:blank', { spawnProcess, attempts: 1 }), /code 7.*\nChrome stderr:\nsynthetic Chrome startup failure/)
  await removed(calls[0].profile)
})

test('retries only startup once, using a fresh profile and removing the failed one', async () => {
  const { calls, spawnProcess } = fixture([fail, ready])
  const browser = await startChrome('synthetic-browser', 'about:blank', { spawnProcess })
  try {
    assert.equal(calls.length, 2)
    assert.notEqual(calls[0].profile, calls[1].profile)
    await removed(calls[0].profile)
  } finally { await browser.stop() }
})

test('a startup timeout kills the owned process and removes its profile', async () => {
  const { calls, spawnProcess } = fixture([() => {}])
  await assert.rejects(startChrome('synthetic-browser', 'about:blank', { spawnProcess, attempts: 1, timeoutMs: 30 }), /within 30 ms/)
  assert.equal(calls[0].child.signalCode, 'SIGTERM')
  await removed(calls[0].profile)
})

test('spawn errors surface immediately with their cause', async () => {
  const { calls, spawnProcess } = fixture([child => child.emit('error', new Error('synthetic executable missing'))])
  await assert.rejects(startChrome('synthetic-browser', 'about:blank', { spawnProcess, attempts: 1 }), /synthetic executable missing/)
  await removed(calls[0].profile)
})

test('persistent failures remain failures after exactly two attempts', async () => {
  const { calls, spawnProcess } = fixture([fail, fail])
  await assert.rejects(startChrome('synthetic-browser', 'about:blank', { spawnProcess }), error => {
    assert.equal(error.errors.length, 2)
    assert.match(error.message, /Attempt 2:/)
    return true
  })
  assert.equal(calls.length, 2)
  for (const call of calls) await removed(call.profile)
})

test('startup diagnostics are bounded and retain the last failure message', async () => {
  const { spawnProcess } = fixture([child => { child.stderr.write('x'.repeat(10000)); fail(child) }])
  await assert.rejects(startChrome('synthetic-browser', 'about:blank', { spawnProcess, attempts: 1 }), error => {
    assert.ok(error.message.length < 4500)
    assert.ok(error.message.endsWith('synthetic Chrome startup failure'))
    return true
  })
})

test('allows a delayed startup inside the budget without starting a second browser', async () => {
  const { calls, spawnProcess } = fixture([async (child, profile) => {
    await new Promise(resolve => setTimeout(resolve, 80))
    await ready(child, profile)
  }])
  const browser = await startChrome('synthetic-browser', 'about:blank', { spawnProcess, timeoutMs: 3000 })
  try { assert.equal(calls.length, 1); assert.equal(browser.port, 12345) }
  finally { await browser.stop() }
})
