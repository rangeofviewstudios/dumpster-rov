import { getPile, PILES } from '../lib/piles'
import { useStore } from '../lib/store'
import { useUi } from '../lib/ui'
import { Icon } from './Icon'
import { Sheet } from './Sheet'

/** Choose a pile for an item. Opens from the filing chip or the item sheet. */
export function PilePicker({ itemId }: { itemId: string | null }) {
  const { getItem, patchItem } = useStore()
  const { closeSheet, showToast } = useUi()
  const item = itemId ? getItem(itemId) : undefined

  function moveTo(pileId: (typeof PILES)[number]['id']) {
    if (!item) return
    patchItem(item.id, { pile: pileId })
    closeSheet()
    showToast(`Moved to ${getPile(pileId).name}.`)
  }

  return (
    <Sheet open={Boolean(item)} title="Move to a pile" onClose={closeSheet}>
      <ul className="picker">
        {PILES.map((pile) => {
          const current = item?.pile === pile.id
          return (
            <li key={pile.id}>
              <button type="button" className={`picker__row ${pile.cssClass}`} aria-current={current} onClick={() => moveTo(pile.id)}>
                <span className="nb-icon-tile" style={{ ['--size' as string]: '40px' }}><Icon name={pile.icon} /></span>
                <span className="t-h3">{pile.name}</span>
                {current && <span className="nb-chip nb-chip--mono">Here now</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
}
