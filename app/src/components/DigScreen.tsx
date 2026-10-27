import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { runDig, SUGGESTED_DIGS, type DigResult } from '../lib/dig'
import { useStore } from '../lib/store'
import { Icon } from './Icon'
import { DumpsterMark } from './Mark'
import { ScrapsFine } from './ScrapsFine'
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
        <form className="dig-field" onSubmit={submit} role="search">
          <Icon name="dig" size={20} />
          <input
            className="dig-field__input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="that address mom sent"
            aria-label="Dig for anything"
            enterKeyHint="search"
          />
          {text && (
            <button type="button" className="dig-field__clear" aria-label="Clear search" onClick={reset}>
              <Icon name="close" size={18} />
            </button>
          )}
          <button type="submit" className="btn btn--send" aria-label="Dig" disabled={!text.trim()}>
            <Icon name="arrow-up" size={20} />
          </button>
        </form>

        {state.phase === 'idle' && (
          <div className="dig-suggest">
            <p className="label">Try digging for</p>
            <div className="dig-suggest__chips">
              {SUGGESTED_DIGS.map((suggestion) => (
                <button key={suggestion} type="button" className="pill" onClick={() => dig(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {state.phase === 'digging' && (
          <div className="dig-working" role="status">
            <DumpsterMark size={64} strokeWidth={1.6} className="dig-working__mark" />
            <p className="label">Digging</p>
          </div>
        )}

        {state.phase === 'done' && <DigAnswer state={state} />}
      </div>
    </section>
  )
}

function DigAnswer({ state }: { state: Extract<DigState, { phase: 'done' }> }) {
  const { result } = state
  const found = result.items.length > 0
  if (!found) {
    return (
      <motion.div className="dig-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} role="status">
        <ScrapsFine className="dig-none__art" />
        <p className="dig-none__title">Nothing down here.</p>
        <p className="small dig-none__sub">Try different words.</p>
      </motion.div>
    )
  }
  return (
    <motion.div className="dig-thread" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}>
      <p className="dig-answer" role="status">{result.answer}</p>
      <AnimatePresence>
        <div className="list">
          {result.items.map((item) => <SmartCard key={item.id} item={item} />)}
        </div>
      </AnimatePresence>
    </motion.div>
  )
}
