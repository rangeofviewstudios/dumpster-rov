import type { Tab } from '../lib/params'

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'dump', label: 'Dump' },
  { id: 'piles', label: 'Piles' },
  { id: 'dig', label: 'Dig' },
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
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
