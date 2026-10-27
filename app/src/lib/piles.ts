import type { Item, PileId } from './types'

export interface PileFilter {
  label: string
  test: (item: Item) => boolean
}

export interface Pile {
  id: PileId
  name: string
  icon: string
  group: 'saved' | 'doing'
  empty: string
  filters: PileFilter[]
}

const all: PileFilter = { label: 'All', test: () => true }

export const PILES: Pile[] = [
  {
    id: 'places', name: 'Places', icon: 'places', group: 'saved',
    empty: 'No addresses yet.',
    filters: [
      all,
      { label: 'From Mom', test: (i) => i.from === 'Mom' },
      { label: 'From Jay', test: (i) => i.from === 'Jay' },
      { label: 'Mine', test: (i) => i.from === 'Me' },
    ],
  },
  {
    id: 'watch', name: 'Watch later', icon: 'watch', group: 'saved',
    empty: 'Nothing queued.',
    filters: [
      all,
      { label: 'YouTube', test: (i) => i.platform === 'youtube' },
      { label: 'TikTok', test: (i) => i.platform === 'tiktok' },
      { label: 'Instagram', test: (i) => i.platform === 'instagram' },
    ],
  },
  {
    id: 'reads', name: 'Reads', icon: 'reads', group: 'saved',
    empty: 'No reads yet.',
    filters: [
      all,
      { label: 'Articles', test: (i) => i.platform === 'article' },
      { label: 'Recipes', test: (i) => i.platform === 'recipe' },
    ],
  },
  {
    id: 'shopping', name: 'Shopping', icon: 'shopping', group: 'saved',
    empty: 'Nothing in the cart.',
    filters: [
      all,
      { label: 'Amazon', test: (i) => i.platform === 'amazon' },
      { label: 'IKEA', test: (i) => i.platform === 'ikea' },
    ],
  },
  {
    id: 'people', name: 'People', icon: 'people', group: 'doing',
    empty: 'No people notes yet.',
    filters: [
      all,
      { label: 'Mom', test: (i) => i.from === 'Mom' },
      { label: 'Jay', test: (i) => i.from === 'Jay' },
    ],
  },
  {
    id: 'todos', name: 'To-dos', icon: 'todos', group: 'doing',
    empty: 'All clear.',
    filters: [
      all,
      { label: 'Open', test: (i) => !i.done },
      { label: 'Done', test: (i) => Boolean(i.done) },
    ],
  },
  {
    id: 'ideas', name: 'Ideas', icon: 'ideas', group: 'doing',
    empty: 'No ideas yet.',
    filters: [
      all,
      { label: 'Notes', test: (i) => i.kind === 'note' },
      { label: 'Voice', test: (i) => i.kind === 'voice' },
    ],
  },
  {
    id: 'unsorted', name: 'Unsorted', icon: 'unsorted', group: 'doing',
    empty: 'Nothing unsorted.',
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

export const PILE_GROUPS: Array<{ id: Pile['group']; label: string }> = [
  { id: 'saved', label: 'Saved' },
  { id: 'doing', label: 'Doing' },
]
