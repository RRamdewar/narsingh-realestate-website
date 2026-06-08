import type { BusyInterval } from './types'

/**
 * Minimal iCalendar (RFC 5545) parser — just enough to pull busy intervals out
 * of an Outlook "published calendar" feed. We only read VEVENT start/end times;
 * we intentionally ignore SUMMARY so no private details leak to the public page.
 *
 * Note: published Outlook feeds expand recurrences server-side, so we do not
 * need to evaluate RRULE here.
 */

/** Unfold folded lines (continuation lines start with a space or tab). */
function unfold(raw: string): string[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  for (const line of lines) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && out.length > 0) {
      out[out.length - 1] += line.slice(1)
    } else {
      out.push(line)
    }
  }
  return out
}

/**
 * Parse an iCal date/time value. Handles:
 *   20240115T133000Z         (UTC)
 *   20240115T133000          (floating / local)
 *   20240115                 (date-only, all-day)
 * Returns a Date plus whether it was date-only.
 */
function parseIcsDate(value: string, params: Record<string, string>): { date: Date; dateOnly: boolean } {
  const clean = value.trim()

  // Date-only (all-day) values: VALUE=DATE or an 8-digit string.
  if (params.VALUE === 'DATE' || /^\d{8}$/.test(clean)) {
    const y = Number(clean.slice(0, 4))
    const m = Number(clean.slice(4, 6)) - 1
    const d = Number(clean.slice(6, 8))
    return { date: new Date(y, m, d), dateOnly: true }
  }

  const match = clean.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/)
  if (!match) return { date: new Date(NaN), dateOnly: false }

  const [, y, mo, d, h, mi, s, z] = match
  const yi = Number(y), moi = Number(mo) - 1, di = Number(d)
  const hi = Number(h), mii = Number(mi), si = Number(s)
  // Treat UTC ("Z") and floating times alike-ish: floating times are interpreted
  // in the viewer's local zone, which is the right behaviour for a local agent.
  const date = z
    ? new Date(Date.UTC(yi, moi, di, hi, mii, si))
    : new Date(yi, moi, di, hi, mii, si)
  return { date, dateOnly: false }
}

/** Split a "KEY;PARAM=VAL:value" content line into name, params and value. */
function parseContentLine(line: string): { name: string; params: Record<string, string>; value: string } | null {
  const colon = line.indexOf(':')
  if (colon === -1) return null
  const left = line.slice(0, colon)
  const value = line.slice(colon + 1)
  const [name, ...paramParts] = left.split(';')
  const params: Record<string, string> = {}
  for (const part of paramParts) {
    const eq = part.indexOf('=')
    if (eq !== -1) params[part.slice(0, eq).toUpperCase()] = part.slice(eq + 1)
  }
  return { name: name.toUpperCase(), params, value }
}

/** Extract busy intervals from raw ICS text. */
export function parseIcsBusyIntervals(raw: string): BusyInterval[] {
  const lines = unfold(raw)
  const intervals: BusyInterval[] = []

  let inEvent = false
  let start: Date | null = null
  let end: Date | null = null
  let dateOnly = false
  let transparent = false

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true
      start = end = null
      dateOnly = transparent = false
      continue
    }
    if (line === 'END:VEVENT') {
      if (start && end && !transparent && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
        intervals.push({ start, end })
      }
      inEvent = false
      continue
    }
    if (!inEvent) continue

    const parsed = parseContentLine(line)
    if (!parsed) continue

    if (parsed.name === 'DTSTART') {
      const r = parseIcsDate(parsed.value, parsed.params)
      start = r.date
      dateOnly = r.dateOnly
    } else if (parsed.name === 'DTEND') {
      end = parseIcsDate(parsed.value, parsed.params).date
    } else if (parsed.name === 'TRANSP') {
      // TRANSPARENT events (e.g. "free" appointments) don't block time.
      transparent = parsed.value.trim().toUpperCase() === 'TRANSPARENT'
    }

    // All-day event with no explicit DTEND: treat as the full start day.
    if (dateOnly && start && !end) {
      end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1)
    }
  }

  return intervals
}

/** Fetch and parse a published ICS calendar into busy intervals. */
export async function fetchBusyFromIcs(url: string): Promise<BusyInterval[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Could not load calendar feed (${res.status})`)
  const text = await res.text()
  return parseIcsBusyIntervals(text)
}
