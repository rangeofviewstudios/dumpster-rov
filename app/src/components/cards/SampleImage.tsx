import type { ImageVariant } from '../../lib/types'

/** Hand-drawn stand-ins for photos and screenshots: user content, so a little tone is allowed, but muted. */
export function SampleImage({ variant }: { variant: ImageVariant }) {
  if (variant === 'wifi') return <WifiShot />
  if (variant === 'flyer') return <FlyerShot />
  return <ReceiptShot />
}

const MONO = 'Geist Mono, ui-monospace, monospace'
const DISPLAY = 'Space Grotesk, system-ui, sans-serif'

function WifiShot() {
  return (
    <svg viewBox="0 0 240 150" className="sample-img" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Screenshot of a wifi password screen">
      <rect width="240" height="150" fill="#111316" />
      <text x="12" y="16" fill="#8B8F94" fontFamily={MONO} fontSize="8">9:41</text>
      <text x="228" y="16" textAnchor="end" fill="#8B8F94" fontFamily={MONO} fontSize="8">Settings</text>
      <g fill="none" stroke="#C9CCD0" strokeWidth="2" strokeLinecap="round">
        <path d="M104 62a24 24 0 0 1 32 0M94 52a38 38 0 0 1 52 0M114 72a10 10 0 0 1 12 0" />
      </g>
      <circle cx="120" cy="82" r="2.4" fill="#C9CCD0" />
      <rect x="30.5" y="100.5" width="179" height="34" rx="6" fill="#17181A" stroke="#3a3d42" />
      <text x="42" y="114" fill="#8B8F94" fontFamily={MONO} fontSize="8">Moonbeam_5G</text>
      <text x="42" y="127" fill="#EEEEEC" fontFamily={MONO} fontSize="9.5">pancake-tuesday-42</text>
    </svg>
  )
}

function FlyerShot() {
  return (
    <svg viewBox="0 0 240 150" className="sample-img" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Photo of a flyer for open mic night">
      <rect width="240" height="150" fill="#1d1e20" />
      <rect x="22" y="12" width="196" height="126" fill="#E4DFD3" transform="rotate(-1.2 120 75)" />
      <g transform="rotate(-1.2 120 75)">
        <text x="34" y="50" fill="#0E0E0F" fontFamily={DISPLAY} fontWeight="500" fontSize="25" letterSpacing="-0.5">OPEN MIC</text>
        <text x="34" y="76" fill="#0E0E0F" fontFamily={DISPLAY} fontWeight="300" fontSize="25" letterSpacing="-0.5">NIGHT</text>
        <path d="M34 88H210" stroke="#0E0E0F" strokeWidth="0.8" />
        <text x="34" y="106" fill="#0E0E0F" fontFamily={MONO} fontSize="10">FRI 8PM</text>
        <text x="34" y="124" fill="#4a4a48" fontFamily={MONO} fontSize="8">THE RUSTY SPOON / NO COVER</text>
        <circle cx="190" cy="52" r="16" fill="none" stroke="#0E0E0F" strokeWidth="1" />
        <rect x="186.5" y="43" width="7" height="13" rx="3.5" fill="none" stroke="#0E0E0F" strokeWidth="1" />
      </g>
    </svg>
  )
}

function ReceiptShot() {
  return (
    <svg viewBox="0 0 240 150" className="sample-img" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Photo of a cafe receipt">
      <rect width="240" height="150" fill="#26282b" />
      <path d="M70 6h100v132l-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6z" fill="#EEEEEC" />
      <text x="120" y="28" textAnchor="middle" fill="#0E0E0F" fontFamily={DISPLAY} fontWeight="500" fontSize="11" letterSpacing="1.5">BLUE DOOR CAFE</text>
      <path d="M82 38h76" stroke="#0E0E0F" strokeWidth="0.8" strokeDasharray="3 3" />
      <text x="82" y="56" fill="#0E0E0F" fontFamily={MONO} fontSize="8">2 x OAT LATTE</text>
      <text x="158" y="56" textAnchor="end" fill="#0E0E0F" fontFamily={MONO} fontSize="8">9.50</text>
      <text x="82" y="70" fill="#0E0E0F" fontFamily={MONO} fontSize="8">TAX</text>
      <text x="158" y="70" textAnchor="end" fill="#0E0E0F" fontFamily={MONO} fontSize="8">0.81</text>
      <path d="M82 82h76" stroke="#0E0E0F" strokeWidth="0.8" strokeDasharray="3 3" />
      <text x="82" y="100" fill="#0E0E0F" fontFamily={MONO} fontSize="10">TOTAL</text>
      <text x="158" y="100" textAnchor="end" fill="#0E0E0F" fontFamily={MONO} fontSize="10">10.31</text>
    </svg>
  )
}
