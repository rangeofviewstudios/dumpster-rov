// Dumpster showcase v2. Generates scenes/*.html from scenes/scene.css. Run: node build.mjs, then bash export.sh
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const dir = path.dirname(fileURLToPath(import.meta.url))
const A = '../../brand/assets/'
const SS = '../../app/screenshots/'
const SH = '../shots/'

const FONTS = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&family=Geist:wght@300;400;500&family=Geist+Mono:wght@400&display=swap'

function page({ name, title, w = 1920, h = 1080, paper = false, light, body }) {
  const lightCss = paper
    ? `radial-gradient(circle at 62% 28%, rgba(255,255,255,.75), transparent 48%), radial-gradient(circle at 12% 88%, rgba(14,14,15,.05), transparent 45%)`
    : light || `radial-gradient(circle at 70% 26%, rgba(222,228,233,.085), transparent 46%), radial-gradient(circle at 14% 84%, rgba(176,183,189,.04), transparent 42%), radial-gradient(circle at 90% 92%, rgba(204,210,214,.03), transparent 45%)`
  fs.writeFileSync(path.join(dir, 'scenes', name + '.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Dumpster showcase / ${title}</title>
<meta name="viewport" content="width=${w}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="scene.css">
<style>:root{--w:${w}px;--h:${h}px}</style></head>
<body><div class="art${paper ? ' paper' : ''}" id="art"><div class="light" style="background:${lightCss}"></div>
${body}
</div></body></html>`)
}

/* ---------- parts ---------- */
const phone = ({ x, y, u = 1, src, extra = '', wrapStyle = '' }) => {
  const w = 406 * u, h = 860 * u
  return `<div class="glow" style="--u:${u}px;left:${x + w / 2 - 310 * u}px;top:${y + h - 55 * u}px"></div>
<div class="phone" style="--u:${u}px;left:${x}px;top:${y}px;${wrapStyle}"><i class="btn l1"></i><i class="btn l2"></i><i class="btn l3"></i><i class="btn r1"></i><div class="scr"><img src="${src}" alt=""></div></div>${extra}`
}
const lockup = (x, y, h, ink = false) => `<img class="abs" src="${A}lockup-horizontal${ink ? '-ink' : ''}.svg" style="left:${x}px;top:${y}px;height:${h}px" alt="Dumpster">`
const label = (x, y, html, style = '') => `<div class="abs label" style="left:${x}px;top:${y}px;${style}">${html}</div>`
const labelC = (cx, y, html, w = 400, style = '') => `<div class="abs label" style="left:${cx - w / 2}px;top:${y}px;width:${w}px;text-align:center;text-indent:.3em;${style}">${html}</div>`
const monoC = (cx, y, html, w = 400, style = '') => `<div class="abs mono" style="left:${cx - w / 2}px;top:${y}px;width:${w}px;text-align:center;${style}">${html}</div>`
const hline = (x, y, w, style = '') => `<div class="hair hair-h" style="left:${x}px;top:${y}px;width:${w}px;${style}"></div>`
const vline = (x, y, h, style = '') => `<div class="hair hair-v" style="left:${x}px;top:${y}px;height:${h}px;${style}"></div>`
const dot = (x, y) => `<i class="dot" style="left:${x}px;top:${y}px"></i>`

const MARK_BODY = `<g id="body"><path d="M9.5 17V45.5H51L54.5 17Z"/><path d="M9.5 26H53.3"/><rect x="16" y="32" width="22" height="5" rx="1.4"/><path d="M15 45.5v2M45 45.5v2"/><circle cx="15" cy="50" r="2.6"/><circle cx="45" cy="50" r="2.6"/></g>`
const GLINT_D = 'M24 2C25 15 29 19 46 24C29 29 25 33 24 46C23 33 19 29 2 24C19 19 23 15 24 2Z'
let uid = 0
/** The real mark geometry (brand/assets/mark.svg). lid = degrees (negative = open). */
function markSvg({ w, vb = '0 0 64 64', lid = 0, sw = 1.5, color = '#EEEEEC', glint = 0, bubble = null, style = '' }) {
  const [vx, vy, vw, vh] = vb.split(' ').map(Number)
  const id = 'c' + ++uid
  const lidEl = `<g id="lid" transform="rotate(${lid} 5.5 17)"><rect x="5.5" y="11" width="53" height="6" rx="1.8"/></g>`
  let bub = ''
  if (bubble) {
    const { x, y, bw, bh, clip } = bubble
    bub = `${clip ? `<clipPath id="${id}"><rect x="-20" y="-40" width="110" height="${clip + 40}"/></clipPath>` : ''}
<g ${clip ? `clip-path="url(#${id})"` : ''}><rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="${Math.min(4, bh / 2)}" fill="#2B5CFF" stroke="none"/><rect x="${x + bw * .14}" y="${y + bh * .3}" width="${bw * .5}" height="${bh * .13}" rx=".4" fill="#fff" stroke="none" opacity=".9"/><rect x="${x + bw * .14}" y="${y + bh * .56}" width="${bw * .32}" height="${bh * .13}" rx=".4" fill="#fff" stroke="none" opacity=".9"/></g>`
  }
  const g = glint ? `<path d="${GLINT_D}" fill="${color}" stroke="none" opacity="${glint}" transform="translate(49 -3) scale(.3)"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${w * vh / vw}" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${sw}" style="display:block;${style}">${bub}${MARK_BODY}${lidEl}${g}</svg>`
}
const absHtml = (x, y, html, style = '') => `<div class="abs" style="left:${x}px;top:${y}px;${style}">${html}</div>`
const bubble = (x, y, text, { fs = 30, rot = 0, op = 1, pad = '20px 28px' } = {}) =>
  `<div class="bubble" style="left:${x}px;top:${y}px;font-size:${fs}px;padding:${pad};transform:rotate(${rot}deg);opacity:${op}">${text}</div>`

/* ---------- 01 hero ---------- */
page({
  name: '01-hero', title: 'Hero', body: `
  ${lockup(110, 96, 34)}
  ${phone({ x: 1130, y: 110, u: 1, src: SS + '02-dump.png' })}
  <div class="abs disp" style="left:104px;top:392px;font-size:136px;line-height:1.02">Dump it.<br><span style="opacity:.5">Find it.</span></div>
  ${hline(110, 770, 640)}
  ${label(110, 800, 'Text yourself, but it remembers')}
  ${label(110, 984, 'Range Of View Studios', 'opacity:.7')}
  ${label(110 + 640 - 270, 984, 'UI concept', 'opacity:.7;text-align:right;width:270px')}
`})

/* ---------- 02 trio ---------- */
{
  const u = 0.82, cx = [480, 960, 1440], shots = ['02-dump', '03-piles', '05-dig'], names = [['01', 'Dump'], ['02', 'Piles'], ['03', 'Dig']]
  page({
    name: '02-trio', title: 'Trio', body: `
    ${label(110, 84, 'The whole app, three tabs')}
    ${cx.map((c, i) => phone({ x: c - 203 * u, y: 150, u, src: SS + shots[i] + '.png' })).join('')}
    ${hline(110, 895, 1700, 'background:rgba(238,238,236,.2)')}
    ${cx.map((c, i) => dot(c, 895) + labelC(c, 930, `<b>${names[i][0]}</b>&nbsp;&nbsp;${names[i][1]}`)).join('')}
  `})
}

/* ---------- 03 dump flow ---------- */
{
  const u = 0.86, cx = [400, 960, 1520], hw = 203 * u
  const shots = [SH + 'dump-typing.png', SS + '09-flow-send.png', SS + '09b-flow-filed.png']
  const names = [['01', 'Dump it'], ['02', 'It goes in'], ['03', 'Find it']]
  const subs = ['type, paste or share anything', 'lid opens, the message drops in', 'filed to Places, from Mom']
  page({
    name: '03-dump-flow', title: 'Dump flow', body: `
    ${label(110, 70, 'The signature send')}
    ${cx.map((c, i) => phone({ x: c - hw, y: 125, u, src: shots[i] })).join('')}
    ${[0, 1].map(i => { const a = cx[i] + hw + 36, b = cx[i + 1] - hw - 36; return hline(a, 495, b - a, 'background:rgba(238,238,236,.3)') + dot(a, 495) + dot(b, 495) }).join('')}
    ${cx.map((c, i) => labelC(c, 925, `<b>${names[i][0]}</b>&nbsp;&nbsp;${names[i][1]}`) + monoC(c, 968, subs[i], 520)).join('')}
  `})
}

/* ---------- 04 piles ---------- */
{
  const saved = [['Places', '05'], ['Watch later', '08'], ['Reads', '05'], ['Shopping', '04']]
  const doing = [['People', '03'], ['To-dos', '07'], ['Ideas', '06'], ['Unsorted', '02']]
  const L = 800, W = 960, RH = 80
  const rows = (arr, y0) => arr.map(([n, c], i) => `<div class="abs" style="left:${L}px;top:${y0 + i * RH}px;width:${W}px;height:${RH}px;border-top:1px solid var(--line);${i === arr.length - 1 ? 'border-bottom:1px solid var(--line);' : ''}display:flex;justify-content:space-between;align-items:center"><span class="disp" style="font-size:52px;letter-spacing:-.03em">${n}</span><span class="mono" style="font-size:24px">${c}</span></div>`).join('')
  page({
    name: '04-piles', title: 'Piles', body: `
    ${phone({ x: 170, y: 110, u: 1, src: SS + '03-piles.png' })}
    ${label(L, 118, 'Saved')}
    ${rows(saved, 156)}
    ${label(L, 528, 'Doing')}
    ${rows(doing, 566)}
    ${label(L, 960, '<b>40</b>&nbsp;things, eight piles', '')}
  `})
}

/* ---------- 05 dig ---------- */
page({
  name: '05-dig', title: 'Dig', body: `
  ${label(110, 118, '<b>03</b>&nbsp;&nbsp;Dig')}
  <div class="abs" style="left:110px;top:300px;width:960px;height:128px;border:1px solid var(--line-strong);border-radius:64px;display:flex;align-items:center;padding:0 52px;gap:30px">
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#8B8F94" stroke-width="1.4" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
    <span class="disp" style="font-size:52px;letter-spacing:-.025em;color:var(--bone)">that address mom sent</span>
  </div>
  ${label(110, 520, 'Found')}
  <div class="abs disp" style="left:108px;top:566px;font-size:62px;line-height:1.14">48 Willow Creek Dr, Apt 3B,<br>Brooklyn NY 11215</div>
  ${hline(110, 780, 960)}
  ${label(110, 806, 'From Mom&nbsp;&nbsp;/&nbsp;&nbsp;In Places')}
  ${label(110, 984, 'Ask in plain words', 'opacity:.7')}
  ${phone({ x: 1250, y: 110, u: 1, src: SS + '05-dig.png' })}
`})

/* ---------- 06 icon / homescreen ---------- */
{
  const ladder = [120, 80, 58, 40, 29]
  let lx = 110
  const lad = ladder.map(s => { const el = `<div class="abs" style="left:${lx}px;top:${880 - s}px"><img src="${A}app-icon-dark.svg" width="${s}" height="${s}" alt="" style="display:block"><div class="mono" style="font-size:13px;margin-top:14px">${s}</div></div>`; lx += s + 30; return el }).join('')
  // construction grid: 64-unit box drawn at 4.4px per unit
  const gs = 280, k = gs / 64
  const gl = []
  for (let i = 0; i <= 64; i += 4) {
    const maj = i % 16 === 0, o = maj ? .26 : .09
    gl.push(`<path d="M${i} 0V64M0 ${i}H64" stroke="#EEEEEC" stroke-opacity="${o}" stroke-width="${maj ? .2 : .14}"/>`)
  }
  const cons = `<svg class="abs" style="left:700px;top:600px" width="${gs}" height="${gs}" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${gl.join('')}
    <rect x=".1" y=".1" width="63.8" height="63.8" stroke="#EEEEEC" stroke-opacity=".3" stroke-width=".2"/>
    <g stroke="#EEEEEC" stroke-width="1.2"><rect x="5.5" y="11" width="53" height="6" rx="1.8"/><path d="M9.5 17V45.5H51L54.5 17Z"/><path d="M9.5 26H53.3"/><rect x="16" y="32" width="22" height="5" rx="1.4"/><path d="M15 45.5v2M45 45.5v2"/><circle cx="15" cy="50" r="2.6"/><circle cx="45" cy="50" r="2.6"/></g>
    <g stroke="#EEEEEC" stroke-opacity=".45" stroke-width=".2" stroke-dasharray="1 1"><path d="M5.5 11V8M58.5 11V8M5.5 8H58.5"/><path d="M9.5 45.5H4M15 52.6V58M45 52.6V58M15 58H45"/></g>
  </svg>`
  page({
    name: '06-icon-homescreen', title: 'Icon', w: 1080, h: 1080,
    light: `radial-gradient(circle at 50% 22%, rgba(222,228,233,.12), transparent 48%), radial-gradient(circle at 12% 92%, rgba(176,183,189,.04), transparent 40%)`,
    body: `
    <img class="abs" src="${A}app-icon-dark.svg" style="left:340px;top:100px;width:400px;height:400px;filter:drop-shadow(0 40px 80px rgba(222,228,233,.10))" alt="Dumpster app icon">
    ${label(110, 690, 'Size ladder')}
    ${lad}
    ${label(700, 560, 'Construction&nbsp;&nbsp;/&nbsp;&nbsp;64 grid')}
    ${cons}
    ${hline(110, 940, 860)}
    ${label(110, 968, 'App icon', 'opacity:.7')}
    ${label(700, 968, '1024 to 29 px', 'opacity:.7')}
  `})
}

/* ---------- 07 share ---------- */
{
  const u = 0.9, w = 406 * u
  const x1 = 860, x2 = 1320
  page({
    name: '07-share', title: 'Share', body: `
    ${label(110, 330, 'Share sheet')}
    <div class="abs disp" style="left:106px;top:380px;font-size:96px;line-height:1.04">Dump from<br>anywhere.</div>
    <div class="abs" style="left:110px;top:640px;width:560px;font-size:26px;line-height:1.5;color:var(--dim)">Share a link, a photo or a place from any app. It lands in the thread and files itself.</div>
    ${phone({ x: x1, y: 130, u, src: SS + '07-share.png' })}
    ${phone({ x: x2, y: 130, u, src: SS + '07b-share-compose.png' })}
    ${hline(x1 + w + 24, 530, x2 - x1 - w - 48, 'background:rgba(238,238,236,.3)')}${dot(x1 + w + 24, 530)}${dot(x2 - 24, 530)}
    ${labelC(x1 + w / 2, 960, '<b>01</b>&nbsp;&nbsp;Share', 400)}
    ${labelC(x2 + w / 2, 960, '<b>02</b>&nbsp;&nbsp;Dump it', 400)}
  `})
}

/* ---------- 08 paper ---------- */
{
  const sw = (bg, name, hex, ring) => `<div style="display:flex;align-items:center;gap:16px"><i style="display:block;width:34px;height:34px;border-radius:50%;background:${bg};${ring ? 'box-shadow:inset 0 0 0 1px rgba(14,14,15,.25)' : ''}"></i><div><div class="label" style="font-size:12px;color:#0E0E0F">${name}</div><div class="mono" style="font-size:13px;margin-top:4px">${hex}</div></div></div>`
  page({
    name: '08-paper', title: 'Paper', paper: true, body: `
    ${lockup(110, 96, 34, true)}
    ${label(110, 300, 'Paper mode')}
    <div class="abs disp" style="left:106px;top:348px;font-size:112px;line-height:1.02;color:#0E0E0F">Same thread.<br><span style="opacity:.45">In daylight.</span></div>
    <div class="abs" style="left:110px;top:640px;width:560px;font-size:26px;line-height:1.5;color:rgba(14,14,15,.56)">Dark first, with a light theme for bright rooms. Sent messages stay blue in both.</div>
    ${hline(110, 800, 640)}
    <div class="abs" style="left:110px;top:836px;display:flex;gap:56px">${sw('#F4F1EC', 'Paper', '#F4F1EC', true)}${sw('#0E0E0F', 'Ink', '#0E0E0F')}${sw('#2B5CFF', 'Sent', '#2B5CFF')}</div>
    <div class="persp" style="left:1000px;top:0;width:760px;height:1080px">
      <div class="glow" style="--u:1px;left:80px;top:905px"></div>
      <div class="tilt" style="position:absolute;left:150px;top:110px;width:406px;height:860px;transform:rotateY(-18deg) rotateX(3deg) rotateZ(1deg)">
        <div class="phone" style="--u:1px;left:0;top:0"><i class="btn l1"></i><i class="btn l2"></i><i class="btn l3"></i><i class="btn r1"></i><div class="scr"><img src="${SS}10-paper-dump.png" alt=""></div></div>
      </div>
    </div>
  `})
}

/* ---------- 09 social square ---------- */
page({
  name: '09-social-square', title: 'Social square', w: 1080, h: 1080,
  light: `radial-gradient(circle at 74% 70%, rgba(222,228,233,.1), transparent 46%), radial-gradient(circle at 12% 12%, rgba(176,183,189,.04), transparent 40%)`,
  body: `
  ${lockup(80, 80, 26)}
  <div class="abs disp" style="left:74px;top:200px;font-size:176px;line-height:.98">Dump it.<br><span style="opacity:.5">Find it.</span></div>
  ${bubble(20, 900, 'that address mom sent', { fs: 26, rot: -8, op: .10 })}
  ${bubble(90, 810, '48 Willow Creek Dr', { fs: 28, rot: -8, op: .22 })}
  ${bubble(170, 700, '48 Willow Creek Dr, Apt 3B', { fs: 30, rot: -8, pad: '22px 30px' })}
  <div class="abs" style="left:680px;top:560px">${markSvg({ w: 320, vb: '0 -22 64 86', lid: -34, sw: 1.15 })}</div>
  ${label(80, 1000, 'Text yourself, but it remembers')}
`})

/* ---------- 10 story ---------- */
page({
  name: '10-story', title: 'Story', w: 1080, h: 1920,
  light: `radial-gradient(circle at 70% 70%, rgba(222,228,233,.11), transparent 46%), radial-gradient(circle at 20% 10%, rgba(176,183,189,.05), transparent 40%)`,
  body: `
  ${lockup(80, 250, 30)}
  <div class="abs disp" style="left:70px;top:440px;font-size:200px;line-height:.98">Dump it.<br><span style="opacity:.5">Find it.</span></div>
  ${bubble(20, 1470, 'that address mom sent', { fs: 30, rot: -8, op: .10 })}
  ${bubble(70, 1370, '48 Willow Creek Dr', { fs: 32, rot: -8, op: .22 })}
  ${bubble(110, 1250, '48 Willow Creek Dr, Apt 3B', { fs: 34, rot: -8, pad: '24px 34px' })}
  <div class="abs" style="left:640px;top:1060px">${markSvg({ w: 340, vb: '0 -22 64 86', lid: -34, sw: 1.1 })}</div>
  ${label(80, 1730, 'Text yourself, but it remembers')}
`})

/* ---------- 11 mark motion ---------- */
{
  const M = 100, CW = (1920 - 2 * M) / 6
  const vb = '-5 -24 74 88', mw = 220
  const frames = [
    { n: 'Closed', t: '0 ms', svg: markSvg({ w: mw, vb, lid: 0 }) },
    { n: 'Lid opens', t: '180 ms', svg: markSvg({ w: mw, vb, lid: -42, bubble: { x: 48, y: -13, bw: 22, bh: 9 } }) },
    { n: 'Message drops', t: '420 ms', svg: markSvg({ w: mw, vb, lid: -42, bubble: { x: 24, y: 10.5, bw: 16, bh: 7, clip: 17.2 } }) },
    { n: 'Lid shuts, glint', t: '700 ms', svg: markSvg({ w: mw, vb, lid: 0, glint: 1 }) },
    { n: 'Filed', t: '900 ms', svg: markSvg({ w: mw, vb, lid: 0, glint: .3 }), extra: '<span class="label" style="font-size:12px">Filed&nbsp;&nbsp;&rarr;&nbsp;&nbsp;<b>Places</b></span>' },
    { n: 'Places', t: '1200 ms', svg: markSvg({ w: 139, vb, lid: 0, style: 'margin-top:68px' }), extra: `<div style="width:190px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);height:56px;display:flex;justify-content:space-between;align-items:center;margin-top:20px"><span class="disp" style="font-size:24px">Places</span><span class="mono" style="font-size:16px;color:var(--bone)">06</span></div>` },
  ]
  page({
    name: '11-mark-motion', title: 'Mark motion',
    light: `radial-gradient(circle at 50% 46%, rgba(222,228,233,.08), transparent 50%)`,
    body: `
    ${label(M, 100, 'The send')}
    <div class="abs disp" style="left:${M - 3}px;top:150px;font-size:68px">One message. 1.2 seconds.</div>
    ${hline(M, 330, 1720)}${hline(M, 850, 1720)}
    ${frames.map((f, i) => {
      const x = M + i * CW
      return (i ? vline(x, 330, 520) : '') +
        `<div class="abs mono" style="left:${x + 24}px;top:352px;font-size:14px">0${i + 1}</div>` +
        `<div class="abs" style="left:${x}px;top:400px;width:${CW}px;display:flex;flex-direction:column;align-items:center">${f.svg}${f.extra ? `<div style="margin-top:${i === 4 ? 30 : 0}px;display:flex;flex-direction:column;align-items:center">${f.extra}</div>` : ''}</div>` +
        labelC(x + CW / 2, 884, f.n, CW, 'font-size:13px;letter-spacing:.26em') +
        monoC(x + CW / 2, 922, f.t, CW, 'font-size:14px')
    }).join('')}
    ${label(M, 1000, 'Quick and physical. Everything else is slow.', 'opacity:.7')}
  `})
}

console.log('scenes built')
