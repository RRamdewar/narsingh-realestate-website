import { getAccessToken } from './msal'
import type { CalendarEvent } from './types'

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0'

/** Shape of the bits of a Graph event we care about. */
interface GraphEvent {
  id: string
  subject: string | null
  isAllDay: boolean
  showAs: string
  sensitivity?: string
  location?: { displayName?: string }
  start: { dateTime: string; timeZone: string }
  end: { dateTime: string; timeZone: string }
}

function mapShowAs(value: string): CalendarEvent['showAs'] {
  switch (value) {
    case 'free':
    case 'tentative':
    case 'busy':
    case 'oof':
    case 'workingElsewhere':
      return value
    default:
      return 'unknown'
  }
}

/**
 * Graph returns local date-times with a separate timeZone field. Requesting the
 * data with `Prefer: outlook.timezone="UTC"` lets us parse everything as UTC.
 */
function parseUtc(dateTime: string): Date {
  // Graph omits the trailing Z; append it so Date parses as UTC.
  return new Date(dateTime.endsWith('Z') ? dateTime : `${dateTime}Z`)
}

/**
 * Read the signed-in user's events between two dates using the calendarView
 * endpoint (which expands recurring events into individual occurrences).
 */
export async function getCalendarView(start: Date, end: Date): Promise<CalendarEvent[]> {
  const token = await getAccessToken()

  const params = new URLSearchParams({
    startDateTime: start.toISOString(),
    endDateTime: end.toISOString(),
    $select: 'id,subject,start,end,isAllDay,showAs,sensitivity,location',
    $orderby: 'start/dateTime',
    $top: '100',
  })

  const events: CalendarEvent[] = []
  let url: string | null = `${GRAPH_BASE}/me/calendarView?${params.toString()}`

  while (url) {
    const res: Response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Prefer: 'outlook.timezone="UTC"',
      },
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Graph request failed (${res.status}): ${body}`)
    }

    const data: { value: GraphEvent[]; '@odata.nextLink'?: string } = await res.json()

    for (const ev of data.value) {
      events.push({
        id: ev.id,
        subject: ev.subject?.trim() || '(No title)',
        start: parseUtc(ev.start.dateTime),
        end: parseUtc(ev.end.dateTime),
        isAllDay: ev.isAllDay,
        location: ev.location?.displayName || undefined,
        showAs: mapShowAs(ev.showAs),
        isPrivate: ev.sensitivity === 'private',
      })
    }

    url = data['@odata.nextLink'] ?? null
  }

  return events
}

/** Basic profile of the signed-in user, for the dashboard header. */
export async function getMe(): Promise<{ displayName: string; mail: string }> {
  const token = await getAccessToken()
  const res = await fetch(`${GRAPH_BASE}/me?$select=displayName,mail,userPrincipalName`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Graph /me failed (${res.status})`)
  const data = await res.json()
  return { displayName: data.displayName ?? '', mail: data.mail ?? data.userPrincipalName ?? '' }
}
