# Dumpster — Project Spec (source of truth)

> Range Of View Studios · design + front-end only (no backend). Every agent working on this project reads this file first. If something here conflicts with your instinct, this file wins.

## 1. The product

**Dumpster** — a chat-first app that replaces texting yourself. You dump anything into one thread (links, addresses, photos, screenshots, voice notes, half-thoughts). Dumpster quietly sorts it into **Piles** and lets you **Dig** it back up in plain language.

- **Tagline:** "Dump it. Find it."  (alt: "Text yourself, but it remembers.")
- **The problem:** Mom texts an address → you text it to yourself → it's gone forever. You want to watch a video later → it's buried under 400 messages. Notion is too much work. People won't organize; they'll only dump.
- **The promise:** Zero effort in. Organized out.
- **Platforms:** iOS + Android (this phase: web prototype only).

## 2. Locked decisions

| Area | Decision |
|---|---|
| Palette | **Hazard Yellow** — loud yellow base, cream surfaces, black ink, pile accent colors |
| Mascot | **Raccoon** ("Scraps") — a trash panda who digs for your stuff. Empty states, onboarding, loading, app icon |
| Voice | **Playful, light touch** — puns only at key moments (Toss it, Piles, Dig, Scraps). Everything else plain & clear |
| Demo tech | **React + Vite** web prototype, mobile-first, PWA-installable, phone-frame on desktop |
| Style | **Neo-brutalism** — thick black borders, hard offset shadows (no blur), flat fills, chunky type, folder-tab cards |

## 3. Design tokens (use exactly)

```css
:root {
  /* Base */
  --yellow: #FFD23F;      /* hazard yellow — app chrome, hero bg */
  --cream: #FFF8EC;       /* surfaces, cards */
  --paper: #FFFFFF;
  --ink: #111111;         /* borders, text, shadows */
  --ink-2: #4A4A4A;       /* secondary text */
  --ink-3: #8A8A8A;       /* meta / timestamps */

  /* Pile accents (each pile owns one) */
  --pink: #FF5C8A;        /* Places */
  --violet: #7B61FF;      /* Watch Later */
  --lime: #A3E635;        /* Reads */
  --sky: #3EC1F3;         /* Shopping */
  --orange: #FF8A3D;      /* People */
  --mint: #4ADE9B;        /* To-dos */
  --butter: #FFE58F;      /* Ideas */
  --stone: #BDBDBD;       /* Unsorted */

  /* Semantic */
  --success: #4ADE9B; --danger: #FF4D4D;

  /* Brutalist system */
  --border: 2.5px solid var(--ink);
  --border-thick: 3px solid var(--ink);
  --shadow-sm: 2px 2px 0 var(--ink);
  --shadow: 4px 4px 0 var(--ink);
  --shadow-lg: 6px 6px 0 var(--ink);
  --radius-sm: 8px; --radius: 14px; --radius-lg: 20px; --radius-pill: 999px;

  /* Spacing (4pt) */
  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s5: 20px; --s6: 24px; --s8: 32px; --s10: 40px;

  /* Type */
  --font-display: "Archivo", system-ui, sans-serif;  /* 800–900, slightly expanded (wdth 110–125) */
  --font-body: "DM Sans", system-ui, sans-serif;     /* 400/500/700 */
  --font-mono: "JetBrains Mono", ui-monospace, monospace; /* timestamps, counts, meta */
}
```

**Interaction rule:** pressable things sit at `--shadow`; on press they translate `(+3px,+3px)` and shadow drops to `--shadow-sm`/none ("button squish"). Motion is snappy (120–180ms, slight overshoot), never floaty.

**Type scale:** Display 40/44 · H1 32/36 · H2 24/28 · H3 18/22 · Body 16/24 · Small 14/20 · Meta 12/16 mono.

Google Fonts: `Archivo:wdth,wght@100..125,400..900`, `DM Sans:wght@400;500;700`, `JetBrains Mono:wght@400;600`.

## 4. Brand assets

- **Wordmark:** "dumpster" lowercase, Archivo Black-weight expanded, with a hard shadow. The "o"-less word — consider the lid of a bin as the dot/accent above or a tilted letter.
- **Logomark / app icon:** Scraps the raccoon peeking over the rim of a black-outlined bin on yellow. Must read at 29px.
- **Mascot "Scraps":** flat, thick-outline, 2–3 flat colors + ink. Poses needed: peeking (default), digging (search/loading), holding item (saved confirm), sleeping (empty state), waving (onboarding).
- All mascot/logo art = hand-built inline SVG.

## 5. Voice

Grounded, warm, a little cheeky. Puns live on: CTA verbs and nav only.
- Nav: **Dump · Piles · Dig**
- Save confirm: "Tossed in **Places**." · Empty: "Nothing here yet. Scraps is bored."
- Search placeholder: "Dig for anything… 'that address mom sent'"
- Don't: "Trash talk!", "Garbage in, gold out!!", emoji spam.

## 6. UX architecture

**Tabs:** Dump (home) · Piles · Dig — plus settings gear top-left.

1. **Onboarding (3 screens):** Scraps waves → "Text yourself, but it remembers" → "Share from anywhere" (share-sheet illustration) → Start dumping.
2. **The Dump (home):** single self-chat thread. Composer with `+` (photo, voice, file), paste-detect. Each sent message renders as a **smart card** by type:
   - Link → video/article preview card
   - Address → mini map pin card (+ "Open in Maps")
   - Plain note → bubble
   - To-do-ish text ("buy batteries") → checkbox card
   - Image/screenshot → image card with extracted text chip
   - Voice note → waveform card w/ transcript
   Beneath each: a **filing chip** "→ Places · from Mom" (tap to move pile). AI "Scraps is sorting…" typing indicator (~700ms) before the chip appears.
3. **Piles:** grid of folder-tab cards (ref image 1), each colored by pile, with count + last item. Pile detail = filtered list of cards + sub-filters (e.g., Watch Later: YouTube / TikTok / Articles).
4. **Dig:** natural-language search. Suggested digs as chips. Results return as a chat-style answer from Scraps + matching cards.
5. **Item detail sheet:** original message, extracted fields (address, source, date, who sent it), actions: Open, Remind me, Move pile, Share, Delete.
6. **Resurface:** a "Remember this?" card at top of Dump once per day (e.g., an unwatched video from 2 weeks ago).
7. **Share-sheet mock:** iOS-style share sheet with Dumpster target → mini compose → "Tossed in Watch Later."

**Mock AI:** rule-based classifier (URL domain → Watch Later/Reads/Shopping; address regex → Places; "buy/get/call/remember to" → To-dos; else Ideas/Unsorted). Seed ~40 realistic items across piles. Persist to localStorage.

## 7. Deliverables & folders

```
dumpster/
  PLAN.md                 ← this file
  brand/                  ← 1. brand kit + guidelines
    index.html            (single-page guide: logo, mascot, color, type, tokens, components, voice, do/don't)
    assets/               (logo.svg, wordmark.svg, icon.svg, mascot-*.svg, tokens.css, tokens.json)
  app/                    ← 2. React + Vite demo (mock, no backend)
  showcase/               ← 3. UI mockup scenes (HTML compositions → exported PNGs in showcase/exports/)
  press/                  ← 4. press kit (index.html + downloadable assets)
```

## 8. Build order

1. Brand kit (establishes `brand/assets/tokens.css` + SVG assets everyone imports)
2. In parallel: App demo · Showcase · Press kit (showcase & press use app screenshots/screens — showcase may render app screens live via iframe or rebuild them statically)
3. Review pass vs. reference images (neo-brutal, folder-tab cards, colored hard shadows, chunky type)

## 9. Quality bar

- Looks like the references: yellow/cream, 2.5px ink borders, hard shadows, folder tabs, chunky display type.
- No generic AI-slop: no purple gradients, no glassmorphism, no blurred shadows, no emoji as icons (use a consistent icon set — Phosphor Bold or hand SVG).
- Accessible: text contrast AA on all fills, 44px touch targets, focus states (thick ink outline).
- Works at 375px wide with no horizontal scroll.
