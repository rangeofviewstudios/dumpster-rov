import type { Tab } from '../lib/params'
import { Icon } from './Icon'

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: 'dump', label: 'Dump', icon: 'dump' },
  { id: 'piles', label: 'Piles', icon: 'piles' },
  { id: 'dig', label: 'Dig', icon: 'dig' },
]

export function TabBar({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className="tabbar__btn"
          aria-current={active === tab.id ? 'page' : undefined}
          onClick={() => onChange(tab.id)}
        >
          <span className="tabbar__tile"><Icon name={tab.icon} /></span>
          <span className="tabbar__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
