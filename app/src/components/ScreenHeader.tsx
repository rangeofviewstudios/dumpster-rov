import type { ReactNode } from 'react'
import { Wordmark } from './Mark'

interface ScreenHeaderProps {
  /** Omit to show the mark + DUMPSTER wordmark. */
  title?: string
  subtitle?: string
  left?: ReactNode
  right?: ReactNode
}

export function ScreenHeader({ title, subtitle, left, right }: ScreenHeaderProps) {
  return (
    <header className="screen-head">
      <div className="screen-head__side">{left}</div>
      <div className="screen-head__title">
        {title ? <h1 className="label screen-head__label">{title}</h1> : <h1 className="screen-head__brand"><Wordmark /></h1>}
        {subtitle && <p className="meta">{subtitle}</p>}
      </div>
      <div className="screen-head__side screen-head__side--right">{right}</div>
    </header>
  )
}
