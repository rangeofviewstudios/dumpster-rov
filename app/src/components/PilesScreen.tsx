import { useStore } from '../lib/store'
import { PILE_GROUPS, PILES, getPile } from '../lib/piles'
import type { PileId } from '../lib/types'
import { PileDetail } from './PileDetail'
import { ScreenHeader } from './ScreenHeader'

interface PilesScreenProps {
  openPileId?: PileId
  onOpenPile: (id: PileId | undefined) => void
}

export function PilesScreen({ openPileId, onOpenPile }: PilesScreenProps) {
  const { items } = useStore()
  if (openPileId) return <PileDetail pile={getPile(openPileId)} onBack={() => onOpenPile(undefined)} />

  return (
    <section className="screen" aria-label="Piles">
      <ScreenHeader title="Piles" subtitle={`${items.length} things`} />
      <div className="scroll">
        {PILE_GROUPS.map((group) => (
          <section key={group.id} className="pile-group" aria-labelledby={`group-${group.id}`}>
            <h2 className="pile-group__title" id={`group-${group.id}`}>{group.label}</h2>
            <ul className="pile-list">
              {PILES.filter((pile) => pile.group === group.id).map((pile) => {
                const count = items.filter((item) => item.pile === pile.id).length
                return (
                  <li key={pile.id}>
                    <button type="button" className="pile-row" onClick={() => onOpenPile(pile.id)} aria-label={`${pile.name}, ${count} items`}>
                      <span className="pile-row__name">{pile.name}</span>
                      <span className="pile-row__count">{String(count).padStart(2, '0')}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
