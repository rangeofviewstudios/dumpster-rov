const DAY = 86_400_000

export function startOfDay(timestamp: number): number {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/** "Oct 3" */
export function formatShortDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** "Today", "Yesterday", or "Mon, Oct 5". */
export function formatDayLabel(timestamp: number, now: number = Date.now()): string {
  const diffDays = Math.round((startOfDay(now) - startOfDay(timestamp)) / DAY)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return new Date(timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function daysAgo(timestamp: number, now: number = Date.now()): number {
  return Math.max(0, Math.round((startOfDay(now) - startOfDay(timestamp)) / DAY))
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}
