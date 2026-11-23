// Export the editable SVG sources for HA's native branding; no extra dependency.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { access, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const candidates = [process.env.CHROME_BIN, '/usr/bin/google-chrome', '/usr/bin/chromium',
  '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  process.env.ProgramFiles && join(process.env.ProgramFiles,'Google/Chrome/Application/chrome.exe'),
  process.env['ProgramFiles(x86)'] && join(process.env['ProgramFiles(x86)'],'Microsoft/Edge/Application/msedge.exe')].filter(Boolean)
let executable
for (const path of candidates) { try { await access(path); executable=path; break } catch {} }
assert.ok(executable, 'Install Chrome/Chromium or set CHROME_BIN')
const temporary = await mkdtemp(join(tmpdir(),'circulation-brand-'))
const delay = ms => new Promise(resolve => setTimeout(resolve,ms))
async function until(check) {
  const deadline=Date.now()+15000
  while(Date.now()<deadline) { const result=await check();if(result)return result;await delay(50) }
  throw new Error('Timed out while rendering branding')
}
let browser, browserExit, socket, sequence=0
const pending=new Map()
function command(method,params={}) {
  return new Promise((resolve,reject)=>{
    const id=++sequence
    const timer=setTimeout(()=>{pending.delete(id);reject(new Error(`CDP timeout: ${method}`))},5000)
    pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}))
  })
}
try {
  browser=spawn(executable,['--headless=new','--no-first-run','--no-default-browser-check',
    '--disable-background-networking','--remote-debugging-port=0',`--user-data-dir=${temporary}`,'about:blank'],
    {stdio:'ignore',windowsHide:true})
  browserExit=once(browser,'exit')
  const port=await until(async()=>{
    try{return Number((await readFile(join(temporary,'DevToolsActivePort'),'utf8')).split('\n')[0])}catch{return false}
  })
  const page=await until(async()=>(await(await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(item=>item.type==='page'))
  socket=new WebSocket(page.webSocketDebuggerUrl);await once(socket,'open')
  socket.addEventListener('message',event=>{
    const message=JSON.parse(event.data),call=pending.get(message.id)
    if(!call)return
    pending.delete(message.id);clearTimeout(call.timer)
    message.error?call.reject(new Error(message.error.message)):call.resolve(message.result)
  })
  socket.addEventListener('close',()=>{for(const call of pending.values()){clearTimeout(call.timer);call.reject(new Error('Browser closed'))}pending.clear()})
  await command('Page.enable')
  await command('Runtime.enable')
  await command('Emulation.setDefaultBackgroundColorOverride',{color:{r:0,g:0,b:0,a:0}})
  for(const name of ['icon','dark_icon']) {
    const master=await readFile(join(root,`frontend/src/assets/images/${name}.svg`),'utf8')
    for(const size of [256,512]) {
      const svg=master.replace('width="256" height="256"',`width="${size}" height="${size}"`)
      await command('Emulation.setDeviceMetricsOverride',{width:size,height:size,deviceScaleFactor:1,mobile:false})
      const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)
      await command('Page.navigate',{url})
      await until(async()=>{
        const state=await command('Runtime.evaluate',{expression:`location.href===${JSON.stringify(url)} && document.readyState==='complete'`,returnByValue:true})
        return state.result.value
      })
      const capture=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,
        clip:{x:0,y:0,width:size,height:size,scale:1}})
      const target=join(root,`custom_components/warmwasser_zirkulation/brand/${name}${size===512?'@2x':''}.png`)
      await writeFile(target,Buffer.from(capture.data,'base64'))
      console.log(`Exported ${basename(target)} (${size} × ${size}, transparent)`)
    }
  }
} finally {
  if(socket?.readyState===WebSocket.OPEN){await command('Browser.close').catch(()=>{});socket.close()}
  if(browser && browser.exitCode===null){await Promise.race([browserExit,delay(2000)]);if(browser.exitCode===null){browser.kill();await Promise.race([browserExit,delay(3000)])}}
  const target=await realpath(temporary)
  assert.equal(dirname(target),await realpath(tmpdir()))
  assert.ok(basename(target).startsWith('circulation-brand-'))
  await rm(target,{recursive:true,force:true,maxRetries:5,retryDelay:100})
}
