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

function savedLabel(item: Item): string {
  const day = formatDayLabel(item.createdAt)
  const label = day === 'Today' || day === 'Yesterday' ? day : formatShortDate(item.createdAt)
  return `${label}, ${formatTime(item.createdAt)}`
}

function fieldsFor(item: Item): Array<[string, string]> {
  const rows: Array<[string, string]> = [['Type', KIND_LABEL[item.kind]]]
  if (item.domain) rows.push(['Source', item.domain])
  if (item.address) rows.push(['Address', item.address])
  if (item.extracted) rows.push(['Text found', item.extracted])
  rows.push(['From', item.from === 'Me' ? 'You' : item.from])
  rows.push(['Saved', savedLabel(item)])
  rows.push(['Pile', getPile(item.pile).name])
  return rows
}

function originalText(item: Item): string {
  return item.transcript ?? item.url ?? item.text
}

export function ItemSheet({ itemId }: { itemId: string | null }) {
  const { getItem, removeItem, restoreItem } = useStore()
  const { closeSheet, openPicker, showToast } = useUi()
  const shown = itemId ? getItem(itemId) : undefined

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
    showToast('Deleted.', { label: 'Undo', onAction: () => restoreItem(removed) })
  }

  const openHref = shown?.kind === 'address' ? mapsUrl(shown.address ?? shown.text) : shown?.url

  return (
    <Sheet open={Boolean(shown)} title="Details" onClose={closeSheet}>
      {shown && (
        <div className="item-sheet">
          <section>
            <h3 className="label item-sheet__label">Original message</h3>
            <p className="item-sheet__original">{originalText(shown)}</p>
          </section>
          <dl className="fields">
            {fieldsFor(shown).map(([label, value]) => (
              <div key={label} className="fields__row">
                <dt className="meta">{label}</dt>
                <dd className="small">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="item-sheet__actions">
            {openHref ? (
              <a className="btn" href={openHref} target="_blank" rel="noopener noreferrer"><Icon name="external" />Open</a>
            ) : (
              <button type="button" className="btn" onClick={() => copyText(originalText(shown), 'Copied.')}><Icon name="copy" />Copy</button>
            )}
            <button type="button" className="btn btn--ghost" onClick={() => showToast('Reminder set for tomorrow morning.')}><Icon name="bell" />Remind me</button>
            <button type="button" className="btn btn--ghost" onClick={() => openPicker(shown.id)}><Icon name="folder" />Move pile</button>
            <button type="button" className="btn btn--ghost" onClick={share}><Icon name="share" />Share</button>
            <button type="button" className="btn btn--danger item-sheet__delete" onClick={remove}><Icon name="trash" />Delete</button>
          </div>
        </div>
      )}
    </Sheet>
  )
}
