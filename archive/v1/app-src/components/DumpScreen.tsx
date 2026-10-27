import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, useEffect, useRef, useState } from 'react'
import { itemFromText, sampleFileItem, sampleImageItem, sampleVoiceItem } from '../lib/compose'
import { formatDayLabel } from '../lib/format'
import { useStore } from '../lib/store'
import { useUi } from '../lib/ui'
import { getPile } from '../lib/piles'
import type { Item } from '../lib/types'
import { Mascot } from './Mascot'
import { Composer, type AttachKind } from './Composer'
import { Icon } from './Icon'
import { pickResurface, ResurfaceCard } from './ResurfaceCard'
import { ScreenHeader } from './ScreenHeader'
import { SmartCard } from './SmartCard'
import { SortingIndicator } from './SortingIndicator'

const SORT_DELAY_MS = 700

function pendingLabel(item: Item): string {
  if (item.kind === 'image') return item.text
  if (item.kind === 'voice') return 'Voice note'
  if (item.kind === 'file') return item.fileName ?? 'File'
  return item.text
}

export function DumpScreen() {
  const { items, addItem } = useStore()
  const { showToast, openSettings, setShareOpen } = useUi()
  const [pending, setPending] = useState<Item[]>([])
  const endRef = useRef<HTMLDivElement>(null)
  const didMount = useRef(false)

  const sorted = [...items].sort((a, b) => a.createdAt - b.createdAt)
  const resurface = pickResurface(items)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: didMount.current ? 'smooth' : 'instant', block: 'end' })
    didMount.current = true
  }, [items.length, pending.length])

  function toss(item: Item) {
    setPending((current) => [...current, item])
    window.setTimeout(() => {
      addItem({ ...item, createdAt: Date.now() })
      setPending((current) => current.filter((candidate) => candidate.id !== item.id))
      showToast(`Tossed in ${getPile(item.pile).name}.`)
    }, SORT_DELAY_MS)
  }

  function attach(kind: AttachKind) {
    if (kind === 'photo') toss(sampleImageItem())
    else if (kind === 'voice') toss(sampleVoiceItem())
    else toss(sampleFileItem())
  }

  return (
    <section className="screen" aria-label="The Dump">
      <ScreenHeader
        title="The Dump"
        subtitle={`${items.length} things dumped`}
        left={
          <button type="button" className="nb-btn nb-btn--cream nb-btn--sq" aria-label="Settings" onClick={openSettings}>
            <Icon name="settings" />
          </button>
        }
        right={
          <button type="button" className="nb-btn nb-btn--cream nb-btn--sq" aria-label="Try the share sheet" onClick={() => setShareOpen(true)}>
            <Icon name="share" />
          </button>
        }
      />
      {resurface && <ResurfaceCard key={resurface.id} item={resurface} />}
      <div className="thread" role="log" aria-label="Your dump, newest at the bottom">
        {sorted.length === 0 && pending.length === 0 && (
          <div className="empty">
            <Mascot pose="sleep" size={120} />
            <p className="t-h3">Nothing here yet. Scraps is bored.</p>
            <p className="t-small">Type something below. Anything.</p>
          </div>
        )}
        {sorted.map((item, index) => {
          const showDay = index === 0 || formatDayLabel(item.createdAt) !== formatDayLabel(sorted[index - 1].createdAt)
          return (
            <Fragment key={item.id}>
              {showDay && <div className="day-sep t-meta"><span>{formatDayLabel(item.createdAt)}</span></div>}
              <motion.div
                className="thread__row"
                initial={index > sorted.length - 3 ? { opacity: 0, y: 14, scale: 0.97 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 520, damping: 30 }}
              >
                <SmartCard item={item} showChip />
              </motion.div>
            </Fragment>
          )
        })}
        {pending.map((item) => (
          <div className="thread__row" key={item.id}>
            <p className="note-bubble note-bubble--pending">{pendingLabel(item)}</p>
            <AnimatePresence><SortingIndicator /></AnimatePresence>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <Composer onSend={(text) => toss(itemFromText(text))} onAttach={attach} />
    </section>
  )
}
