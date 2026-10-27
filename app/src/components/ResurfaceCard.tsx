import { useState } from 'react'
import { daysAgo } from '../lib/format'
import { useStore } from '../lib/store'
import { useUi } from '../lib/ui'
import type { Item } from '../lib/types'
import { Icon } from './Icon'
import { Glint } from './Mark'

const DAY_MS = 86_400_000

/** The oldest unwatched, un-snoozed video in Watch later. */
export function pickResurface(items: Item[], now: number = Date.now()): Item | undefined {
  return items
    .filter((item) => item.pile === 'watch' && !item.watched && (item.snoozedUntil ?? 0) < now)
    .sort((a, b) => a.createdAt - b.createdAt)[0]
}

/** Compact banner above the thread. Collapsed by default; expands in place and pushes the thread down. */
export function ResurfaceCard({ item }: { item: Item }) {
  const { patchItem, removeItem, restoreItem } = useStore()
  const { showToast, openItem } = useUi()
  const [expanded, setExpanded] = useState(false)
  const age = daysAgo(item.createdAt)

  function watch() {
    patchItem(item.id, { watched: true })
    showToast('Marked watched.')
  }
  function snooze() {
    patchItem(item.id, { snoozedUntil: Date.now() + DAY_MS })
    showToast('Snoozed until tomorrow.')
  }
  function remove() {
    removeItem(item.id)
    showToast('Deleted.', { label: 'Undo', onAction: () => restoreItem(item) })
  }

  return (
    <section className="resurface" aria-label="Remember this?" data-open={expanded}>
      <div className="resurface__bar">
        <Glint size={12} className="resurface__glint" />
        <p className="resurface__line">
          <strong className="label resurface__head">Remember this?</strong>
          <span className="resurface__title">{item.title}</span>
        </p>
        <button
          type="button"
          className="resurface__toggle"
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse reminder' : 'Expand reminder'}
          onClick={() => setExpanded((open) => !open)}
        >
          <Icon name="chevronRight" size={20} />
        </button>
      </div>
      {expanded && (
        <div className="resurface__more">
          <button type="button" className="resurface__open" onClick={() => openItem(item.id)}>
            <Icon name="play" size={12} />
            <span>{item.title}</span>
          </button>
          <p className="meta">Saved {age} days ago. Never watched.</p>
          <div className="resurface__actions">
            <button type="button" className="btn" onClick={watch}>Watch</button>
            <button type="button" className="btn btn--ghost" onClick={snooze}>Snooze</button>
            <button type="button" className="btn btn--ghost" onClick={remove}>Delete</button>
          </div>
        </div>
      )}
    </section>
  )
}
