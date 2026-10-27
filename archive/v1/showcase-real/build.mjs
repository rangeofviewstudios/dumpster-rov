// Branded photoreal scenes: renders/*.png (from composite.py) + app UI layered on top.
// Run: node build.mjs && ./export.sh   -> exports/*.png at 3072px (1.6x)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const dir = path.dirname(fileURLToPath(import.meta.url))
const A = '../../../brand/assets/'
const R = '../renders/'
const S = '../../shots/'
fs.mkdirSync(path.join(dir, 'scenes'), { recursive: true })

function page({ name, title, w = 1920, h = 1080, photo, body }) {
  fs.writeFileSync(path.join(dir, 'scenes', name + '.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Dumpster real / ${title}</title>
<meta name="viewport" content="width=${w}">
<link rel="stylesheet" href="${A}tokens.css"><link rel="stylesheet" href="../../scenes/scene.css"><link rel="stylesheet" href="real.css">
<style>:root{--w:${w}px;--h:${h}px;--bg:#222}</style></head>
<body><div class="art" id="art"><img class="photo" src="${R}${photo}.png" alt="">
${body}
</div></body></html>`)
}

const wm = (kind, h) => `<img src="${A}wordmark${kind}.svg" style="height:${h}px;display:block" alt="dumpster">`
const ico = (n) => `<img src="${A}icons/${n}.svg" alt="">`
const chipLg = (label, fill, dot, num) => `<span class="chip-lg" style="--fill:${fill};--dot:${dot}">${num ? `<b>${num}</b>` : `<i></i>`}${label}</span>`
const at = (x, y, html, { r = 0, z = 5, cls = 'float' } = {}) =>
  `<div class="abs ${cls}" style="left:${x}px;top:${y}px;transform:rotate(${r}deg);z-index:${z}">${html}</div>`
const toast = (t, sh = 'var(--pink)') => `<span class="toast-big" style="box-shadow:10px 10px 0 ${sh}">${t}</span>`
const fileChip = (pile, col, from) =>
  `<span class="chip-md" style="--fill:var(--cream)"><i class="sq" style="background:${col}"></i>&rarr; ${pile}${from ? ` &middot; from ${from}` : ''}</span>`

const piles = {
  places: ['Places', 'var(--pink)', '05', 'parking behind the building, code 4471', 'places'],
  watch: ['Watch Later', 'var(--violet)', '08', 'Pasta water is a sauce ingredient', 'watch'],
  reads: ['Reads', 'var(--lime)', '05', 'Best budget mechanical keyboards', 'reads'],
  shopping: ['Shopping', 'var(--sky)', '04', 'Hemnes bedside table, black-brown', 'shopping'],
  people: ['People', 'var(--orange)', '03', "Jay's birthday is Nov 12", 'people'],
  todos: ['To-dos', 'var(--mint)', '07', 'call mom about Sunday', 'todos'],
}
const fcard = (k, x, y, r, z = 6) => {
  const [n, c, cnt, last, ic] = piles[k]
  return `<div class="fcard nb-folder nb-folder--filled float" style="--tab:${c};left:${x}px;top:${y}px;transform:rotate(${r}deg);z-index:${z}">
  <div class="nb-folder__body"><span class="cnt">${cnt}</span><span class="nb-icon-tile" style="--tile:var(--cream)">${ico(ic)}</span><h4>${n}</h4><p>${last}</p></div></div>`
}
const pastaCard = (w) => `<div class="vcard" style="width:${w}px">
  <div class="vtop"><span class="vtag">YouTube</span><b>PASTA WATER</b>
  <svg class="vico" width="92" height="74" viewBox="0 0 92 74" fill="none" stroke="#111" stroke-width="4.5" stroke-linecap="round"><path d="M28 6c-4 5 4 8 0 14M40 4c-4 5 4 8 0 14M64 2L52 22"/><path d="M8 32h66c0 16-14 26-33 26S8 48 8 32z" fill="#FFD23F"/><circle cx="72" cy="52" r="15" fill="#FFF8EC"/><path d="M68 44v16l12-8z" fill="#111" stroke-width="2"/></svg></div>
  <div class="vhatch"></div>
  <div class="vbody"><h5>Pasta water is a sauce ingredient</h5><span>youtube.com</span></div></div>`
const search = (q, w) => `<div class="search" style="width:${w}px">
  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>
  <span>${q}</span><i class="caret"></i></div>`

/* 01 hero: hand, yellow wall */
page({ name: 'r01-hero', title: 'Hero', photo: 'p01-wall-hand', body: `
  <div class="abs" style="left:330px;top:130px">${wm('', 92)}</div>
  <div class="abs disp" style="left:326px;top:300px;font-size:140px;line-height:.98">Dump it.<br><span class="hl">Find it.</span></div>
  <div class="abs body-l" style="left:330px;top:676px;font-size:36px">Text yourself, but it remembers.</div>
  <div class="abs" style="left:330px;top:764px;display:flex;gap:16px">
    ${chipLg('Dump', 'var(--cream)', 'var(--yellow)')}${chipLg('Piles', 'var(--cream)', 'var(--violet)')}${chipLg('Dig', 'var(--cream)', 'var(--sky)')}</div>
  ${at(930, 236, fileChip('Places', 'var(--pink)', 'Jay'), { r: -5 })}
  ${at(1050, 606, fileChip('Watch Later', 'var(--violet)'), { r: 4 })}
  ${at(980, 905, toast('Tossed in Places.'), { r: -3, z: 7 })}
  <div class="abs mono" style="left:330px;top:990px;font-size:17px">Range Of View Studios &nbsp;/&nbsp; Dumpster UI concept</div>
`})

/* 02 cafe: just filed */
page({ name: 'r02-cafe', title: 'Cafe', photo: 'p02-cafe-flatlay', body: `
  ${at(80, 680, `<div class="panel" style="width:640px"><span class="chip-md" style="--fill:var(--pink)">Auto-filed</span>
    <div class="disp" style="font-size:72px;margin-top:20px">Scraps<br>sorts it.</div>
    <p class="body-l" style="font-size:25px;margin-top:16px">Filed in the right Pile before you look away.</p></div>`, { r: -2 })}
  ${at(1330, 520, toast('Tossed in Places.'), { r: 4, z: 7 })}
  ${fcard('places', 1500, 660, 6)}
  ${at(1340, 130, fileChip('Places', 'var(--pink)', 'Mom'), { r: -6 })}
`})

/* 03 sofa: piles exploded */
page({ name: 'r03-sofa', title: 'Piles', photo: 'p03-sofa-shoulder', body: `
  ${at(80, 80, `<div class="panel" style="width:600px"><span class="chip-md" style="--fill:var(--violet);color:var(--cream)">Piles</span>
    <div class="disp" style="font-size:76px;margin-top:20px">Sorted<br>for you.</div>
    <p class="body-l" style="font-size:25px;margin-top:16px">No folders to make. Your stuff lands in the right Pile on its own.</p></div>`, { r: -1.5 })}
  ${fcard('watch', 1480, 70, 5)}
  ${fcard('places', 1580, 330, -4, 7)}
  ${fcard('todos', 1470, 600, 4)}
  ${fcard('reads', 780, 640, -5)}
  <svg class="abs" style="left:0;top:0;z-index:4" width="1920" height="1080" fill="none"><path d="M1395 420C1440 400 1450 300 1490 260M1395 520C1460 520 1520 470 1580 440M1395 640C1430 680 1450 700 1480 710" stroke="#FFF8EC" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 14"/></svg>
`})

/* 04 street: dig */
page({ name: 'r04-street', title: 'Dig', photo: 'p04-street', body: `
  ${at(110, 96, `<span class="chip-md" style="--fill:var(--sky)">Dig / plain-language search</span>`, { cls: '' })}
  ${at(104, 160, `<div class="panel" style="padding:18px 34px 26px;background:var(--yellow)"><div class="disp" style="font-size:88px">Dig for anything.</div></div>`, { r: -1 })}
  ${at(110, 380, search('that address mom sent', 900))}
  ${at(880, 515, `<span class="chip-md" style="--fill:var(--yellow)">Dug up 2 items</span>`, { r: 4, z: 8 })}
  <img class="abs float" src="${S}dig-mapcard.png" style="left:330px;top:560px;width:720px;border-radius:30px;box-shadow:12px 12px 0 var(--ink);transform:rotate(-2.5deg);z-index:6" alt="">
`})

/* 05 trio on paper */
const trioLabel = (cx, num, label, bar) => `
  <div class="abs" style="left:${cx - 230}px;top:958px;width:460px;text-align:center;z-index:5">
    <span class="chip-lg float" style="--fill:var(--cream)"><b>${num}</b>${label}</span>
    <div style="height:12px;width:140px;background:${bar};border:3.5px solid var(--ink);box-shadow:4px 4px 0 var(--ink);margin:16px auto 0"></div></div>`
page({ name: 'r05-trio', title: 'Trio', photo: 'p05-trio-paper', body: `
  <div class="abs disp" style="left:0;right:0;top:40px;text-align:center;font-size:64px">Dump. Piles. Dig.</div>
  ${trioLabel(452, '01', 'Dump', 'var(--yellow)')}
  ${trioLabel(960, '02', 'Piles', 'var(--violet)')}
  ${trioLabel(1468, '03', 'Dig', 'var(--sky)')}
`})

/* 06 kitchen: watch later */
page({ name: 'r06-kitchen', title: 'Watch Later', photo: 'p06-kitchen', body: `
  ${at(70, 60, `<div class="panel" style="width:600px"><span class="chip-md" style="--fill:var(--violet);color:var(--cream)">Watch Later</span>
    <div class="disp" style="font-size:70px;margin-top:20px">Save it now.<br>Cook it later.</div></div>`, { r: -1.5 })}
  ${at(500, 430, pastaCard(560), { r: -3 })}
  ${at(330, 790, toast('Tossed in Watch Later.', 'var(--violet)'), { r: 2, z: 7 })}
`})

/* 07 story: tiles */
page({ name: 'r07-story', title: 'Story', w: 1080, h: 1920, photo: 'p07-story-tiles', body: `
  <div class="abs" style="left:0;right:0;top:170px;text-align:center"><img src="${A}lockup.svg" style="height:96px;display:inline-block" alt="dumpster"></div>
  <div class="abs disp" style="left:0;right:0;top:330px;text-align:center;font-size:170px;line-height:.98">Dump it.<br><span class="hl">Find it.</span></div>
  ${at(700, 930, fileChip('Places', 'var(--pink)', 'Mom'), { r: 6 })}
  ${at(560, 1560, toast('Tossed in Places.'), { r: -4, z: 7 })}
  <div class="abs" style="left:0;right:0;top:1828px;text-align:center;z-index:5"><span class="chip-md" style="--fill:var(--cream)">Text yourself, but it remembers.</span></div>
`})

console.log('built')
