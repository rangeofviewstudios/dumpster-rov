import type { ReactNode } from 'react'
import { getPile } from '../../lib/piles'
import type { Item } from '../../lib/types'
import { Icon } from '../Icon'

const INK = '#111111'
const ACCENTS = ['#FF5C8A', '#3EC1F3', '#A3E635', '#4ADE9B', '#FF8A3D', '#FFE58F', '#FFD23F']
const STROKE = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

function hash(text: string): number {
  let value = 0
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0
  return value
}

/** Small flat illustrations on an 80x80 canvas. `fill` is the accent colour for the main shape. */
const MOTIFS: Record<string, (fill: string) => ReactNode> = {
  pan: (fill) => (
    <g {...STROKE}>
      <rect x="50" y="36" width="28" height="9" rx="4" fill="#FFD23F" />
      <circle cx="34" cy="42" r="26" fill="#4A4A4A" />
      <circle cx="34" cy="42" r="17" fill={fill} />
    </g>
  ),
  bowl: (fill) => (
    <g {...STROKE} fill="none">
      <path d="M26 24c-6-6 6-8 0-14M40 24c-6-6 6-8 0-14M54 24c-6-6 6-8 0-14" />
      <path d="M6 34h68a34 30 0 0 1-68 0z" fill={fill} />
      <path d="M58 6L40 34" />
    </g>
  ),
  shelf: (fill) => (
    <g {...STROKE}>
      <rect x="8" y="8" width="64" height="64" fill={fill} />
      <path d="M8 40h64M40 8v64" />
      <rect x="14" y="18" width="12" height="16" fill="#FFF8EC" />
      <rect x="48" y="48" width="14" height="18" fill="#FFF8EC" />
    </g>
  ),
  lamp: (fill) => (
    <g {...STROKE}>
      <path d="M26 8h28l10 30H16z" fill={fill} />
      <path d="M40 38v26" />
      <rect x="26" y="64" width="28" height="9" rx="3" fill="#FFF8EC" />
    </g>
  ),
  desk: (fill) => (
    <g {...STROKE}>
      <rect x="22" y="10" width="36" height="24" rx="3" fill="#FFF8EC" />
      <path d="M40 34v8" />
      <rect x="6" y="42" width="68" height="9" fill={fill} />
      <path d="M14 51v22M66 51v22" />
    </g>
  ),
  battery: (fill) => (
    <g {...STROKE}>
      <rect x="8" y="22" width="58" height="36" rx="6" fill={fill} />
      <rect x="66" y="33" width="9" height="14" rx="2" fill={INK} />
      <path d="M42 26L28 42h12l-4 14 14-18H38z" fill="#FFF8EC" />
    </g>
  ),
  keyboard: (fill) => (
    <g {...STROKE}>
      <rect x="4" y="20" width="72" height="42" rx="6" fill={fill} />
      {[12, 28, 44, 60].map((x) => <rect key={x} x={x} y="28" width="9" height="9" fill="#FFF8EC" strokeWidth={2} />)}
      <rect x="18" y="44" width="44" height="9" fill="#FFF8EC" strokeWidth={2} />
    </g>
  ),
  speaker: (fill) => (
    <g {...STROKE}>
      <rect x="18" y="6" width="44" height="68" rx="8" fill={fill} />
      <circle cx="40" cy="28" r="9" fill="#FFF8EC" />
      <circle cx="40" cy="54" r="12" fill="#FFF8EC" />
    </g>
  ),
  moon: (fill) => (
    <g {...STROKE}>
      <path d="M50 8a32 32 0 1 0 22 46A26 26 0 0 1 50 8z" fill={fill} />
      <circle cx="62" cy="14" r="3" fill={INK} />
      <circle cx="72" cy="30" r="2" fill={INK} />
    </g>
  ),
  house: (fill) => (
    <g {...STROKE}>
      <path d="M8 38L40 10l32 28v34H8z" fill={fill} />
      <rect x="32" y="48" width="16" height="24" fill="#FFF8EC" />
    </g>
  ),
  plant: (fill) => (
    <g {...STROKE}>
      <path d="M40 46C28 40 22 28 24 14c14 2 20 14 16 32zM40 46c12-6 18-18 16-32-14 2-20 14-16 32z" fill="#4ADE9B" />
      <path d="M24 46h32l-5 26H29z" fill={fill} />
    </g>
  ),
  wrench: (fill) => (
    <g {...STROKE}>
      <rect x="6" y="30" width="68" height="20" rx="6" fill={fill} transform="rotate(-30 40 40)" />
      <circle cx="40" cy="40" r="6" fill="#FFF8EC" />
    </g>
  ),
  play: (fill) => (
    <g {...STROKE}>
      <rect x="6" y="16" width="68" height="48" rx="10" fill={fill} />
      <path d="M33 29l19 11-19 11z" fill="#FFF8EC" />
    </g>
  ),
  letter: (fill) => (
    <g {...STROKE}>
      <rect x="10" y="10" width="60" height="60" rx="10" fill={fill} />
    </g>
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

function motifFor(item: Item): keyof typeof MOTIFS {
  const text = `${item.title ?? ''} ${item.url ?? ''}`
  const hit = KEYWORDS.find(([pattern]) => pattern.test(text))
  if (hit) return hit[1]
  return item.pile === 'watch' ? 'play' : 'letter'
}

type Scheme = { bg: string; fg: string }

function pickScheme(seed: number, pileColor: string): Scheme {
  const options: Scheme[] = [
    { bg: pileColor, fg: INK },
    { bg: 'var(--cream)', fg: INK },
    { bg: 'var(--yellow)', fg: INK },
    { bg: INK, fg: 'var(--cream)' },
  ]
  return options[seed % options.length]
}

function Decoration({ kind, color }: { kind: number; color: string }) {
  if (kind === 0) {
    return (
      <svg className="thumb__deco" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 30 }, (_, index) => <path key={index} d={`M${index * 12} 20L${index * 12 + 12} 0`} stroke={color} strokeWidth="3" />)}
      </svg>
    )
  }
  if (kind === 1) {
    return (
      <svg className="thumb__deco" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 20 }, (_, index) => <circle key={index} cx={index * 16 + 8} cy="10" r="3.5" fill={color} />)}
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

/** Generated cover art: big type, a flat motif, a varied background. Deterministic per item. */
export function Thumb({ item, label, video }: ThumbProps) {
  const seed = hash(item.id)
  const scheme = pickScheme(seed, getPile(item.pile).color)
  const accentPool = ACCENTS.filter((color) => !(scheme.bg.startsWith('#') && color.toLowerCase() === scheme.bg.toLowerCase()))
  const accent = accentPool[(seed >> 3) % accentPool.length]
  const motif = motifFor(item)
  const letter = (item.domain ?? 'L').charAt(0).toUpperCase()

  return (
    <div className="thumb" style={{ background: scheme.bg, color: scheme.fg }}>
      <span className="thumb__tag t-meta">{label}</span>
      <p className="thumb__title">{shortTitle(item)}</p>
      <svg className="thumb__motif" viewBox="0 0 80 80" aria-hidden="true">
        {MOTIFS[motif](accent)}
        {motif === 'letter' && (
          <text x="40" y="55" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="900" fontSize="40" fill={INK}>{letter}</text>
        )}
      </svg>
      <Decoration kind={(seed >> 5) % 3} color={scheme.fg} />
      {video && <span className="thumb__play" aria-hidden="true"><Icon name="play" size={16} /></span>}
    </div>
  )
}
