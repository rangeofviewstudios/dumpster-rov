import type { PileId } from './types'

export type Tab = 'dump' | 'piles' | 'dig'

export interface DemoParams {
  tab: Tab
  pile?: PileId
  query?: string
  sheet?: 'item' | 'settings' | 'picker'
  itemId?: string
  onboarding: boolean
  onboardingStep: number
  share: boolean
  /** True when any deep-link param is present: skip first-visit onboarding. */
  deepLinked: boolean
}

const TABS: Tab[] = ['dump', 'piles', 'dig']
const PILE_IDS: PileId[] = ['places', 'watch', 'reads', 'shopping', 'people', 'todos', 'ideas', 'unsorted']

/** Reads the screenshot/deep-link query params documented in README.md. */
export function readParams(search: string = window.location.search): DemoParams {
  const query = new URLSearchParams(search)
  const screen = query.get('screen')
  const pile = query.get('pile')
  const sheet = query.get('sheet')
  const tab = TABS.find((candidate) => candidate === screen) ?? (pile ? 'piles' : query.get('q') ? 'dig' : 'dump')
  return {
    tab,
    pile: PILE_IDS.find((candidate) => candidate === pile),
    query: query.get('q') ?? undefined,
    sheet: sheet === 'item' || sheet === 'settings' || sheet === 'picker' ? sheet : undefined,
    itemId: query.get('id') ?? undefined,
    onboarding: query.get('onboarding') === '1',
    onboardingStep: Math.min(2, Math.max(0, Number(query.get('step') ?? 1) - 1)),
    share: query.get('share') === '1',
    deepLinked: ['screen', 'pile', 'q', 'sheet', 'share'].some((key) => query.has(key)),
  }
}
