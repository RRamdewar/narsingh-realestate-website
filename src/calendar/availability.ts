import { AVAILABILITY } from './config'
import type { BusyInterval, CalendarEvent, DaySlots, Slot } from './types'

/** Statuses that should be treated as "busy" when computing availability. */
const BUSY_STATUSES = new Set<CalendarEvent['showAs']>(['busy', 'oof', 'tentative', 'unknown'])

/** Convert calendar events into busy intervals (ignoring "free" time). */
export function eventsToBusyIntervals(events: CalendarEvent[]): BusyInterval[] {
  return events
    .filter((e) => BUSY_STATUSES.has(e.showAs))
    .map((e) => ({ start: e.start, end: e.end }))
}

function overlaps(slotStart: Date, slotEnd: Date, busy: BusyInterval[]): boolean {
  return busy.some((b) => slotStart < b.end && slotEnd > b.start)
}

/**
 * Build a list of bookable slots per day for the configured window, marking each
 * slot available unless it overlaps a busy interval or falls before the lead time.
 */
export function buildAvailability(busy: BusyInterval[], now: Date = new Date()): DaySlots[] {
  const { daysAhead, slotMinutes, startHour, endHour, workdays, leadTimeHours } = AVAILABILITY
  const earliest = new Date(now.getTime() + leadTimeHours * 60 * 60 * 1000)
  const days: DaySlots[] = []

  for (let dayOffset = 0; dayOffset < daysAhead; dayOffset++) {
    const dayBase = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset)
    if (!workdays.includes(dayBase.getDay())) continue

    const slots: Slot[] = []
    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += slotMinutes) {
        const start = new Date(dayBase.getFullYear(), dayBase.getMonth(), dayBase.getDate(), h, m)
        const end = new Date(start.getTime() + slotMinutes * 60 * 1000)
        // Don't spill past the end of the business day.
        if (end.getHours() > endHour || (end.getHours() === endHour && end.getMinutes() > 0)) continue

        const available = start >= earliest && !overlaps(start, end, busy)
        slots.push({ start, end, available })
      }
    }

    if (slots.length > 0) days.push({ date: dayBase, slots })
  }

  return days
}
