import { BRAND_ICONS } from '../generated/brandIcons'

/**
 * Fine-line fallbacks (24px grid, 1.5px stroke, round caps). The brand kit's icons win when present;
 * these keep the app whole while the kit is being rebuilt.
 */
const LOCAL_ICONS: Record<string, string> = {
  dump: '<path d="M5 8h14l-1.2 11H6.2z"/><path d="M4 8h16"/><path d="M9.5 12v4M12 12v4M14.5 12v4"/>',
  piles: '<path d="M4 7.5h16M4 12h16M4 16.5h16"/>',
  dig: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v3"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.4"/><path d="M20.5 16l-5-5-8 8"/>',
  settings: '<path d="M4 7.5h9M17 7.5h3M4 16.5h3M11 16.5h9"/><circle cx="15" cy="7.5" r="2"/><circle cx="9" cy="16.5" r="2"/>',
  share: '<path d="M12 14.5V3.5M8 7.5l4-4 4 4M5.5 12v7a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-7"/>',
  places: '<path d="M12 20.5s-6.5-5.7-6.5-10.8a6.5 6.5 0 0 1 13 0c0 5.1-6.5 10.8-6.5 10.8z"/><circle cx="12" cy="9.5" r="2.2"/>',
  watch: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M10.5 9.5v5l4-2.5z"/>',
  reads: '<path d="M4 6.5a1.5 1.5 0 0 1 1.5-1.5H11v14H5.5A1.5 1.5 0 0 0 4 20.5zM20 6.5A1.5 1.5 0 0 0 18.5 5H13v14h5.5a1.5 1.5 0 0 1 1.5 1.5z"/>',
  shopping: '<path d="M5.5 8.5h13l-1 11h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
  people: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5"/>',
  todos: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 12.2l2.5 2.5 4.5-5"/>',
  ideas: '<path d="M12 3.5a5.5 5.5 0 0 0-3.2 10c.6.5 1 1.1 1 1.9h4.4c0-.8.4-1.4 1-1.9a5.5 5.5 0 0 0-3.2-10z"/><path d="M10 18.5h4M10.8 21h2.4"/>',
  unsorted: '<path d="M3.5 13l2.2-6.3A1.5 1.5 0 0 1 7.1 5.7h9.8a1.5 1.5 0 0 1 1.4 1L20.5 13v5a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18z"/><path d="M3.5 13h5l1.5 2.5h4l1.5-2.5h5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  more: '<circle cx="5.5" cy="12" r="0.6"/><circle cx="12" cy="12" r="0.6"/><circle cx="18.5" cy="12" r="0.6"/>',
  file: '<path d="M7 3.5h7l4.5 4.5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h4.5"/>',
  play: '<path d="M8 5.5l10.5 6.5L8 18.5z" fill="currentColor"/>',
  pause: '<path d="M8.5 5.5v13M15.5 5.5v13"/>',
  trash: '<path d="M4.5 7h15M10 7V4.5h4V7M6.5 7l.8 12.5h9.4L17.5 7"/>',
  chevronRight: '<path d="M9 5l7 7-7 7"/>',
  chevronLeft: '<path d="M15 5l-7 7 7 7"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  external: '<path d="M14 4.5h5.5V10M19.5 4.5l-9 9M17.5 14v5h-12V7h5"/>',
  folder: '<path d="M3.5 7a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z"/>',
  text: '<path d="M5 6.5h14M12 6.5v12M9 18.5h6"/>',
  pin: '<path d="M12 20.5s-6-5.4-6-10.2a6 6 0 0 1 12 0c0 4.8-6 10.2-6 10.2z"/><circle cx="12" cy="10" r="2"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V5.5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3"/>',
  bell: '<path d="M6 16.5v-5a6 6 0 0 1 12 0v5l1.5 1.5h-15z"/><path d="M10 20.5h4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
}

interface IconProps {
  name: string
  size?: number
  className?: string
}

/** Decorative by default (aria-hidden). Put the label on the parent button. */
export function Icon({ name, size = 24, className }: IconProps) {
  const markup = BRAND_ICONS[name] ?? LOCAL_ICONS[name] ?? ''
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}
