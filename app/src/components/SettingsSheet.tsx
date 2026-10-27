import { useState } from 'react'
import { useStore, writeOnboarded } from '../lib/store'
import { applyTheme, currentTheme, type Theme } from '../lib/theme'
import { useUi } from '../lib/ui'
import { Icon } from './Icon'
import { Sheet } from './Sheet'

interface SettingsSheetProps {
  open: boolean
  onReplayOnboarding: () => void
}

const THEMES: Array<{ id: Theme; label: string }> = [
  { id: 'dark', label: 'Dark' },
  { id: 'paper', label: 'Paper' },
]

export function SettingsSheet({ open, onReplayOnboarding }: SettingsSheetProps) {
  const { resetData } = useStore()
  const { closeSheet, showToast, setShareOpen } = useUi()
  const [theme, setTheme] = useState<Theme>(currentTheme)

  function chooseTheme(next: Theme) {
    applyTheme(next)
    setTheme(next)
  }

  function reset() {
    resetData()
    closeSheet()
    showToast('Demo data reset.')
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
        <li className="settings__static">
          <span className="settings__name" id="theme-label">Theme</span>
          <div className="segmented" role="radiogroup" aria-labelledby="theme-label">
            {THEMES.map((option) => (
              <button key={option.id} type="button" role="radio" aria-checked={theme === option.id} className="segmented__btn" onClick={() => chooseTheme(option.id)}>
                {option.label}
              </button>
            ))}
          </div>
        </li>
        <li>
          <button type="button" className="settings__row" onClick={tryShare}>
            <Icon name="share" size={20} />
            <span><strong className="settings__name">Try the share sheet</strong><span className="small settings__sub">Dump a video from fake Safari.</span></span>
          </button>
        </li>
        <li>
          <button type="button" className="settings__row" onClick={replay}>
            <Icon name="dump" size={20} />
            <span><strong className="settings__name">Replay onboarding</strong><span className="small settings__sub">Three screens.</span></span>
          </button>
        </li>
        <li>
          <button type="button" className="settings__row settings__row--danger" onClick={reset}>
            <Icon name="trash" size={20} />
            <span><strong className="settings__name">Reset demo data</strong><span className="small settings__sub">Back to the original set.</span></span>
          </button>
        </li>
      </ul>
      <p className="meta settings__foot">Dumpster demo · Range Of View Studios · nothing leaves this device</p>
    </Sheet>
  )
}
