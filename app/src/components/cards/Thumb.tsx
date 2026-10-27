import type { ReactNode } from 'react'
import type { Item } from '../../lib/types'
import { Icon } from '../Icon'

function hash(text: string): number {
  let value = 0
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0
  return value
}

/** Fine-line motifs on an 80x80 canvas. Strokes inherit currentColor; `soft` parts drop to half opacity. */
const SOFT = 0.45
const MOTIFS: Record<string, ReactNode> = {
  pan: (
    <>
      <circle cx="34" cy="42" r="26" />
      <circle cx="34" cy="42" r="16" opacity={SOFT} />
      <path d="M59 38H74a4 4 0 0 1 0 8H59" />
    </>
  ),
  bowl: (
    <>
      <path d="M26 24c-6-6 6-8 0-14M40 24c-6-6 6-8 0-14M54 24c-6-6 6-8 0-14" opacity={SOFT} />
      <path d="M6 34h68a34 30 0 0 1-68 0z" />
      <path d="M58 6L40 34" />
    </>
  ),
  shelf: (
    <>
      <rect x="8" y="8" width="64" height="64" />
      <path d="M8 40h64M40 8v64" />
      <rect x="14" y="18" width="12" height="16" opacity={SOFT} />
      <rect x="48" y="48" width="14" height="18" opacity={SOFT} />
    </>
  ),
  lamp: (
    <>
      <path d="M26 8h28l10 30H16z" />
      <path d="M40 38v26" />
      <rect x="26" y="64" width="28" height="9" rx="3" opacity={SOFT} />
    </>
  ),
  desk: (
    <>
      <rect x="22" y="10" width="36" height="24" rx="3" />
      <path d="M40 34v8" opacity={SOFT} />
      <rect x="6" y="42" width="68" height="9" />
      <path d="M14 51v22M66 51v22" />
    </>
  ),
  battery: (
    <>
      <rect x="8" y="22" width="58" height="36" rx="6" />
      <rect x="66" y="33" width="9" height="14" rx="2" />
      <path d="M42 26L28 42h12l-4 14 14-18H38z" opacity={SOFT} />
    </>
  ),
  keyboard: (
    <>
      <rect x="4" y="20" width="72" height="42" rx="6" />
      {[12, 28, 44, 60].map((x) => <rect key={x} x={x} y="28" width="9" height="9" opacity={SOFT} />)}
      <rect x="18" y="44" width="44" height="9" opacity={SOFT} />
    </>
  ),
  speaker: (
    <>
      <rect x="18" y="6" width="44" height="68" rx="8" />
      <circle cx="40" cy="28" r="9" opacity={SOFT} />
      <circle cx="40" cy="54" r="12" opacity={SOFT} />
    </>
  ),
  moon: (
    <>
      <path d="M50 8a32 32 0 1 0 22 46A26 26 0 0 1 50 8z" />
      <circle cx="62" cy="14" r="1.5" opacity={SOFT} />
      <circle cx="72" cy="30" r="1.5" opacity={SOFT} />
    </>
  ),
  house: (
    <>
      <path d="M8 38L40 10l32 28v34H8z" />
      <rect x="32" y="48" width="16" height="24" opacity={SOFT} />
    </>
  ),
  plant: (
    <>
      <path d="M40 46C28 40 22 28 24 14c14 2 20 14 16 32zM40 46c12-6 18-18 16-32-14 2-20 14-16 32z" opacity={SOFT} />
      <path d="M24 46h32l-5 26H29z" />
    </>
  ),
  wrench: (
    <>
      <rect x="6" y="30" width="68" height="20" rx="6" transform="rotate(-30 40 40)" />
      <circle cx="40" cy="40" r="6" opacity={SOFT} />
    </>
  ),
  play: (
    <>
      <rect x="6" y="16" width="68" height="48" rx="10" />
      <path d="M33 29l19 11-19 11z" opacity={SOFT} />
    </>
  ),
}

const KEYWORDS: Array<[RegExp, keyof typeof MOTIFS]> = [
  [/cast iron|pan\b|skillet/i, 'pan'],
  [/pasta|noodle|ramen|soup|potato|sourdough|bakery|recipe|dinner|cacio/i, 'bowl'],
  [/shelf|kallax|storage/i, 'shelf'],
  [/bedside|lamp|hemnes/i, 'lamp'],
  [/desk|mat\b|standing/i, 'desk'],
  [/power bank|battery|anker|charger/i, 'battery'],
  [/keyboard/i, 'keyboard'],
  [/sonos|speaker|headphone/i, 'speaker'],
  [/sleep|night|bed\b/i, 'moon'],
  [/apartment|tour|house|home/i, 'house'],
  [/plant|pothos|garden/i, 'plant'],
  [/fix|tool|repair/i, 'wrench'],
]

function motifFor(item: Item): keyof typeof MOTIFS | 'letter' {
  const text = `${item.title ?? ''} ${item.url ?? ''}`
  const hit = KEYWORDS.find(([pattern]) => pattern.test(text))
  if (hit) return hit[1]
  return item.pile === 'watch' ? 'play' : 'letter'
}

/** A quiet texture along the bottom edge, varied per item. */
function Texture({ kind }: { kind: number }) {
  if (kind === 0) {
    return (
      <svg className="thumb__deco" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 30 }, (_, index) => <path key={index} d={`M${index * 12} 20L${index * 12 + 12} 0`} vectorEffect="non-scaling-stroke" />)}
      </svg>
    )
  }
  if (kind === 1) {
    return (
      <svg className="thumb__deco" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 2 }, (_, index) => <path key={index} d={`M0 ${index * 8 + 6}H300`} vectorEffect="non-scaling-stroke" />)}
      </svg>
    )
  }
  return null
}

// Filler words that make a cropped title read as a cut-off sentence ("PASTA WATER IS").
const WEAK = new Set(
  ("a an the is are was be been i i've you you've your my our it it's this that these to of for in on " +
    'with and or so do not have how why what when every ever best really tried try trying watering ' +
    'season make making made watch get got wrong just about from vs').split(' '),
)

function shortTitle(item: Item): string {
  const words = (item.title ?? item.domain ?? 'Link').replace(/[^\w\s'-]/g, '').split(/\s+/).filter(Boolean)
  const strong = words.filter((w) => !WEAK.has(w.toLowerCase()))
  return (strong.length ? strong : words).slice(0, 2).join(' ')
}

interface ThumbProps {
  item: Item
  label: string
  video: boolean
}

/** Monochrome cover art: bone line motif on graphite, title in Space Grotesk. Deterministic per item. */
export function Thumb({ item, label, video }: ThumbProps) {
  const seed = hash(item.id)
  const motif = motifFor(item)
  const letter = (item.domain ?? 'L').charAt(0).toUpperCase()

  return (
    <div className="thumb">
      <span className="thumb__tag label">{label}</span>
      <p className="thumb__title">{shortTitle(item)}</p>
      <svg className="thumb__motif" viewBox="0 0 80 80" aria-hidden="true">
        {motif === 'letter' ? (
          <>
            <rect x="10" y="10" width="60" height="60" rx="10" />
            <text x="40" y="54" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="300" fontSize="38" fill="currentColor" stroke="none">{letter}</text>
          </>
        ) : MOTIFS[motif]}
      </svg>
      <Texture kind={(seed >> 5) % 3} />
      {video && <span className="thumb__play" aria-hidden="true"><Icon name="play" size={12} /></span>}
    </div>
  )
}
