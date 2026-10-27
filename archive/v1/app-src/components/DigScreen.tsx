import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { runDig, SUGGESTED_DIGS, type DigResult } from '../lib/dig'
import { useStore } from '../lib/store'
import { Icon } from './Icon'
import { Mascot } from './Mascot'
import { ScreenHeader } from './ScreenHeader'
import { SmartCard } from './SmartCard'

const DIG_DELAY_MS = 900

type DigState =
  | { phase: 'idle' }
  | { phase: 'digging'; query: string }
  | { phase: 'done'; query: string; result: DigResult }

export function DigScreen({ initialQuery }: { initialQuery?: string }) {
  const { items } = useStore()
  const [text, setText] = useState(initialQuery ?? '')
  const [state, setState] = useState<DigState>({ phase: 'idle' })
  const timer = useRef<number>(0)
  const itemsRef = useRef(items)
  itemsRef.current = items

  function dig(query: string) {
    const trimmed = query.trim()
    if (!trimmed) return
    window.clearTimeout(timer.current)
    setText(trimmed)
    setState({ phase: 'digging', query: trimmed })
    timer.current = window.setTimeout(() => {
      setState({ phase: 'done', query: trimmed, result: runDig(trimmed, itemsRef.current) })
    }, DIG_DELAY_MS)
  }

  useEffect(() => {
    if (initialQuery) dig(initialQuery)
    return () => window.clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run the deep-linked dig once on mount
  }, [])

  function submit(event: FormEvent) {
    event.preventDefault()
    dig(text)
  }

  function reset() {
    window.clearTimeout(timer.current)
    setText('')
    setState({ phase: 'idle' })
  }

  return (
    <section className="screen" aria-label="Dig">
      <ScreenHeader title="Dig" subtitle="Ask in plain words" />
      <div className="scroll dig">
        <form className="dig-field nb-card" onSubmit={submit} role="search">
          <Icon name="dig" />
          <input
            className="dig-field__input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Dig for anything… 'that address mom sent'"
            aria-label="Dig for anything"
            enterKeyHint="search"
          />
          {text && (
            <button type="button" className="dig-field__clear" aria-label="Clear search" onClick={reset}>
              <Icon name="close" size={20} />
            </button>
          )}
          <button type="submit" className="nb-btn nb-btn--sq dig-field__go" aria-label="Dig" disabled={!text.trim()}>
            <Icon name="chevronRight" />
          </button>
        </form>

        {state.phase === 'idle' && (
          <div className="dig-suggest">
            <p className="t-meta">Try digging for</p>
            <div className="dig-suggest__chips">
              {SUGGESTED_DIGS.map((suggestion) => (
                <button key={suggestion} type="button" className="nb-chip nb-chip--shadow dig-chip" onClick={() => dig(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="dig-hero">
              <Mascot pose="peek" size={120} />
              <p className="t-small">Scraps remembers everything you dump. Ask away.</p>
            </div>
          </div>
        )}

        {state.phase === 'digging' && (
          <div className="dig-working" role="status">
            <Mascot pose="dig" size={120} className="dig-working__mascot" />
            <p className="t-h3">Digging…</p>
          </div>
        )}

        {state.phase === 'done' && <DigAnswer state={state} />}
      </div>
    </section>
  )
}

function DigAnswer({ state }: { state: Extract<DigState, { phase: 'done' }> }) {
  const { query, result } = state
  const found = result.items.length > 0
  return (
    <motion.div className="dig-thread" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.16 }}>
      <p className="note-bubble note-bubble--me">{query}</p>
      <div className="scraps-says">
        <Mascot pose={found ? 'peek' : 'sleep'} size={48} />
        <p className="scraps-says__bubble">{found ? result.answer : "Couldn't dig that up. Try different words."}</p>
      </div>
      <AnimatePresence>
        {found && (
          <div className="list">
            {result.items.map((item) => <SmartCard key={item.id} item={item} />)}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
