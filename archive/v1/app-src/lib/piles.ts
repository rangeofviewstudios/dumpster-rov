import type { Item, PileId } from './types'

export interface PileFilter {
  label: string
  test: (item: Item) => boolean
}

export interface Pile {
  id: PileId
  name: string
  icon: string
  cssClass: string
  color: string
  empty: string
  filters: PileFilter[]
}

const all: PileFilter = { label: 'All', test: () => true }

export const PILES: Pile[] = [
  {
    id: 'places', name: 'Places', icon: 'places', cssClass: 'pile-places', color: 'var(--pink)',
    empty: 'No addresses yet. Scraps is bored.',
    filters: [
      all,
      { label: 'From Mom', test: (i) => i.from === 'Mom' },
      { label: 'From Jay', test: (i) => i.from === 'Jay' },
      { label: 'Mine', test: (i) => i.from === 'Me' },
    ],
  },
  {
    id: 'watch', name: 'Watch Later', icon: 'watch', cssClass: 'pile-watch', color: 'var(--violet)',
    empty: 'Nothing queued. Scraps is bored.',
    filters: [
      all,
      { label: 'YouTube', test: (i) => i.platform === 'youtube' },
      { label: 'TikTok', test: (i) => i.platform === 'tiktok' },
      { label: 'Instagram', test: (i) => i.platform === 'instagram' },
    ],
  },
  {
    id: 'reads', name: 'Reads', icon: 'reads', cssClass: 'pile-reads', color: 'var(--lime)',
    empty: 'No reads yet. Scraps is bored.',
    filters: [
      all,
      { label: 'Articles', test: (i) => i.platform === 'article' },
      { label: 'Recipes', test: (i) => i.platform === 'recipe' },
    ],
  },
  {
    id: 'shopping', name: 'Shopping', icon: 'shopping', cssClass: 'pile-shopping', color: 'var(--sky)',
    empty: 'Nothing in the cart. Scraps is bored.',
    filters: [
      all,
      { label: 'Amazon', test: (i) => i.platform === 'amazon' },
      { label: 'IKEA', test: (i) => i.platform === 'ikea' },
    ],
  },
  {
    id: 'people', name: 'People', icon: 'people', cssClass: 'pile-people', color: 'var(--orange)',
    empty: 'No people notes yet. Scraps is bored.',
    filters: [
      all,
      { label: 'Mom', test: (i) => i.from === 'Mom' },
      { label: 'Jay', test: (i) => i.from === 'Jay' },
    ],
  },
  {
    id: 'todos', name: 'To-dos', icon: 'todos', cssClass: 'pile-todos', color: 'var(--mint)',
    empty: 'All clear. Scraps is bored.',
    filters: [
      all,
      { label: 'Open', test: (i) => !i.done },
      { label: 'Done', test: (i) => Boolean(i.done) },
    ],
  },
  {
    id: 'ideas', name: 'Ideas', icon: 'ideas', cssClass: 'pile-ideas', color: 'var(--butter)',
    empty: 'No ideas yet. Scraps is bored.',
    filters: [
      all,
      { label: 'Notes', test: (i) => i.kind === 'note' },
      { label: 'Voice', test: (i) => i.kind === 'voice' },
    ],
  },
  {
    id: 'unsorted', name: 'Unsorted', icon: 'unsorted', cssClass: 'pile-unsorted', color: 'var(--stone)',
    empty: 'Nothing unsorted. Scraps is bored.',
    filters: [
      all,
      { label: 'Images', test: (i) => i.kind === 'image' },
      { label: 'Notes', test: (i) => i.kind === 'note' || i.kind === 'file' },
    ],
  },
]

export function getPile(id: PileId): Pile {
  return PILES.find((pile) => pile.id === id) ?? PILES[PILES.length - 1]
}
