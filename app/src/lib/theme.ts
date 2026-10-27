export type Theme = 'dark' | 'paper'

const THEME_KEY = 'dumpster.theme.v1'
const THEME_COLOR: Record<Theme, string> = { dark: '#070707', paper: '#F4F1EC' }

export function readTheme(): Theme {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'paper' ? 'paper' : 'dark'
  } catch {
    return 'dark'
  }
}

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'paper' ? 'paper' : 'dark'
}

/** Sets [data-theme] on <html> and the browser chrome colour. Pass persist=false for URL-param previews. */
export function applyTheme(theme: Theme, persist = true): void {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  if (!persist) return
  try {
    window.localStorage.setItem(THEME_KEY, theme)
  } catch {
    // theme still applies for this session
  }
}
