import type { ReactNode } from 'react'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  left?: ReactNode
  right?: ReactNode
}

export function ScreenHeader({ title, subtitle, left, right }: ScreenHeaderProps) {
  return (
    <header className="screen-head">
      <div className="screen-head__side">{left}</div>
      <div className="screen-head__title">
        <h1 className="t-h2">{title}</h1>
        {subtitle && <p className="t-meta">{subtitle}</p>}
      </div>
      <div className="screen-head__side screen-head__side--right">{right}</div>
    </header>
  )
}
