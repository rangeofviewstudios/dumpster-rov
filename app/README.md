# Dumpster demo app (v2, "after dark")

Front-end only demo of **Dumpster**, the chat-first app that replaces texting yourself. Mock data, rule-based "AI", no backend. By Range Of View Studios. Spec: `../PLAN.md` (v2 tokens and UI rules). Look reference: `../moodboard/index.html`.

React + Vite + TypeScript, plain CSS, framer-motion for sheets and fades. The send animation uses the Web Animations API.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve dist/ at http://localhost:4173
```

`predev` and `prebuild` run `scripts/sync-brand.mjs`. It copies `../brand/assets` into `public/brand` and regenerates `src/generated/brandIcons.ts` (inline icons plus `scraps-fineline` and `glint` art). Every step is optional: if the brand kit is missing or half-built, the app falls back to its own inline icons, mark and raccoon. Never edit the generated file.

The app does not import the brand's `tokens.css`. Tokens live in `src/styles/theme.css`, copied from PLAN.md section 3.

## What changed from v1

- Void background with drifting light and grain, hairlines instead of boxes, Space Grotesk / Geist / Geist Mono, uppercase tracked labels.
- Blue `#2B5CFF` appears only on messages you send (sent bubbles and the send flight). Everything Dumpster renders is a graphite card with a 1px border.
- Piles are a plain grouped list (Saved, Doing). Pile detail uses hairline filter pills.
- Scraps only appears as a fine-line easter egg on an empty Dig result.
- Dark first, plus a "paper" light mode in Settings (stored in `localStorage` under `dumpster.theme.v1`, driven by `[data-theme]` on `<html>`).

## The signature send

Sending anything in Dump plays one ~1.2s sequence: the blue bubble lifts out of the composer and flies into a dumpster mark above it, the lid hinges open, the message shrinks and drops in, the lid shuts, a four-point glint flashes, then the item appears in the thread as its smart card with the `FILED → PLACES · FROM MOM` label fading in. Reduced motion collapses it to a fade.

- `src/lib/sendFlight.ts`: the timeline (`playSend`), pure DOM/WAAPI.
- `src/components/FlightStage.tsx`: markup + wiring. `variant="thread"` in Dump, `variant="demo"` on onboarding screen 2 (loops).
- `src/components/Mark.tsx`: `DumpsterMark` (inline SVG with a `lid` group), `Glint`, `Wordmark`. Geometry is ported from `brand/assets/mark-animated.svg`. To change the mark, edit the constants at the top of that file.
- `src/styles/flight.css`: positions only.

## Thread model

In the Dump thread every item is a blue sent bubble with its original text (the raw URL, address, to-do text, or a caption like "Voice note"). Rich kinds attach a slightly narrower graphite smart card 6px beneath it, then the filing label. Plain notes are the bubble only. Pile detail and Dig show the cards without bubbles.

## Deep-link URL params (for screenshots)

Any of `screen`, `pile`, `q`, `sheet`, `share` skips first-visit onboarding.

| Param | Example | Result |
|---|---|---|
| `screen` | `?screen=piles` | `dump`, `piles` or `dig` |
| `pile` | `?pile=watch` | Pile detail (`places watch reads shopping people todos ideas unsorted`) |
| `q` | `?screen=dig&q=address%20from%20mom` | Runs a dig |
| `sheet` + `id` | `?sheet=item&id=mom-addr` | Item sheet. `sheet=picker&id=...` opens the pile picker, `sheet=settings` opens Settings |
| `onboarding` + `step` | `?onboarding=1&step=2` | Onboarding at step 1 to 3 |
| `share` | `?share=1` | Share-sheet simulation |
| `theme` | `?theme=paper` | Previews `paper` or `dark` without saving it |

Useful seed ids: `mom-addr`, `jay-ramen`, `yt-cast-iron`, `img-wifi`, `voice-trip`, `todo-batteries`, `ikea-kallax`.

Screenshot capture: use DevTools device-metrics emulation (390x844 at 3x, `mobile: true`). Plain `--window-size` makes the app lay out too wide.

## Structure

```
src/lib/        types, piles, classifier (rule-based), seed, dig (fuzzy + synonyms), store (localStorage), ui (sheets + toasts), params, theme, sendFlight
src/components/ screens (Dump, Piles, Dig), cards/ (link, address, to-do, note, image, voice, file), sheets, share sim, onboarding, Mark, FlightStage
src/styles/     theme.css (tokens, base, buttons, shell, tab bar, toast), screens, cards, sheets, flight
```

State persists in `localStorage` (`dumpster.items.v1`, `dumpster.onboarded.v1`, `dumpster.theme.v1`). Settings resets the data or replays onboarding.

## Known gaps

- Mock AI only: the classifier is regex and domain rules, thumbnails are drawn line motifs, voice transcripts are canned.
- Service worker is a minimal network-first cache. PWA icons are resized from `brand/assets/app-icon-1024.png`; rerun the resize if the icon changes.
- Fonts load from Google Fonts, so first load needs a connection.
- No focus trap inside sheets (Escape closes, focus moves into the sheet).
- While a send is in flight (about 1.2s) the composer is disabled, so sends are one at a time.
