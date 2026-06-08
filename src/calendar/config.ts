/**
 * Calendar / Microsoft Graph configuration.
 *
 * Values are read from Vite environment variables (see `.env.example`) so that
 * nothing sensitive is hard-coded. None of these are secrets — a SPA "public
 * client" App Registration has no client secret — but keeping them in env vars
 * makes it easy to point the site at a different account without code changes.
 */

const env = import.meta.env

/** Azure AD App Registration (SPA) client ID. */
export const CLIENT_ID = (env.VITE_MS_CLIENT_ID ?? '').trim()

/**
 * Authority URL.
 *  - Single tenant:  https://login.microsoftonline.com/<tenant-id>
 *  - Work + personal: https://login.microsoftonline.com/common
 *  - Personal only:   https://login.microsoftonline.com/consumers
 */
export const AUTHORITY = (env.VITE_MS_AUTHORITY ?? 'https://login.microsoftonline.com/common').trim()

/**
 * Redirect URI registered on the App Registration. Defaults to the site's
 * own origin + base path, which is what GitHub Pages serves.
 */
export const REDIRECT_URI = (env.VITE_MS_REDIRECT_URI ?? `${window.location.origin}${import.meta.env.BASE_URL}`).trim()

/** Delegated Graph permission needed to read the signed-in user's calendar. */
export const GRAPH_SCOPES = ['User.Read', 'Calendars.Read']

/** The agent whose calendar/availability is being published. */
export const OWNER = {
  name: (env.VITE_OWNER_NAME ?? 'The Narsingh Team').trim(),
  email: (env.VITE_OWNER_EMAIL ?? '').trim(),
}

/**
 * Public, no-login availability source: an Outlook "published calendar" ICS URL.
 * In Outlook on the web → Settings → Calendar → Shared calendars → Publish a
 * calendar → choose "Can view when I'm busy" → copy the ICS link.
 * Showing only free/busy keeps event details private on the public page.
 */
export const PUBLISHED_ICS_URL = (env.VITE_PUBLISHED_ICS_URL ?? '').trim()

/** Availability window / slot settings used to build bookable time slots. */
export const AVAILABILITY = {
  /** How many days ahead to show. */
  daysAhead: Number(env.VITE_AVAILABILITY_DAYS ?? 14),
  /** Length of each bookable slot, in minutes. */
  slotMinutes: Number(env.VITE_SLOT_MINUTES ?? 30),
  /** Business hours (local time, 24h). Slots only generated inside this range. */
  startHour: Number(env.VITE_DAY_START_HOUR ?? 9),
  endHour: Number(env.VITE_DAY_END_HOUR ?? 18),
  /** Days of the week that are bookable. 0 = Sunday … 6 = Saturday. */
  workdays: (env.VITE_WORKDAYS ?? '1,2,3,4,5')
    .split(',')
    .map((d: string) => Number(d.trim()))
    .filter((d: number) => !Number.isNaN(d)),
  /** Minimum lead time before the first bookable slot, in hours. */
  leadTimeHours: Number(env.VITE_LEAD_TIME_HOURS ?? 2),
}

/** True when MSAL has enough config to attempt a sign-in. */
export const isAuthConfigured = CLIENT_ID.length > 0

/** True when the public availability page has a data source configured. */
export const isAvailabilityConfigured = PUBLISHED_ICS_URL.length > 0
