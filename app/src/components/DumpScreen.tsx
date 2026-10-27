import { motion } from 'framer-motion'
import { Fragment, useEffect, useRef, useState } from 'react'
import { itemFromText, sampleFileItem, sampleImageItem, sampleVoiceItem } from '../lib/compose'
import { formatDayLabel } from '../lib/format'
import { useStore } from '../lib/store'
import { useUi } from '../lib/ui'
import type { Item } from '../lib/types'
import { Composer, type AttachKind } from './Composer'
import { FlightStage } from './FlightStage'
import { Icon } from './Icon'
import { pickResurface, ResurfaceCard } from './ResurfaceCard'
import { ScreenHeader } from './ScreenHeader'
import { SmartCard } from './SmartCard'

const MARK_LIFT_PX = 40

interface Flight {
  item: Item
  bubbleBottom: number
  markBottom: number
}

function bubbleLabel(item: Item): string {
  if (item.kind === 'image') return item.text
  if (item.kind === 'voice') return 'Voice note'
  if (item.kind === 'file') return item.fileName ?? 'File'
  return item.text
}

export function DumpScreen() {
  const { items, addItem, freshIds } = useStore()
  const { openSettings, setShareOpen } = useUi()
  const [flight, setFlight] = useState<Flight | null>(null)
  const screenRef = useRef<HTMLElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const threadRef = useRef<HTMLDivElement>(null)
  const didMount = useRef(false)

  const sorted = [...items].sort((a, b) => a.createdAt - b.createdAt)
  const resurface = pickResurface(items)

  useEffect(() => {
    const thread = threadRef.current
    // Scroll only the thread: scrollIntoView would also scroll the clipped app shell when a sheet is offscreen.
    thread?.scrollTo({ top: thread.scrollHeight, behavior: didMount.current ? 'smooth' : 'instant' })
    didMount.current = true
  }, [items.length, flight])

  /** Starts the send flight, anchored to where the composer actually is. */
  function send(item: Item) {
    if (flight) return
    const screen = screenRef.current?.getBoundingClientRect()
    const row = rowRef.current?.getBoundingClientRect()
    setFlight({
      item,
      bubbleBottom: screen && row ? screen.bottom - row.bottom : 12,
      markBottom: screen && row ? screen.bottom - row.top + MARK_LIFT_PX : 120,
    })
  }

  function attach(kind: AttachKind) {
    if (kind === 'photo') send(sampleImageItem())
    else if (kind === 'voice') send(sampleVoiceItem())
    else send(sampleFileItem())
  }

  return (
    <section className="screen screen--dump" aria-label="Dump" ref={screenRef}>
      <ScreenHeader
        left={
          <button type="button" className="btn btn--icon" aria-label="Settings" onClick={openSettings}>
            <Icon name="settings" />
          </button>
        }
        right={
          <button type="button" className="btn btn--icon" aria-label="Try the share sheet" onClick={() => setShareOpen(true)}>
            <Icon name="share" />
          </button>
        }
      />
      {resurface && <ResurfaceCard key={resurface.id} item={resurface} />}
      <div className="thread" ref={threadRef} role="log" aria-label="Your dump, newest at the bottom">
        {sorted.length === 0 && !flight && (
          <div className="empty">
            <p className="label">Nothing here yet</p>
            <p className="small">Type something below. Anything.</p>
          </div>
        )}
        {sorted.map((item) => {
          const index = sorted.indexOf(item)
          const showDay = index === 0 || formatDayLabel(item.createdAt) !== formatDayLabel(sorted[index - 1].createdAt)
          const fresh = freshIds.includes(item.id)
          return (
            <Fragment key={item.id}>
              {showDay && <div className="day-sep label"><span>{formatDayLabel(item.createdAt)}</span></div>}
              <motion.div
                className="thread__row"
                initial={fresh ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <SmartCard item={item} inThread />
              </motion.div>
            </Fragment>
          )
        })}
      </div>
      {flight && (
        <FlightStage
          variant="thread"
          label={bubbleLabel(flight.item)}
          bubbleBottom={flight.bubbleBottom}
          markBottom={flight.markBottom}
          onLanded={() => addItem({ ...flight.item, createdAt: Date.now() })}
          onDone={() => setFlight(null)}
        />
      )}
      <Composer disabled={Boolean(flight)} rowRef={rowRef} onSend={(text) => send(itemFromText(text))} onAttach={attach} />
    </section>
  )
}
