/** A normalized calendar event used throughout the calendar UI. */
export interface CalendarEvent {
  id: string
  subject: string
  start: Date
  end: Date
  isAllDay: boolean
  location?: string
  /** Free/busy status — drives availability and privacy on the public page. */
  showAs: 'free' | 'tentative' | 'busy' | 'oof' | 'workingElsewhere' | 'unknown'
  /** Whether the current viewer is allowed to see the subject/details. */
  isPrivate?: boolean
}

/** A simple busy interval used to compute availability. */
export interface BusyInterval {
  start: Date
  end: Date
}

/** A bookable time slot on the public availability page. */
export interface Slot {
  start: Date
  end: Date
  available: boolean
}

/** Slots grouped by calendar day. */
export interface DaySlots {
  date: Date
  slots: Slot[]
}
