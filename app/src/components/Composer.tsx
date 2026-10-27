import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent, type Ref } from 'react'
import { Icon } from './Icon'
import { DumpsterMark } from './Mark'

export type AttachKind = 'photo' | 'voice' | 'file'

interface ComposerProps {
  disabled?: boolean
  rowRef?: Ref<HTMLDivElement>
  onSend: (text: string) => void
  onAttach: (kind: AttachKind) => void
}

const ATTACH_OPTIONS: Array<{ kind: AttachKind; label: string; icon: string }> = [
  { kind: 'photo', label: 'Photo', icon: 'image' },
  { kind: 'voice', label: 'Voice note', icon: 'mic' },
  { kind: 'file', label: 'File', icon: 'file' },
]

function detectHint(text: string): string {
  return /https?:\/\//i.test(text) ? 'Looks like a link.' : ''
}

export function Composer({ disabled, rowRef, onSend, onAttach }: ComposerProps) {
  const [text, setText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const hint = detectHint(text)
  const ready = Boolean(text.trim()) && !disabled

  function submit(event: FormEvent) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    setMenuOpen(false)
  }

  function attach(kind: AttachKind) {
    setMenuOpen(false)
    if (!disabled) onAttach(kind)
  }

  return (
    <form className="composer" onSubmit={submit}>
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            className="attach-menu"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {ATTACH_OPTIONS.map((option) => (
              <li key={option.kind}>
                <button type="button" className="attach-menu__row" onClick={() => attach(option.kind)}>
                  <Icon name={option.icon} size={20} />
                  {option.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {hint && <p className="composer__hint label">{hint}</p>}
      <div className="composer__row" ref={rowRef}>
        <button
          type="button"
          className="btn btn--icon"
          aria-label={menuOpen ? 'Close attach menu' : 'Attach: photo, voice note or file'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="composer__plus" data-open={menuOpen}><Icon name="plus" /></span>
        </button>
        <input
          className="composer__input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Dump anything…"
          aria-label="Dump anything"
          autoComplete="off"
          enterKeyHint="send"
        />
        <button type="submit" className="btn btn--send" aria-label="Send" disabled={!ready}>
          <DumpsterMark size={26} lidAngle={ready ? -10 : 0} className="send-mark" />
        </button>
      </div>
    </form>
  )
}
