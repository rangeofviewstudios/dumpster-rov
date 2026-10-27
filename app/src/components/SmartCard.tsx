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

/** What the user actually sent: the raw text, or a short caption for media. */
function sentText(item: Item): string {
  if (item.kind === 'file') return item.fileName ?? 'File'
  return item.text
}

function describeItem(item: Item): string {
  return item.title ?? item.address ?? item.transcript ?? item.fileName ?? item.text
}

interface SmartCardProps {
  item: Item
  /** In the Dump thread: everything you sent is a blue bubble, with the smart card attached as a reply and the filing label below. */
  inThread?: boolean
}

export function SmartCard({ item, inThread = false }: SmartCardProps) {
  const { openItem, openPicker } = useUi()
  const { freshIds } = useStore()
  const pile = getPile(item.pile)
  const isFresh = freshIds.includes(item.id)
  const sender = item.from === 'Me' ? '' : ` · from ${item.from}`
  const showCard = !inThread || item.kind !== 'note'

  return (
    <article className="msg" data-kind={item.kind} data-thread={inThread}>
      {inThread && (
        <button type="button" className="sent-bubble" aria-label={`Open details: ${describeItem(item)}`} onClick={() => openItem(item.id)}>
          {sentText(item)}
        </button>
      )}
      {showCard && (
        <div className={inThread ? 'scard scard--reply' : 'scard'}>
          <button type="button" className="scard__open" aria-label={`Open details: ${describeItem(item)}`} onClick={() => openItem(item.id)} />
          <CardBody item={item} />
        </div>
      )}
      {inThread && (
        <div className="msg__meta">
          <button
            type="button"
            className="filing"
            data-fresh={isFresh}
            aria-label={`Filed to ${pile.name}${sender}. Move to another pile`}
            onClick={() => openPicker(item.id)}
          >
            Filed <i>→ {pile.name}</i>{sender}
          </button>
          <span className="meta msg__time">{formatTime(item.createdAt)}</span>
        </div>
      )}
    </article>
  )
}
