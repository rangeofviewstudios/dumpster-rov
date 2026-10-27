export type PileId = 'places' | 'watch' | 'reads' | 'shopping' | 'people' | 'todos' | 'ideas' | 'unsorted'

export type ItemKind = 'link' | 'address' | 'todo' | 'note' | 'image' | 'voice' | 'file'

export type Platform =
  | 'youtube'
  | 'tiktok'
  | 'instagram'
  | 'article'
  | 'recipe'
  | 'amazon'
  | 'ikea'
  | 'store'
  | 'maps'
  | 'web'

export type Sender = 'Me' | 'Mom' | 'Jay'

export type ImageVariant = 'wifi' | 'flyer' | 'receipt'

export interface Item {
  id: string
  kind: ItemKind
  pile: PileId
  text: string
  createdAt: number
  from: Sender
  url?: string
  domain?: string
  platform?: Platform
  title?: string
  address?: string
  done?: boolean
  watched?: boolean
  snoozedUntil?: number
  imageVariant?: ImageVariant
  extracted?: string
  transcript?: string
  durationSec?: number
  fileName?: string
}

/** What the mock AI decides about a piece of text. */
export type Classification = Pick<Item, 'kind' | 'pile' | 'text' | 'from'> &
  Partial<Pick<Item, 'url' | 'domain' | 'platform' | 'title' | 'address' | 'done'>>
