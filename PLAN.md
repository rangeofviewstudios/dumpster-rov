# Dumpster — Project Spec v2 (source of truth)

> Range Of View Studios · design + front-end only (no backend). Every agent reads this file first. **v2 replaces the v1 neo-brutalist direction entirely.** v1 is archived in `archive/v1/` for reference only — do not reuse its look.
>
> Visual reference for v2: `moodboard/index.html` (live at https://dumpster-rov.vercel.app/moodboard/). Inspiration: blackstar.inc. Approved by the founder on 2026-10-22.

## 1. The product (unchanged)

**Dumpster** — a chat-first app that replaces texting yourself. Dump anything into one thread (links, addresses, photos, screenshots, voice notes, half-thoughts). Dumpster sorts it into **Piles** and you **Dig** it back up in plain language.

- **Tagline:** "Dump it. Find it."  · Secondary: "Text yourself, but it remembers."
- **Problem:** Mom texts an address → you text it to yourself → it's gone. Notion is homework. People won't organize; they'll only dump.
- **Promise:** Zero effort in. Organized out.
- **Platforms:** iOS + Android (this phase: web prototype only).

## 2. Direction: "Dumpster, after dark"

Quiet, nocturnal, precise, archival, unbothered. A luxury object with a joke for a name. The restraint is the brand.

| Area | Decision |
|---|---|
| Base | Near-black, never flat: soft silver radial light + film grain |
| Color | Monochrome neutrals + **one color: Sent blue `#2B5CFF`, used only on messages the user sends** (bubbles, and the send flight). Nothing else in the UI is colored except user content (photos, thumbnails) |
| Lines | 1px hairlines at low opacity instead of boxes. No drop shadows, no thick borders, no hard offsets |
| Logo | **A fine-line dumpster** (front view: lid slab, open body, 3 ribs, 2 wheels) + wordmark "DUMPSTER" in wide uppercase Space Grotesk 500 |
| Signature interaction | **Every sent message flies into the dumpster.** Lid opens → message shrinks and drops in → lid shuts → tiny four-point glint → "FILED → PLACES" fades in. The send button is the dumpster glyph |
| Mascot | Scraps the raccoon is **retired from the brand front**. Only a rare fine-line easter egg (e.g. empty Dig result, long-press on logo) |
| Modes | **Dark-first**, plus a light "paper" mode (bone background, ink text, same blue for sent) |
| Voice | Fewer words. Dry wit, not puns. Lowercase-friendly UI, uppercase tracked micro-labels |
| Motion | Slow and ambient (drifting light, 200–600ms fades). Only the send flight is quick and physical. Nothing bouncy |

## 3. Design tokens (use exactly)

```css
:root {
  /* Neutrals */
  --void: #070707;       /* base background */
  --ink: #0E0E0F;        /* surfaces */
  --graphite: #17181A;   /* raised surfaces, sheets */
  --smoke: #24262A;      /* pressed / hover */
  --ash: #8B8F94;        /* secondary text, icons */
  --bone: #EEEEEC;       /* primary text */
  --paper: #F4F1EC;      /* light mode bg, print */

  /* The one color */
  --sent: #2B5CFF;       /* outgoing messages only. White text = 5.1:1 */
  --sent-press: #2149D6;

  /* Lines & opacity */
  --line: rgba(238,238,236,.12);
  --line-strong: rgba(238,238,236,.24);
  --dim: rgba(238,238,236,.52);   /* body copy on dark */

  /* Semantic (use sparingly, desaturated) */
  --danger: #E5484D;

  /* Radii */
  --r-xs: 4px; --r-sm: 10px; --r-md: 16px; --r-lg: 24px; --r-pill: 999px;
  /* Sent bubble: 16px 16px 4px 16px */

  /* Spacing (4pt) */
  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s5: 20px; --s6: 24px; --s8: 32px; --s10: 40px; --s12: 48px; --s16: 64px;

  /* Type */
  --font-display: "Space Grotesk", system-ui, sans-serif; /* headings 300–500, labels */
  --font-body: "Geist", system-ui, sans-serif;            /* text + UI, 300–500 */
  --font-mono: "Geist Mono", ui-monospace, monospace;     /* timestamps, counts, sources */

  /* Motion */
  --ease-out: cubic-bezier(.2,.8,.2,1);
  --ease-drop: cubic-bezier(.55,0,.8,.3);
}
```

Light "paper" mode: `--void: #F4F1EC; --ink: #ECE8E1; --graphite: #E4DFD7; --bone: #0E0E0F; --ash: #6B6F74; --line: rgba(14,14,15,.12); --line-strong: rgba(14,14,15,.24); --dim: rgba(14,14,15,.56)`; `--sent` unchanged.

**Background recipe (dark):** `--void` + 3–4 faint radial gradients (rgba(222,228,233,.03–.07)) + SVG feTurbulence grain overlay at ~6–8% opacity, `mix-blend-mode: overlay`. Light layers drift slowly (15–20s).

**Type scale:** Display 64/64 light (-0.03em) · H1 40/44 · H2 28/32 · H3 18/24 (500) · Body 16/24 (300–400) · Small 14/20 · Label 11.5px uppercase, letter-spacing .28–.32em · Meta 12px mono.

Google Fonts: `Space Grotesk:wght@300;400;500;600`, `Geist:wght@300;400;500`, `Geist Mono:wght@400`.

## 4. UI rules

- Sent messages: blue bubble, white text, no border, right-aligned, radius 16/16/4/16.
- Everything Dumpster renders (smart cards: link, map, to-do, image, voice): ink/graphite surface, 1px `--line-strong` border, radius 10–16, bone text. Map = hairline grid with a glowing bone pin.
- Filing label under a sent item: uppercase tracked `FILED → PLACES · FROM MOM` in `--dim` with the pile name in `--bone`. Tap to move.
- Piles: a plain list (like Blackstar's open roles): name left, mono count right, 1px dividers, grouped under small headings (Saved / Doing). Pile detail = same list of cards.
- Dig: hairline search field, results as a quiet answer line + cards.
- Tab bar: uppercase tracked text labels DUMP · PILES · DIG (active = bone, others = dim), optional hairline above.
- Buttons: primary = bone fill with void text (pill); secondary = hairline pill. Send = bone circle containing the dumpster glyph.
- Icons: 1.5px fine-line, round caps, currentColor.
- No: thick borders, offset shadows, gradients as fills, bright pile colors, emoji, bounce/squish.

## 5. Deliverables & folders (rebuild all in v2)

```
dumpster/
  PLAN.md                 ← this file
  moodboard/              ← approved direction (reference)
  brand/                  ← brand kit + guidelines v2 (logo, mark, color, type, UI rules, motion, voice)
    assets/               (tokens.css, tokens.json, logo svgs, icons)
  app/                    ← React + Vite demo, reskinned to v2 (same flows/data)
  showcase/               ← UI mockup scenes v2 → showcase/exports/*.png
  press/                  ← press kit v2
  deploy/                 ← build-site.sh + hub.html → Vercel project dumpster-rov
  archive/v1/             ← old neo-brutal work, reference only
```

Live: https://dumpster-rov.vercel.app (hub) · /app/ · /brand/ · /showcase/ · /press/ · /moodboard/
Redeploy: `bash deploy/build-site.sh && vercel deploy deploy/dumpster-rov --prod --yes`

## 6. Quality bar

- Should feel like blackstar.inc: restraint, space, grain, light. If in doubt, remove something.
- AA contrast for text (bone on void; white on sent blue 5.1:1; `--dim` only for 14px+ secondary text).
- 44px touch targets, visible focus (1px bone outline, 3px offset), `prefers-reduced-motion` respected (send flight becomes a fade).
- Works at 375px with no horizontal scroll.
