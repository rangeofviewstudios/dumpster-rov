// Captures extra v2 app states the stock app\screenshots set lacks.
// Usage: (in app\) npm run preview -- --port 4181   then   node cap.mjs <outdir>
import { spawn } from 'node:child_process'
import fs from 'node:fs'
const OUT = process.argv[2] || '.'
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',
  ['--headless=new','--remote-debugging-port=9333','--user-data-dir='+process.env.TEMP+'/dcap'+Date.now(),'--hide-scrollbars','--no-first-run','about:blank'],{stdio:'ignore'})
const sleep=ms=>new Promise(r=>setTimeout(r,ms))
let list
for(let i=0;i<40;i++){try{list=await (await fetch('http://127.0.0.1:9333/json')).json();break}catch{await sleep(300)}}
const page=list.find(t=>t.type==='page')
const ws=new WebSocket(page.webSocketDebuggerUrl)
await new Promise(r=>ws.onopen=r)
let id=0;const pend={}
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend[m.id]){pend[m.id](m.result);delete pend[m.id]}}
const send=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}))})
const ev=expr=>send('Runtime.evaluate',{expression:expr,awaitPromise:true})
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:3,mobile:true})
const base='http://localhost:4181/'
const type=t=>`(()=>{const i=document.querySelector('.composer__input');i.focus();const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(i,${JSON.stringify(t)});i.dispatchEvent(new Event('input',{bubbles:true}))})()`
const shots=[
 ['dump-typing','?screen=dump',[type('48 Willow Creek Dr, Apt 3B, Brooklyn NY')],600],
]
for(const [name,q,steps,wait] of shots){
  await send('Page.navigate',{url:base+'?screen=piles'}); await sleep(1200)
  await ev('try{localStorage.clear()}catch{}')
  await send('Page.navigate',{url:base+q}); await sleep(2500)
  for(const s of steps){ if(typeof s==='number') await sleep(s); else {await ev(s); await sleep(50)} }
  await sleep(wait)
  const r=await send('Page.captureScreenshot',{format:'png'})
  fs.writeFileSync(OUT+'/'+name+'.png',Buffer.from(r.data,'base64'))
  console.log('ok',name)
}
ws.close();chrome.kill()
process.exit(0)
