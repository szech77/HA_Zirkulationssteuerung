// Run after the production build. No browser package or download is required.
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findChrome, startChrome } from './chrome.mjs'

const bundle = fileURLToPath(new URL('../custom_components/warmwasser_zirkulation/web/', import.meta.url))
const executable = await findChrome()

const fixture = {
  entry_id: 'scroll-test', title: 'Synthetic scroll regression', reason: 'monitoring', status_level: 'normal',
  enabled: false, demand_automation: false, flow: null, buffer: null,
  pump: { entity_id: 'switch.synthetic_pump', state: 'off' }, threshold: 0.12, sample_size: 0,
  learning_ready: false, daily_starts: 0, max_starts: 6, remaining_starts: 6, runtime_seconds: 120,
  settings_revision: 0, next_start: null, country: null, subdivision: null, history_import: null,
  settings: { mode: 'monitoring', vacation_active: false, vacation_windows: [],
    schedule: Object.fromEntries(['mon','tue','wed','thu','fri','sat','sun_holiday'].map(day => [day, []])) },
  heatmap: { rows: ['mon','tue','wed','thu','fri','sat','sun_holiday'].map(key => ({ key,
    cells: Array.from({length:48}, () => ({ observed_days:0,event_days:0,partial_days:0,ratio:null,sufficient:false,level:null })) })),
    calendar_enabled:false,retention_days:180,minimum_coverage_minutes:15,minimum_observed_days:3,observed_dates:0 },
}
// Synthetically observed fractions and planning overlays for visual regression.
fixture.heatmap.observed_dates=100
fixture.heatmap.planning={mode:'monitoring',vacation_active:false,horizon_days:7,next_start:null}
for(const [rowIndex,row] of fixture.heatmap.rows.entries()) for(const [slot,cell] of row.cells.entries()) {
  if(slot<8 || slot>42)continue
  const ratio=((slot*7+rowIndex*3)%101)/100
  Object.assign(cell,{observed_days:100,event_days:Math.round(ratio*100),ratio,sufficient:true,level:2})
  if((slot>=12&&slot<17)||(slot>=34&&slot<39))cell.allowed_windows=[{start:'06:00',end:'08:30',offset:0,width:100}]
}
for(const [slot,ratio] of [[10,.41],[11,.42],[12,1]]) Object.assign(fixture.heatmap.rows[0].cells[slot],{ratio,event_days:ratio*100})
fixture.heatmap.rows[0].cells[12].planned_runs=[{start:'06:05',end:'06:07',offset:16.67,width:6.67}]
// A hosting shell is allowed to clip its custom-element surface. The actual
// scroller must be inside the panel, beyond external host CSS overrides.
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body,ha-panel-custom{display:block;height:100%;margin:0;overflow:hidden}warmwasser-panel{display:block;height:100%;overflow:hidden}</style>
</head><body><ha-panel-custom></ha-panel-custom><script type="module">
import '/panel.js';
window.sidebarEvents=[];document.addEventListener('hass-toggle-menu',event=>sidebarEvents.push({open:event.detail?.open,composed:event.composed}));
const element=document.createElement('warmwasser-panel');
Object.assign(element,{panel:{component_name:'custom'},hass:{callWS:async()=>({entries:[${JSON.stringify(fixture)}]})},narrow:false,route:{path:'',prefix:'/warmwasser-zirkulation'}});
document.querySelector('ha-panel-custom').append(element);window.testPanel=element;
</script></body></html>`
const assets = new Map([['/', [Buffer.from(html), 'text/html']],
  ['/panel.js', [await readFile(join(bundle, 'panel.js')), 'text/javascript']],
  ['/warmwasser-zirkulation-static/panel.css', [await readFile(join(bundle, 'panel.css')), 'text/css']]])
const server = createServer((request, response) => {
  const asset = assets.get(request.url)
  if (!asset) { response.writeHead(404).end(); return }
  response.writeHead(200, { 'Content-Type': asset[1], 'Cache-Control': 'no-store' }).end(asset[0])
})
server.listen(0, '127.0.0.1'); await once(server, 'listening')
const origin = `http://127.0.0.1:${server.address().port}`
let browser, socket, sequence = 0
const pending = new Map(), exceptions = []
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
async function until(check, label, timeout = 15000) {
  const stop = Date.now() + timeout
  while (Date.now() < stop) { const result = await check(); if (result) return result; await delay(50) }
  throw new Error(`Timed out: ${label}`)
}
function command(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)) }, 5000)
    pending.set(id, { resolve, reject, timer, method }); socket.send(JSON.stringify({ id, method, params }))
  })
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails)); return result.result.value
}
async function wheel(x, y, deltaX, deltaY) {
  await command('Input.dispatchMouseEvent', { type:'mouseMoved', x, y })
  await command('Input.dispatchMouseEvent', { type:'mouseWheel', x, y, deltaX, deltaY })
  await delay(150)
}
async function swipe(points) {
  for (let index=0; index<points.length; index++) {
    const [x,y] = points[index]
    await command('Input.dispatchTouchEvent', { type:index===0?'touchStart':'touchMove',touchPoints:[{x,y,id:1}] })
    await delay(35)
  }
  await command('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]})
  await delay(200)
}
try {
  browser = await startChrome(executable, origin)
  const port = browser.port
  const target = await until(async () => (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(item => item.type === 'page' && item.url.startsWith(origin)), 'test page')
  socket = new WebSocket(target.webSocketDebuggerUrl); await once(socket, 'open')
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const call = pending.get(message.id); if (!call) return
      pending.delete(message.id); clearTimeout(call.timer)
      message.error ? call.reject(new Error(`${call.method}: ${message.error.message}`)) : call.resolve(message.result)
    } else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text)
  })
  socket.addEventListener('close', () => { for (const call of pending.values()) { clearTimeout(call.timer); call.reject(new Error('Browser closed')) } pending.clear() })
  await command('Runtime.enable')
  await until(() => evaluate("Boolean(window.testPanel?.shadowRoot?.querySelector('.heat-cell'))"), 'Vue panel rendering')
  await evaluate("window.root=testPanel.shadowRoot;window.viewport=root.querySelector('.panel-viewport');true")
  assert.ok(await evaluate('Boolean(viewport)'), 'Panel needs an internal scroll viewport')
  await command('Emulation.setDeviceMetricsOverride', { width:1280,height:720,deviceScaleFactor:1,mobile:false })
  assert.equal(await evaluate("getComputedStyle(testPanel).overflowY"), 'hidden')
  assert.ok(await evaluate('viewport.scrollHeight > viewport.clientHeight'))
  await wheel(600, 300, 0, 350)
  await until(() => evaluate('viewport.scrollTop > 0'), 'native mouse wheel down')
  assert.equal(await evaluate('testPanel.scrollTop'), 0)
  assert.equal(await evaluate("root.querySelector('.app-header').getBoundingClientRect().top"), 0)
  const before = await evaluate('viewport.scrollTop')
  await wheel(600, 300, 0, -110.5)
  assert.ok(await evaluate(`viewport.scrollTop < ${before}`), 'Fractional upward touchpad delta')
  await evaluate("root.querySelectorAll('nav a')[1].click()")
  await until(() => evaluate("root.querySelector('h1').textContent === 'Einstellungen' && viewport.scrollTop === 0"), 'settings route scroll reset')
  await wheel(600, 300, 0, 180.5)
  await until(() => evaluate('viewport.scrollTop > 0'), 'settings touchpad down')
  await evaluate("root.querySelectorAll('nav a')[0].click()")
  await command('Emulation.setDeviceMetricsOverride', { width:390,height:844,deviceScaleFactor:1,mobile:true })
  await until(() => evaluate("root.querySelector('h1').textContent === 'Übersicht' && viewport.scrollTop === 0"), 'overview route reset')
  await wheel(180, 300, 0, 160.5)
  await until(() => evaluate('viewport.scrollTop > 0'), 'narrow panel wheel down')
  const point = await evaluate("(()=>{const chart=root.querySelector('.heatmap-scroll');viewport.scrollTop+=chart.getBoundingClientRect().top-230;const rect=chart.getBoundingClientRect();return{x:rect.left+rect.width/2,y:rect.top+Math.min(80,rect.height/2)}})()")
  await wheel(point.x, point.y, 170.5, 0)
  assert.ok(await evaluate("root.querySelector('.heatmap-scroll').scrollLeft > 0"), 'Horizontal heatmap touchpad scroll')
  const verticalBefore = await evaluate('viewport.scrollTop')
  await wheel(point.x, point.y, 0, 100.5)
  assert.ok(await evaluate(`viewport.scrollTop > ${verticalBefore}`), 'Vertical wheel over heatmap reaches page viewport')
  assert.equal(await evaluate("root.querySelector('.app-header').getBoundingClientRect().top"), 0)
  assert.equal(await evaluate("root.querySelector('header h1')"), null, 'No duplicate breadcrumb')
  assert.equal(await evaluate("root.querySelector('.menu-button, [aria-label=\"Navigation öffnen\"]')"), null, 'No hamburger button in the panel header')
  // Scroll every page to its end in full-height, offset and auto-height HA shells.
  // The header must be outside the scrolling content, including on narrow screens.
  assert.equal(await evaluate("viewport.contains(root.querySelector('.app-header'))"), false)
  for (const [width,height,mobile] of [[1280,720,false],[390,844,true]]) {
    await command('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile})
    for (const layout of ['full','offset','auto']) {
      await evaluate(`(()=>{const shell=document.querySelector('ha-panel-custom');shell.style.height=${JSON.stringify(layout)}==='auto'?'auto':${JSON.stringify(layout)}==='offset'?'calc(100% - 56px)':'100%';shell.style.marginTop=${JSON.stringify(layout)}==='offset'?'56px':'0';testPanel.style.height=${JSON.stringify(layout)}==='auto'?'auto':'100%'})()`)
      for (const [index,title] of [[0,'Übersicht'],[1,'Einstellungen']]) {
        await evaluate(`root.querySelectorAll('nav a')[${index}].click();viewport.scrollTop=0`)
        await until(() => evaluate(`root.querySelector('h1').textContent===${JSON.stringify(title)}`), 'route for fixed header check')
        await wheel(width/2,height/2,0,100000)
        await until(() => evaluate('viewport.scrollTop>0 && Math.abs(viewport.scrollHeight-viewport.clientHeight-viewport.scrollTop)<1'), 'page end')
        const bounds=await evaluate("(()=>{const header=root.querySelector('.app-header').getBoundingClientRect(),content=viewport.getBoundingClientRect(),host=testPanel.getBoundingClientRect(),footer=root.querySelector('footer').getBoundingClientRect();return{top:header.top,expected:host.top,headerBottom:header.bottom,contentTop:content.top,contentBottom:content.bottom,hostBottom:host.bottom,footerBottom:footer.bottom}})()")
        assert.ok(Math.abs(bounds.top-bounds.expected)<1, `${title} ${width}px ${layout}: header stays at panel top`)
        assert.ok(Math.abs(bounds.headerBottom-bounds.contentTop)<1, 'Content starts below header without overlap')
        assert.ok(bounds.contentBottom<=bounds.hostBottom+1 && bounds.contentBottom<=height+1, 'Content remains within available HA height')
        assert.ok(bounds.footerBottom<=bounds.contentBottom+1, 'Page footer remains reachable')
      }
    }
  }
  await evaluate("document.querySelector('ha-panel-custom').style.cssText='';testPanel.style.height='100%';root.querySelectorAll('nav a')[0].click()")
  await until(() => evaluate("root.querySelector('h1').textContent==='Übersicht'"), 'overview for sidebar gestures')
  await command('Emulation.setTouchEmulationEnabled', {enabled:true,maxTouchPoints:2})
  await evaluate('viewport.scrollTop=0')
  await swipe([[8,350],[25,350],[50,352],[85,353],[120,354]])
  assert.deepEqual(await evaluate('sidebarEvents'), [{open:true,composed:true}], 'Completed edge swipe opens native HA menu')
  await swipe([[8,350],[25,350],[50,352],[85,353],[120,354]])
  assert.equal(await evaluate('sidebarEvents.length'), 2, 'Repeated swipe requests opening instead of toggling')
  await swipe([[8,500],[8,430],[8,360],[8,280],[8,220]])
  assert.ok(await evaluate('viewport.scrollTop>0'), 'Vertical touch swipe keeps native scrolling')
  await swipe([[180,350],[220,350],[260,350],[300,350]])
  assert.equal(await evaluate('sidebarEvents.length'), 2, 'Vertical and ordinary content swipes do not open menu')
  // The visual contract uses the exact EOS light/dark surface and action colors.
  for (const [width,height,mobile] of [[1280,900,false],[390,844,true]]) {
    await command('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile})
    for (const [index,page] of [[0,'overview'],[1,'settings']]) {
      await evaluate(`root.querySelectorAll('nav a')[${index}].click();viewport.scrollTop=0`)
      for (const [theme,bg,ink,accent,onAccent] of [
        ['light','rgb(238, 242, 246)','rgb(22, 34, 49)','rgb(24, 93, 164)','rgb(255, 255, 255)'],
        ['dark','rgb(16, 21, 29)','rgb(238, 244, 252)','rgb(142, 197, 255)','rgb(11, 20, 32)']]) {
        await evaluate(`if(root.querySelector('.app-shell').dataset.theme!==${JSON.stringify(theme)})root.querySelector('.theme-button').click()`)
        await until(() => evaluate(`root.querySelector('.app-shell').dataset.theme===${JSON.stringify(theme)} && root.querySelector('main').id===${JSON.stringify(index===0?'overview':'settings')}`), 'theme and route rendering')
        await until(() => evaluate(`Boolean(root.querySelector(${JSON.stringify(width<=640?'.bottom-navigation nav':'header nav')}))`), 'responsive navigation placement')
        const identity=await evaluate("(()=>{const header=root.querySelector('.app-header').getBoundingClientRect(),logo=root.querySelector('.brand-logo').getBoundingClientRect(),host=testPanel.getBoundingClientRect(),nav=root.querySelector('.app-navigation').getBoundingClientRect(),font=getComputedStyle(root.querySelector('.app-shell'));return{headerHeight:header.height,logoWidth:logo.width,logoLeft:logo.left-host.left,navBottom:nav.bottom,font:font.fontFamily,navCount:root.querySelectorAll('nav[aria-label=Hauptnavigation]').length}})()")
        assert.equal(identity.headerHeight,width<=450?57:65,'EOS title bar height')
        assert.equal(identity.logoWidth,width<=450?32:38,'EOS logo size')
        assert.equal(identity.logoLeft,width===390?12:28,'EOS logo gutter')
        assert.ok(identity.font.includes('system-ui'),'EOS system font')
        assert.equal(identity.navCount,1,'Only one main navigation after resize')
        if(width<=640)assert.ok(identity.navBottom<=height && identity.navBottom>height-25,'Phone navigation stays at bottom')
        if(index===0){
          const heat=await evaluate("(()=>{const cells=root.querySelectorAll('tbody tr:first-child .heat-cell'),a=getComputedStyle(cells[10]),b=getComputedStyle(cells[11]),full=getComputedStyle(cells[12]),allowed=getComputedStyle(cells[12].querySelector('.allowed-window'));return{a:a.backgroundColor,b:b.backgroundColor,full:full.backgroundColor,allowed:allowed.backgroundColor,outline:allowed.boxShadow}})()")
          assert.notEqual(heat.a,heat.b,'41% and 42% produce distinct continuous colors')
          assert.equal(heat.allowed,theme==='light'?'rgb(39, 116, 72)':'rgb(117, 219, 160)','Green EOS permission marker')
          assert.notEqual(heat.full,heat.allowed,'Permission stays distinct from 100% usage')
          assert.notEqual(heat.outline,'none','Permission has a separating outline')
        }
        if(index===1 && width<=640){
          const layout=await evaluate("(()=>{const nav=root.querySelector('.app-navigation').getBoundingClientRect(),save=root.querySelector('.save-bar').getBoundingClientRect(),buttons=[...root.querySelectorAll('.settings-nav button')].map(button=>button.getBoundingClientRect());return{navTop:nav.top,saveBottom:save.bottom,tabGap:root.querySelector('.settings-content').getBoundingClientRect().top-root.querySelector('.settings-nav').getBoundingClientRect().bottom,overlap:buttons.some((button,index)=>index>0&&button.left<buttons[index-1].right-1)}})()")
          assert.ok(layout.saveBottom<=layout.navTop,'Save bar stays above phone navigation')
          assert.equal(layout.overlap,false,'Settings tabs never overlap at readable text size')
          assert.ok(layout.tabGap>=13.5,'EOS spacing between mobile section tabs and form')
        }
        const colors=await evaluate("(()=>{const shell=getComputedStyle(root.querySelector('.app-shell')),button=root.querySelector('.primary-button');return{background:shell.backgroundColor,text:shell.color,button:button?getComputedStyle(button).backgroundColor:null,onButton:button?getComputedStyle(button).color:null}})()")
        assert.equal(colors.background,bg, `EOS ${theme} background`)
        assert.equal(colors.text,ink, `EOS ${theme} foreground`)
        if(index===1){assert.equal(colors.button,accent);assert.equal(colors.onButton,onAccent)}
        if(process.env.CIRCULATION_REVIEW_DIR){
          await mkdir(process.env.CIRCULATION_REVIEW_DIR,{recursive:true})
          const capture=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})
          await writeFile(join(process.env.CIRCULATION_REVIEW_DIR,`${page}-${theme}-${width}.png`),Buffer.from(capture.data,'base64'))
        }
      }
    }
  }
  for(const width of [320,450,640,641,760]){
    await command('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:width<=640})
    await until(()=>evaluate(`Boolean(root.querySelector(${JSON.stringify(width<=640?'.bottom-navigation nav':'header nav')}))`),'navigation breakpoint')
    const size=await evaluate("(()=>{const header=root.querySelector('.app-header').getBoundingClientRect(),inner=root.querySelector('.header-inner'),nav=root.querySelector('.app-navigation');return{height:header.height,overflow:inner.scrollWidth-inner.clientWidth,count:nav.querySelectorAll('a').length}})()")
    assert.equal(size.height,width<=450?57:width<=640?63:65,`${width}px EOS header height`)
    assert.ok(size.overflow<=1,`${width}px header fits without horizontal clipping`)
    assert.equal(size.count,2)
  }
  await command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true})
  await until(()=>evaluate("Boolean(root.querySelector('.bottom-navigation nav'))"),'bottom navigation for real clicks')
  for(const [index,page] of [[0,'overview'],[1,'settings']]){
    const point=await evaluate(`(()=>{const r=root.querySelectorAll('.app-navigation a')[${index}].getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()`)
    await command('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1})
    await command('Input.dispatchMouseEvent',{type:'mouseReleased',...point,button:'left',clickCount:1})
    await until(()=>evaluate(`root.querySelector('main').id===${JSON.stringify(page)}`),'real bottom navigation click')
  }
  assert.deepEqual(exceptions, [])
  console.log('Browser scroll checks passed: mouse wheel, fractional touchpad deltas, narrow layout, heatmap axes, route reset, fixed header through page end in full/offset/auto-height HA shells, native sidebar touch gestures, exact EOS theme colors and geometry, bottom phone navigation and continuous heatmap colors.')
} finally {
  if (socket?.readyState === WebSocket.OPEN) { await command('Browser.close').catch(() => {}); socket.close() }
  try { await browser?.stop() }
  finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)) }
}
