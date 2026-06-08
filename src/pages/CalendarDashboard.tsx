import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar as CalendarIcon, LogIn, LogOut, RefreshCw, MapPin, Clock,
  AlertTriangle, ArrowLeft, Lock, Share2,
} from 'lucide-react'
import { ensureMsalReady, signIn, signOut, getActiveAccount } from '../calendar/msal'
import { getCalendarView } from '../calendar/graph'
import { isAuthConfigured, OWNER, AVAILABILITY } from '../calendar/config'
import { formatRange, relativeDayLabel, isSameDay } from '../calendar/format'
import type { CalendarEvent } from '../calendar/types'

const SHOW_AS_DOT: Record<CalendarEvent['showAs'], string> = {
  free: 'bg-green-500',
  tentative: 'bg-amber-400',
  busy: 'bg-rm-red',
  oof: 'bg-purple-500',
  workingElsewhere: 'bg-sky-500',
  unknown: 'bg-slate-400',
}

function groupByDay(events: CalendarEvent[]): { date: Date; events: CalendarEvent[] }[] {
  const groups: { date: Date; events: CalendarEvent[] }[] = []
  for (const ev of events) {
    const last = groups[groups.length - 1]
    if (last && isSameDay(last.date, ev.start)) last.events.push(ev)
    else groups.push({ date: ev.start, events: [ev] })
  }
  return groups
}

export default function CalendarDashboard() {
  const [account, setAccount] = useState(getActiveAccount())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ensureMsalReady()
      .then(() => setAccount(getActiveAccount()))
      .catch((e) => setError(String(e)))
      .finally(() => setReady(true))
  }, [])

  const loadEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const start = new Date()
      const end = new Date()
      end.setDate(end.getDate() + AVAILABILITY.daysAhead)
      setEvents(await getCalendarView(start, end))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (account) loadEvents()
  }, [account, loadEvents])

  const handleSignIn = async () => {
    setError(null)
    try {
      setAccount(await signIn())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } finally {
      setAccount(null)
      setEvents([])
    }
  }

  const grouped = groupByDay(events)

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-rm-blue text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Back to site
          </Link>
          <div className="flex items-center gap-2 text-rm-blue font-bold">
            <CalendarIcon size={18} /> My Calendar
          </div>
          {account ? (
            <button onClick={handleSignOut} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-rm-red font-medium transition-colors">
              <LogOut size={15} /> Sign out
            </button>
          ) : <span className="w-20" />}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {!isAuthConfigured ? (
          <ConfigNotice />
        ) : !ready ? (
          <Centered><RefreshCw className="animate-spin text-slate-400" /></Centered>
        ) : !account ? (
          <SignInCard onSignIn={handleSignIn} error={error} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Upcoming Schedule</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Signed in as {account.username} · next {AVAILABILITY.daysAhead} days
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/availability"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-rm-blue bg-rm-blue-light rounded-md hover:bg-rm-blue/15 transition-colors"
                >
                  <Share2 size={15} /> Public link
                </Link>
                <button
                  onClick={loadEvents}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-rm-blue rounded-md hover:bg-rm-blue-dark disabled:opacity-60 transition-colors"
                >
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
            </div>

            {error && <ErrorBanner message={error} />}

            {loading && events.length === 0 ? (
              <Centered><RefreshCw className="animate-spin text-slate-400" /></Centered>
            ) : grouped.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <CalendarIcon size={40} className="mx-auto mb-3 opacity-40" />
                No events in this window. Your schedule is wide open!
              </div>
            ) : (
              <div className="space-y-8">
                {grouped.map((group) => (
                  <section key={group.date.toISOString()}>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                      {relativeDayLabel(group.date)}
                    </h2>
                    <div className="space-y-2">
                      {group.events.map((ev) => (
                        <article key={ev.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4 shadow-sm">
                          <span className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${SHOW_AS_DOT[ev.showAs]}`} />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                              {ev.isPrivate && <Lock size={13} className="text-slate-400 flex-shrink-0" />}
                              {ev.subject}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                              <span className="inline-flex items-center gap-1.5">
                                <Clock size={13} />
                                {ev.isAllDay ? 'All day' : formatRange(ev.start, ev.end)}
                              </span>
                              {ev.location && (
                                <span className="inline-flex items-center gap-1.5 truncate">
                                  <MapPin size={13} /> {ev.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center py-24">{children}</div>
}

function SignInCard({ onSignIn, error }: { onSignIn: () => void; error: string | null }) {
  return (
    <div className="max-w-md mx-auto text-center bg-white border border-slate-200 rounded-2xl p-10 shadow-sm mt-10">
      <div className="w-14 h-14 rounded-2xl bg-rm-blue-light text-rm-blue flex items-center justify-center mx-auto mb-5">
        <CalendarIcon size={26} />
      </div>
      <h1 className="text-xl font-black text-slate-900 mb-2">Connect your calendar</h1>
      <p className="text-sm text-slate-500 mb-6">
        Sign in with the Microsoft account for {OWNER.name} to view your live schedule.
        Read-only — nothing is changed or stored on any server.
      </p>
      {error && <ErrorBanner message={error} />}
      <button
        onClick={onSignIn}
        className="w-full inline-flex items-center justify-center gap-2 py-3 bg-rm-blue hover:bg-rm-blue-dark text-white font-semibold rounded-md transition-colors"
      >
        <LogIn size={17} /> Sign in with Microsoft
      </button>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 p-3.5 mb-4 bg-rm-red-light border border-rm-red/20 rounded-lg text-rm-red-dark text-sm text-left">
      <AlertTriangle size={17} className="flex-shrink-0 mt-0.5" />
      <span className="break-words">{message}</span>
    </div>
  )
}

function ConfigNotice() {
  return (
    <div className="max-w-lg mx-auto bg-white border border-amber-200 rounded-2xl p-8 shadow-sm mt-10">
      <div className="flex items-center gap-2 text-amber-600 font-bold mb-3">
        <AlertTriangle size={20} /> Setup needed
      </div>
      <p className="text-sm text-slate-600 mb-4">
        The Microsoft calendar connection hasn't been configured yet. Add an Azure
        App Registration client ID via the <code className="px-1 py-0.5 bg-slate-100 rounded text-rm-blue">VITE_MS_CLIENT_ID</code> environment
        variable.
      </p>
      <p className="text-sm text-slate-500">
        See <code className="px-1 py-0.5 bg-slate-100 rounded">docs/CALENDAR_SETUP.md</code> for step-by-step instructions.
      </p>
    </div>
  )
}
