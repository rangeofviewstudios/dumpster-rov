import type { ImageVariant } from '../../lib/types'

/** Hand-drawn stand-ins for photos and screenshots. Flat fills, ink strokes, no gradients. */
export function SampleImage({ variant }: { variant: ImageVariant }) {
  if (variant === 'wifi') return <WifiShot />
  if (variant === 'flyer') return <FlyerShot />
  return <ReceiptShot />
}

const INK = '#111111'

function WifiShot() {
  return (
    <svg viewBox="0 0 240 150" className="sample-img" role="img" aria-label="Screenshot of a wifi password screen">
      <rect width="240" height="150" fill="#E8F7FF" />
      <rect x="0" y="0" width="240" height="22" fill={INK} />
      <text x="10" y="15" fill="#FFF8EC" fontFamily="JetBrains Mono, monospace" fontSize="9">9:41   Settings</text>
      <path d="M120 58a30 30 0 0 1 30 0M108 70a46 46 0 0 1 54 0M96 82a62 62 0 0 1 78 0" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" transform="translate(0 -10) scale(1 .85) translate(0 14)" />
      <circle cx="120" cy="96" r="5" fill={INK} />
      <rect x="30" y="108" width="180" height="30" rx="6" fill="#FFF8EC" stroke={INK} strokeWidth="2.5" />
      <text x="42" y="121" fill={INK} fontFamily="JetBrains Mono, monospace" fontSize="9">Moonbeam_5G</text>
      <text x="42" y="132" fill={INK} fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="600">pancake-tuesday-42</text>
    </svg>
  )
}

function FlyerShot() {
  return (
    <svg viewBox="0 0 240 150" className="sample-img" role="img" aria-label="Photo of a flyer for open mic night">
      <rect width="240" height="150" fill="#FF5C8A" />
      <rect x="14" y="12" width="212" height="126" fill="#FFF8EC" stroke={INK} strokeWidth="3" />
      <text x="26" y="48" fill={INK} fontFamily="Archivo, sans-serif" fontWeight="900" fontSize="26">OPEN MIC</text>
      <text x="26" y="74" fill={INK} fontFamily="Archivo, sans-serif" fontWeight="900" fontSize="26">NIGHT</text>
      <rect x="26" y="86" width="96" height="22" fill="#FFD23F" stroke={INK} strokeWidth="2.5" />
      <text x="34" y="101" fill={INK} fontFamily="JetBrains Mono, monospace" fontWeight="600" fontSize="11">FRI 8PM</text>
      <text x="26" y="126" fill={INK} fontFamily="JetBrains Mono, monospace" fontSize="9">THE RUSTY SPOON / NO COVER</text>
      <circle cx="196" cy="56" r="20" fill="#7B61FF" stroke={INK} strokeWidth="3" />
      <rect x="192" y="44" width="8" height="18" rx="4" fill="#FFF8EC" stroke={INK} strokeWidth="2" />
    </svg>
  )
}

function ReceiptShot() {
  return (
    <svg viewBox="0 0 240 150" className="sample-img" role="img" aria-label="Photo of a cafe receipt">
      <rect width="240" height="150" fill="#BDBDBD" />
      <path d="M70 6h100v132l-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6z" fill="#FFFFFF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <text x="120" y="28" textAnchor="middle" fill={INK} fontFamily="Archivo, sans-serif" fontWeight="900" fontSize="12">BLUE DOOR CAFE</text>
      <path d="M82 38h76" stroke={INK} strokeWidth="2" strokeDasharray="4 3" />
      <text x="82" y="56" fill={INK} fontFamily="JetBrains Mono, monospace" fontSize="8">2 x OAT LATTE</text>
      <text x="158" y="56" textAnchor="end" fill={INK} fontFamily="JetBrains Mono, monospace" fontSize="8">9.50</text>
      <text x="82" y="70" fill={INK} fontFamily="JetBrains Mono, monospace" fontSize="8">TAX</text>
      <text x="158" y="70" textAnchor="end" fill={INK} fontFamily="JetBrains Mono, monospace" fontSize="8">0.81</text>
      <path d="M82 82h76" stroke={INK} strokeWidth="2" strokeDasharray="4 3" />
      <text x="82" y="100" fill={INK} fontFamily="JetBrains Mono, monospace" fontWeight="600" fontSize="10">TOTAL</text>
      <text x="158" y="100" textAnchor="end" fill={INK} fontFamily="JetBrains Mono, monospace" fontWeight="600" fontSize="10">10.31</text>
    </svg>
  )
}
