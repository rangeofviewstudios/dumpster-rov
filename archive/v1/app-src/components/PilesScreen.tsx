import { useStore } from '../lib/store'
import { PILES, getPile } from '../lib/piles'
import type { Item, PileId } from '../lib/types'
import { Icon } from './Icon'
import { PileDetail } from './PileDetail'
import { ScreenHeader } from './ScreenHeader'

function previewOf(item: Item | undefined): string {
  if (!item) return 'Nothing here yet.'
  return item.title ?? item.address ?? item.extracted ?? item.transcript ?? item.fileName ?? item.text
}

interface PilesScreenProps {
  openPileId?: PileId
  onOpenPile: (id: PileId | undefined) => void
}

export function PilesScreen({ openPileId, onOpenPile }: PilesScreenProps) {
  const { items } = useStore()
  if (openPileId) return <PileDetail pile={getPile(openPileId)} onBack={() => onOpenPile(undefined)} />

  return (
    <section className="screen" aria-label="Piles">
      <ScreenHeader title="Piles" subtitle={`${items.length} things, ${PILES.length} piles`} />
      <div className="scroll">
        <ul className="pile-grid">
          {PILES.map((pile) => {
            const inPile = items.filter((item) => item.pile === pile.id).sort((a, b) => b.createdAt - a.createdAt)
            return (
              <li key={pile.id}>
                <button type="button" className={`nb-folder pile-card ${pile.cssClass}`} onClick={() => onOpenPile(pile.id)} aria-label={`${pile.name}, ${inPile.length} items`}>
                  <span className="nb-folder__body pile-card__body">
                    <span className="pile-card__top">
                      <span className="nb-icon-tile"><Icon name={pile.icon} /></span>
                      <span className="pile-card__count t-meta">{String(inPile.length).padStart(2, '0')}</span>
                    </span>
                    <span className="t-h3 pile-card__name">{pile.name}</span>
                    <span className="t-small pile-card__last">{previewOf(inPile[0])}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
