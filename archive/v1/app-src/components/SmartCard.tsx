import { formatTime } from '../lib/format'
import { getPile } from '../lib/piles'
import { useStore } from '../lib/store'
import { useUi } from '../lib/ui'
import type { Item } from '../lib/types'
import { AddressCard } from './cards/AddressCard'
import { LinkCard } from './cards/LinkCard'
import { FileCard, ImageCard, NoteBubble, VoiceCard } from './cards/MediaCards'
import { TodoCard } from './cards/TodoCard'

function CardBody({ item }: { item: Item }) {
  switch (item.kind) {
    case 'link': return <LinkCard item={item} />
    case 'address': return <AddressCard item={item} />
    case 'todo': return <TodoCard item={item} />
    case 'image': return <ImageCard item={item} />
    case 'voice': return <VoiceCard item={item} />
    case 'file': return <FileCard item={item} />
    case 'note': return <NoteBubble item={item} />
  }
}

function describeItem(item: Item): string {
  return item.title ?? item.address ?? item.transcript ?? item.fileName ?? item.text
}

interface SmartCardProps {
  item: Item
  /** Show the filing chip + time under the card (Dump thread). */
  showChip?: boolean
}

export function SmartCard({ item, showChip = false }: SmartCardProps) {
  const { openItem, openPicker } = useUi()
  const { freshIds } = useStore()
  const pile = getPile(item.pile)
  const isFresh = freshIds.includes(item.id)
  const sender = item.from === 'Me' ? '' : ` · from ${item.from}`

  return (
    <article className="msg" data-kind={item.kind}>
      <div className="scard">
        <button type="button" className="scard__open" aria-label={`Open details: ${describeItem(item)}`} onClick={() => openItem(item.id)} />
        <CardBody item={item} />
      </div>
      {showChip && (
        <div className="msg__meta">
          <button
            type="button"
            className={`nb-chip nb-chip--mono filing ${pile.cssClass}`}
            data-fresh={isFresh}
            aria-label={`Filed in ${pile.name}${sender}. Move to another pile`}
            onClick={() => openPicker(item.id)}
          >
            <span className="filing__dot" aria-hidden="true" />
            {isFresh ? `Tossed in ${pile.name} · tap to move` : `→ ${pile.name}${sender}`}
          </button>
          <span className="t-meta msg__time">{formatTime(item.createdAt)}</span>
        </div>
      )}
    </article>
  )
}
