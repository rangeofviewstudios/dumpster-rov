import { getPile, PILES } from '../lib/piles'
import { useStore } from '../lib/store'
import { useUi } from '../lib/ui'
import type { PileId } from '../lib/types'
import { Icon } from './Icon'
import { Sheet } from './Sheet'

/** Choose a pile for an item. Opens from the filing label or the item sheet. */
export function PilePicker({ itemId }: { itemId: string | null }) {
  const { getItem, patchItem } = useStore()
  const { closeSheet, showToast } = useUi()
  const item = itemId ? getItem(itemId) : undefined

  function moveTo(pileId: PileId) {
    if (!item) return
    patchItem(item.id, { pile: pileId })
    closeSheet()
    showToast(`Moved to ${getPile(pileId).name}.`)
  }

  return (
    <Sheet open={Boolean(item)} title="Move to" onClose={closeSheet}>
      <ul className="picker">
        {PILES.map((pile) => {
          const current = item?.pile === pile.id
          return (
            <li key={pile.id}>
              <button type="button" className="picker__row" aria-current={current} onClick={() => moveTo(pile.id)}>
                <Icon name={pile.icon} size={20} />
                <span className="picker__name">{pile.name}</span>
                {current && <span className="meta">HERE</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
}
