import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { Icon } from './Icon'

export type AttachKind = 'photo' | 'voice' | 'file'

interface ComposerProps {
  disabled?: boolean
  onSend: (text: string) => void
  onAttach: (kind: AttachKind) => void
}

const ATTACH_OPTIONS: Array<{ kind: AttachKind; label: string; icon: string }> = [
  { kind: 'photo', label: 'Photo', icon: 'image' },
  { kind: 'voice', label: 'Voice note', icon: 'mic' },
  { kind: 'file', label: 'File', icon: 'file' },
]

function detectHint(text: string): string {
  if (/https?:\/\//i.test(text)) return 'Looks like a link. Scraps will file it.'
  return ''
}

export function Composer({ disabled, onSend, onAttach }: ComposerProps) {
  const [text, setText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const hint = detectHint(text)

  function submit(event: FormEvent) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
    setMenuOpen(false)
  }

  function attach(kind: AttachKind) {
    setMenuOpen(false)
    onAttach(kind)
  }

  return (
    <form className="composer" onSubmit={submit}>
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            className="attach-menu nb-card"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.14 }}
          >
            {ATTACH_OPTIONS.map((option) => (
              <li key={option.kind}>
                <button type="button" className="attach-menu__row" onClick={() => attach(option.kind)}>
                  <Icon name={option.icon} />
                  {option.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {hint && <p className="composer__hint t-meta">{hint}</p>}
      <div className="composer__row">
        <button
          type="button"
          className="nb-btn nb-btn--cream nb-btn--sq"
          aria-label={menuOpen ? 'Close attach menu' : 'Attach: photo, voice note or file'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <motion.span animate={{ rotate: menuOpen ? 45 : 0 }} transition={{ duration: 0.14 }} className="composer__plus">
            <Icon name="plus" />
          </motion.span>
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
        <button type="submit" className="nb-btn nb-btn--sq" aria-label="Send" disabled={disabled || !text.trim()}>
          <Icon name="send" />
        </button>
      </div>
    </form>
  )
}
