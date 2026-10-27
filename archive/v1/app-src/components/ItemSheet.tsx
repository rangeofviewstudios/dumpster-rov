import { formatDayLabel, formatShortDate, formatTime } from '../lib/format'
import { getPile } from '../lib/piles'
import { useStore } from '../lib/store'
import { useUi } from '../lib/ui'
import type { Item } from '../lib/types'
import { mapsUrl } from './cards/AddressCard'
import { Icon } from './Icon'
import { Sheet } from './Sheet'

const KIND_LABEL: Record<Item['kind'], string> = {
  link: 'Link', address: 'Address', todo: 'To-do', note: 'Note', image: 'Image', voice: 'Voice note', file: 'File',
}

function fieldsFor(item: Item): Array<[string, string]> {
  const rows: Array<[string, string]> = [['Type', KIND_LABEL[item.kind]]]
  if (item.domain) rows.push(['Source', item.domain])
  if (item.address) rows.push(['Address', item.address])
  if (item.extracted) rows.push(['Text found', item.extracted])
  rows.push(['From', item.from === 'Me' ? 'You' : item.from])
  rows.push(['Saved', `${formatDayLabel(item.createdAt) === 'Today' || formatDayLabel(item.createdAt) === 'Yesterday' ? formatDayLabel(item.createdAt) : formatShortDate(item.createdAt)}, ${formatTime(item.createdAt)}`])
  rows.push(['Pile', getPile(item.pile).name])
  return rows
}

function originalText(item: Item): string {
  return item.transcript ?? item.url ?? item.text
}

export function ItemSheet({ itemId }: { itemId: string | null }) {
  const { getItem, removeItem, restoreItem } = useStore()
  const { closeSheet, openPicker, showToast } = useUi()
  const item = itemId ? getItem(itemId) : undefined
  // Keep the last item rendered while the sheet animates out after a delete.
  const shown = item

  function copyText(text: string, message: string) {
    navigator.clipboard?.writeText(text).catch(() => undefined)
    showToast(message)
  }

  function share() {
    if (!shown) return
    const text = originalText(shown)
    if (navigator.share) navigator.share({ text }).catch(() => undefined)
    else copyText(text, 'Copied. Paste it anywhere.')
  }

  function remove() {
    if (!shown) return
    const removed = shown
    removeItem(removed.id)
    closeSheet()
    showToast('Tossed.', { label: 'Undo', onAction: () => restoreItem(removed) })
  }

  const openHref = shown?.kind === 'address' ? mapsUrl(shown.address ?? shown.text) : shown?.url

  return (
    <Sheet open={Boolean(shown)} title="Item details" onClose={closeSheet} accent={shown ? getPile(shown.pile).color : undefined}>
      {shown && (
        <div className="item-sheet">
          <section>
            <h3 className="t-meta item-sheet__label">Original message</h3>
            <p className="item-sheet__original">{originalText(shown)}</p>
          </section>
          <dl className="fields nb-card">
            {fieldsFor(shown).map(([label, value]) => (
              <div key={label} className="fields__row">
                <dt className="t-meta">{label}</dt>
                <dd className="t-small">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="item-sheet__actions">
            {openHref ? (
              <a className="nb-btn" href={openHref} target="_blank" rel="noopener noreferrer"><Icon name="external" size={20} />Open</a>
            ) : (
              <button type="button" className="nb-btn" onClick={() => copyText(originalText(shown), 'Copied.')}><Icon name="copy" size={20} />Copy</button>
            )}
            <button type="button" className="nb-btn nb-btn--cream" onClick={() => showToast('Okay. Scraps will nudge you tomorrow morning.')}><Icon name="bell" size={20} />Remind me</button>
            <button type="button" className="nb-btn nb-btn--cream" onClick={() => openPicker(shown.id)}><Icon name="folder" size={20} />Move pile</button>
            <button type="button" className="nb-btn nb-btn--cream" onClick={share}><Icon name="share" size={20} />Share</button>
            <button type="button" className="nb-btn nb-btn--danger item-sheet__delete" onClick={remove}><Icon name="trash" size={20} />Delete</button>
          </div>
        </div>
      )}
    </Sheet>
  )
}
