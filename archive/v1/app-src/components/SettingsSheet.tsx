import { useStore, writeOnboarded } from '../lib/store'
import { useUi } from '../lib/ui'
import { Icon } from './Icon'
import { Sheet } from './Sheet'

interface SettingsSheetProps {
  open: boolean
  onReplayOnboarding: () => void
}

export function SettingsSheet({ open, onReplayOnboarding }: SettingsSheetProps) {
  const { resetData } = useStore()
  const { closeSheet, showToast, setShareOpen } = useUi()

  function reset() {
    resetData()
    closeSheet()
    showToast('Demo data reset. Fresh dumpster.')
  }

  function replay() {
    writeOnboarded(false)
    closeSheet()
    onReplayOnboarding()
  }

  function tryShare() {
    closeSheet()
    setShareOpen(true)
  }

  return (
    <Sheet open={open} title="Settings" onClose={closeSheet}>
      <ul className="settings">
        <li>
          <button type="button" className="settings__row" onClick={tryShare}>
            <span className="nb-icon-tile" style={{ ['--size' as string]: '40px' }}><Icon name="share" /></span>
            <span><strong className="t-h3">Try the share sheet</strong><span className="t-small settings__sub">Dump a video from fake Safari.</span></span>
          </button>
        </li>
        <li>
          <button type="button" className="settings__row" onClick={replay}>
            <span className="nb-icon-tile" style={{ ['--size' as string]: '40px', ['--tile' as string]: 'var(--pink)' }}><Icon name="dump" /></span>
            <span><strong className="t-h3">Replay onboarding</strong><span className="t-small settings__sub">Meet Scraps again.</span></span>
          </button>
        </li>
        <li>
          <button type="button" className="settings__row" onClick={reset}>
            <span className="nb-icon-tile" style={{ ['--size' as string]: '40px', ['--tile' as string]: 'var(--danger)' }}><Icon name="trash" /></span>
            <span><strong className="t-h3">Reset demo data</strong><span className="t-small settings__sub">Back to the original set.</span></span>
          </button>
        </li>
        <li className="settings__static">
          <span className="t-h3">Theme</span>
          <span className="nb-chip nb-chip--mono">Light, always</span>
        </li>
      </ul>
      <p className="t-meta settings__foot">Dumpster demo · Range Of View Studios · nothing leaves this device</p>
    </Sheet>
  )
}
