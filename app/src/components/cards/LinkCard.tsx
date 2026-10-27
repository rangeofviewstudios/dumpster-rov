import type { Item, Platform } from '../../lib/types'
import { Thumb } from './Thumb'

const PLATFORM_LABEL: Partial<Record<Platform, string>> = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  recipe: 'Recipe',
  article: 'Article',
  amazon: 'Amazon',
  ikea: 'IKEA',
  store: 'Store',
}

export function LinkCard({ item }: { item: Item }) {
  const label = (item.platform && PLATFORM_LABEL[item.platform]) || 'Link'
  return (
    <div className="link-card">
      <Thumb item={item} label={label} video={item.pile === 'watch'} />
      <div className="link-card__text">
        <p className="link-card__title">{item.title}</p>
        <p className="meta link-card__domain">{item.domain ?? ''}</p>
      </div>
    </div>
  )
}
