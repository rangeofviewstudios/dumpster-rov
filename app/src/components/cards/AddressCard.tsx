import type { Item } from '../../lib/types'
import { Icon } from '../Icon'

export function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

/** Hairline grid, two streets, one glowing bone pin. */
function MiniMap() {
  return (
    <div className="mini-map" aria-hidden="true">
      <svg viewBox="0 0 280 96" preserveAspectRatio="xMidYMid slice">
        <g stroke="currentColor" opacity="0.14">
          {[28, 56, 84, 112, 140, 168, 196, 224, 252].map((x) => <path key={x} d={`M${x} 0V96`} vectorEffect="non-scaling-stroke" />)}
          {[24, 48, 72].map((y) => <path key={y} d={`M0 ${y}H280`} vectorEffect="non-scaling-stroke" />)}
        </g>
        <g fill="none" stroke="currentColor" opacity="0.38">
          <path d="M0 62L280 36" vectorEffect="non-scaling-stroke" />
          <path d="M150 0L124 96" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      <span className="mini-map__pin" />
    </div>
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
          {item.text !== address && <p className="small address-card__note">{item.text}</p>}
        </div>
        <a className="btn btn--ghost address-card__open" href={mapsUrl(address)} target="_blank" rel="noopener noreferrer" aria-label="Open in Maps">
          <Icon name="pin" size={18} />
          Maps
        </a>
      </div>
    </div>
  )
}
