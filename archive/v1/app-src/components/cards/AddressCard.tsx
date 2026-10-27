import type { Item } from '../../lib/types'
import { Icon } from '../Icon'

export function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

/** Mini map: hard-line grid, two streets, one pink pin. */
function MiniMap() {
  return (
    <svg className="mini-map" viewBox="0 0 280 96" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="280" height="96" fill="#FFF8EC" />
      <g stroke="#111111" strokeWidth="1.5" opacity="0.18">
        {[28, 56, 84, 112, 140, 168, 196, 224, 252].map((x) => <path key={x} d={`M${x} 0V96`} />)}
        {[24, 48, 72].map((y) => <path key={y} d={`M0 ${y}H280`} />)}
      </g>
      <path d="M0 60L280 34" stroke="#111111" strokeWidth="11" />
      <path d="M0 60L280 34" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M150 0L120 96" stroke="#111111" strokeWidth="11" />
      <path d="M150 0L120 96" stroke="#FFD23F" strokeWidth="6" />
      <rect x="196" y="56" width="40" height="26" fill="#4ADE9B" stroke="#111111" strokeWidth="2.5" />
      <g transform="translate(140 14)">
        <path d="M0 40C-16 24-16 4 0 4S16 24 0 40z" fill="#FF5C8A" stroke="#111111" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="0" cy="18" r="5" fill="#FFF8EC" stroke="#111111" strokeWidth="2.5" />
      </g>
    </svg>
  )
}

export function AddressCard({ item }: { item: Item }) {
  const address = item.address ?? item.text
  return (
    <div className="address-card">
      <MiniMap />
      <div className="address-card__row">
        <div className="address-card__text">
          <p className="address-card__line">{address}</p>
          {item.text !== address && <p className="t-small address-card__note">{item.text}</p>}
        </div>
        <a
          className="nb-btn nb-btn--sm address-card__open"
          href={mapsUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="pin" size={18} />
          Open in Maps
        </a>
      </div>
    </div>
  )
}
