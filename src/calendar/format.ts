/** Small date/time formatting helpers used across the calendar UI. */

export function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function formatDayLabel(d: Date): string {
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}

export function formatShortDay(d: Date): string {
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatRange(start: Date, end: Date): string {
  return `${formatTime(start)} – ${formatTime(end)}`
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

const RELATIVE: Record<number, string> = { 0: 'Today', 1: 'Tomorrow' }

/** "Today", "Tomorrow", or a weekday label relative to `now`. */
export function relativeDayLabel(d: Date, now: Date = new Date()): string {
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.round((target.getTime() - base.getTime()) / 86_400_000)
  return RELATIVE[diffDays] ?? formatDayLabel(d)
}
