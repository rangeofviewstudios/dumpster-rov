import { useState } from 'react'
import type { Pile } from '../lib/piles'
import { useStore } from '../lib/store'
import { Icon } from './Icon'
import { Mascot } from './Mascot'
import { SmartCard } from './SmartCard'

export function PileDetail({ pile, onBack }: { pile: Pile; onBack: () => void }) {
  const { items } = useStore()
  const [filterIndex, setFilterIndex] = useState(0)
  const inPile = items.filter((item) => item.pile === pile.id).sort((a, b) => b.createdAt - a.createdAt)
  const filter = pile.filters[filterIndex] ?? pile.filters[0]
  const visible = inPile.filter(filter.test)

  return (
    <section className={`screen ${pile.cssClass}`} aria-label={pile.name}>
      <header className="pile-head" style={{ background: pile.color }}>
        <button type="button" className="nb-btn nb-btn--cream nb-btn--sq" aria-label="Back to Piles" onClick={onBack}>
          <Icon name="chevronLeft" />
        </button>
        <div className="pile-head__title">
          <h1 className="t-h2">{pile.name}</h1>
          <p className="t-meta">{inPile.length} {inPile.length === 1 ? 'item' : 'items'}</p>
        </div>
        <span className="nb-icon-tile" style={{ ['--tile' as string]: 'var(--cream)' }}><Icon name={pile.icon} /></span>
      </header>
      <div className="filters" role="tablist" aria-label={`Filter ${pile.name}`}>
        {pile.filters.map((option, index) => (
          <button
            key={option.label}
            type="button"
            role="tab"
            aria-selected={index === filterIndex}
            className="nb-chip nb-chip--shadow filter-chip"
            data-on={index === filterIndex}
            onClick={() => setFilterIndex(index)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="scroll">
        {visible.length === 0 ? (
          <div className="empty">
            <Mascot pose="sleep" size={110} />
            <p className="t-h3">{inPile.length === 0 ? pile.empty : 'Nothing under this filter.'}</p>
          </div>
        ) : (
          <div className="list">
            {visible.map((item) => <SmartCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </section>
  )
}
