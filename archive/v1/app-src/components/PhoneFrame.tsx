import type { ReactNode } from 'react'
import { brandUrl } from './Mascot'

/** Phone-sized shell. On wide viewports it floats in a neo-brutal frame beside the brand lockup. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="stage">
      <aside className="stage__brand" aria-hidden="true">
        <img src={brandUrl('wordmark-ink.svg')} alt="" className="stage__wordmark" />
        <p className="stage__tag t-display">Dump it.<br />Find it.</p>
        <p className="t-small stage__by">A demo by Range Of View Studios. Mock data, no backend.</p>
      </aside>
      <div className="phone">
        <div className="app">{children}</div>
      </div>
    </div>
  )
}
