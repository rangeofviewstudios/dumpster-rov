import type { ReactNode } from 'react'
import { DumpsterMark } from './Mark'

/** Phone-sized shell. On wide viewports it floats as a hairline outline beside the brand lockup. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="stage">
      <aside className="stage__brand" aria-hidden="true">
        <span className="stage__wordmark"><DumpsterMark size={30} />Dumpster</span>
        <p className="stage__tag">Dump it.<br /><em>Find it.</em></p>
        <p className="label stage__by">A demo by Range Of View Studios. Mock data, no backend.</p>
      </aside>
      <div className="phone">
        <div className="app">{children}</div>
      </div>
    </div>
  )
}
