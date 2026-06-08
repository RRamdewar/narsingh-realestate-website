import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, RefreshCw, AlertTriangle, ArrowLeft, CalendarCheck, CheckCircle2, ChevronRight,
} from 'lucide-react'
import { fetchBusyFromIcs } from '../calendar/ics'
import { buildAvailability } from '../calendar/availability'
import { isAvailabilityConfigured, PUBLISHED_ICS_URL, OWNER, AVAILABILITY } from '../calendar/config'
import { formatTime, formatRange, relativeDayLabel } from '../calendar/format'
import type { DaySlots, Slot } from '../calendar/types'

/** Build a mailto: link a visitor can use to request a chosen slot. */
function bookingMailto(slot: Slot): string {
  const when = `${slot.start.toLocaleString([], {
    weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })}`
  const subject = encodeURIComponent(`Meeting request — ${when}`)
  const body = encodeURIComponent(
    `Hi ${OWNER.name},\n\nI'd like to book the ${formatRange(slot.start, slot.end)} slot on ` +
    `${slot.start.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}.\n\n` +
    `Name:\nPhone:\nReason for meeting:\n\nThank you!`,
  )
  return `mailto:${OWNER.email}?subject=${subject}&body=${body}`
}

export default function AvailabilityPage() {
  const [days, setDays] = useState<DaySlots[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Slot | null>(null)
  const [activeDay, setActiveDay] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const busy = isAvailabilityConfigured ? await fetchBusyFromIcs(PUBLISHED_ICS_URL) : []
        if (!cancelled) setDays(buildAvailability(busy))
      } catch (e) {
        if (!cancelled) {
          // Still show open slots; just warn that we couldn't read the calendar.
          setDays(buildAvailability([]))
          setError(
            e instanceof Error && /load calendar feed/i.test(e.message)
              ? 'Could not reach the calendar feed, so all business hours are shown as open. Please confirm before relying on a time.'
              : e instanceof Error ? e.message : String(e),
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const daysWithOpenings = useMemo(
    () => days.filter((d) => d.slots.some((s) => s.available)),
    [days],
  )

  const current = daysWithOpenings[activeDay]

  if (!isAvailabilityConfigured && !loading && days.length === 0) {
    return <Shell><ConfigNotice /></Shell>
  }

  return (
    <Shell>
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-rm-blue-light text-rm-blue flex items-center justify-center mx-auto mb-4">
          <CalendarCheck size={26} />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Book Time with {OWNER.name}</h1>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          Here are the open {AVAILABILITY.slotMinutes}-minute slots over the next {AVAILABILITY.daysAhead} days.
          Pick a time that works and send a request.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3.5 mb-6 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm max-w-2xl mx-auto">
          <AlertTriangle size={17} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24"><RefreshCw className="animate-spin text-slate-400" /></div>
      ) : daysWithOpenings.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Clock size={40} className="mx-auto mb-3 opacity-40" />
          No open times in the next {AVAILABILITY.daysAhead} days. Please check back soon.
        </div>
      ) : (
        <div className="grid md:grid-cols-[220px_1fr] gap-6 max-w-3xl mx-auto">
          {/* Day picker */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {daysWithOpenings.map((d, i) => {
              const count = d.slots.filter((s) => s.available).length
              const active = i === activeDay
              return (
                <button
                  key={d.date.toISOString()}
                  onClick={() => { setActiveDay(i); setSelected(null) }}
                  className={`flex-shrink-0 md:flex-shrink text-left px-4 py-3 rounded-xl border transition-colors ${
                    active
                      ? 'bg-rm-blue text-white border-rm-blue'
                      : 'bg-white border-slate-200 hover:border-rm-blue/40 text-slate-700'
                  }`}
                >
                  <div className="font-semibold text-sm whitespace-nowrap">{relativeDayLabel(d.date)}</div>
                  <div className={`text-xs ${active ? 'text-white/80' : 'text-slate-400'}`}>
                    {count} {count === 1 ? 'opening' : 'openings'}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Slot grid */}
          <div>
            {current && (
              <>
                <h2 className="font-bold text-slate-900 mb-3">{relativeDayLabel(current.date)}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {current.slots.filter((s) => s.available).map((slot) => {
                    const isSel = selected?.start.getTime() === slot.start.getTime()
                    return (
                      <button
                        key={slot.start.toISOString()}
                        onClick={() => setSelected(slot)}
                        className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                          isSel
                            ? 'bg-rm-blue text-white border-rm-blue'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-rm-blue hover:text-rm-blue'
                        }`}
                      >
                        {formatTime(slot.start)}
                      </button>
                    )
                  })}
                </div>

                {selected && (
                  <div className="mt-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-900 font-semibold mb-1">
                      <CheckCircle2 size={18} className="text-green-600" />
                      {relativeDayLabel(selected.start)}, {formatRange(selected.start, selected.end)}
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                      Send a request for this time. {OWNER.name} will confirm by email.
                    </p>
                    <a
                      href={bookingMailto(selected)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-rm-red hover:bg-rm-red-dark text-white font-semibold rounded-md transition-colors"
                    >
                      Request this time <ChevronRight size={16} />
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-rm-blue text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Back to site
          </Link>
          <span className="text-rm-red font-black tracking-tight">RE/MAX</span>
        </div>
      </header>
      <main className="px-6 py-12">{children}</main>
    </div>
  )
}

function ConfigNotice() {
  return (
    <div className="max-w-lg mx-auto bg-white border border-amber-200 rounded-2xl p-8 shadow-sm">
      <div className="flex items-center gap-2 text-amber-600 font-bold mb-3">
        <AlertTriangle size={20} /> Availability not published yet
      </div>
      <p className="text-sm text-slate-600 mb-4">
        To show open times here, publish your Outlook calendar and add its ICS link via
        the <code className="px-1 py-0.5 bg-slate-100 rounded text-rm-blue">VITE_PUBLISHED_ICS_URL</code> environment variable.
      </p>
      <p className="text-sm text-slate-500">
        Step-by-step instructions are in <code className="px-1 py-0.5 bg-slate-100 rounded">docs/CALENDAR_SETUP.md</code>.
      </p>
    </div>
  )
}
