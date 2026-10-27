import { useState } from 'react'
import type { Pile } from '../lib/piles'
import { useStore } from '../lib/store'
import { Icon } from './Icon'
import { ScreenHeader } from './ScreenHeader'
import { SmartCard } from './SmartCard'

export function PileDetail({ pile, onBack }: { pile: Pile; onBack: () => void }) {
  const { items } = useStore()
  const [filterIndex, setFilterIndex] = useState(0)
  const inPile = items.filter((item) => item.pile === pile.id).sort((a, b) => b.createdAt - a.createdAt)
  const filter = pile.filters[filterIndex] ?? pile.filters[0]
  const visible = inPile.filter(filter.test)

  return (
    <section className="screen" aria-label={pile.name}>
      <ScreenHeader
        title={pile.name}
        subtitle={`${inPile.length} ${inPile.length === 1 ? 'item' : 'items'}`}
        left={
          <button type="button" className="btn btn--icon" aria-label="Back to Piles" onClick={onBack}>
            <Icon name="chevronLeft" />
          </button>
        }
      />
      <div className="filters" role="tablist" aria-label={`Filter ${pile.name}`}>
        {pile.filters.map((option, index) => (
          <button
            key={option.label}
            type="button"
            role="tab"
            aria-selected={index === filterIndex}
            className="pill"
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
            <p className="label">{inPile.length === 0 ? pile.empty : 'Nothing under this filter.'}</p>
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
