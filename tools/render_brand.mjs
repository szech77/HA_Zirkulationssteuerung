// Export the editable SVG sources for HA's native branding; no extra dependency.
import { once } from 'node:events'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findChrome, startChrome } from './chrome.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const executable = await findChrome()
const delay = ms => new Promise(resolve => setTimeout(resolve,ms))
async function until(check) {
  const deadline=Date.now()+15000
  while(Date.now()<deadline) { const result=await check();if(result)return result;await delay(50) }
  throw new Error('Timed out while rendering branding')
}
let browser, socket, sequence=0
const pending=new Map()
function command(method,params={}) {
  return new Promise((resolve,reject)=>{
    const id=++sequence
    const timer=setTimeout(()=>{pending.delete(id);reject(new Error(`CDP timeout: ${method}`))},5000)
    pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}))
  })
}
try {
  browser=await startChrome(executable,'about:blank')
  const port=browser.port
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
  await browser?.stop()
}
