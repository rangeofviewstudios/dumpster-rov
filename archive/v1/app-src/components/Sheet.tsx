import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { Icon } from './Icon'

interface SheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  /** Tint the grabber/header strip, e.g. with a pile colour. */
  accent?: string
}

/** Bottom sheet that lives inside the phone frame (absolute, not fixed). */
export function Sheet({ open, title, onClose, children, accent }: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="sheet-layer">
          <motion.div
            className="sheet-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 520, damping: 38, mass: 0.8 }}
          >
            <div className="sheet__head" style={accent ? { background: accent } : undefined}>
              <span className="sheet__grab" aria-hidden="true" />
              <h2 className="t-h3 sheet__title">{title}</h2>
              <button type="button" className="nb-btn nb-btn--cream nb-btn--sq sheet__close" onClick={onClose} aria-label="Close">
                <Icon name="close" />
              </button>
            </div>
            <div className="sheet__body">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
