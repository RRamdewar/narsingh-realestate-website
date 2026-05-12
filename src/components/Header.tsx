import { useState, useEffect } from 'react'
import { Menu, X, TrendingUp } from 'lucide-react'
import type { TabId } from '../types'

interface Props { triggerTab: (tab: TabId) => void }

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 72
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

export default function Header({ triggerTab }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const close = () => setOpen(false)

  const navBtn = (label: string, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      className="px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:text-rm-blue hover:bg-rm-blue-light transition-colors whitespace-nowrap"
    >
      {label}
    </button>
  )

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white border-b border-slate-200 transition-shadow ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-2.5 flex-shrink-0"
          aria-label="Narsingh Team Home"
        >
          <span className="text-rm-red font-black text-2xl tracking-tight">RE/MAX</span>
          <div className="w-px h-8 bg-slate-200" />
          <span className="text-rm-blue font-bold text-[11px] leading-tight uppercase tracking-widest">
            Narsingh<br />Team
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-0.5">
          {navBtn('Our Listings', () => triggerTab('our-listings'))}
          {navBtn('Realtor.ca Listings', () => triggerTab('realtorca'))}
          {navBtn('Why Buy With Us', () => scrollTo('buy'))}
          {navBtn('Why Sell With Us', () => scrollTo('sell'))}
          {navBtn('Meet the Team', () => scrollTo('team'))}
          {navBtn('Contact', () => scrollTo('contact'))}
          <button
            onClick={() => triggerTab('valuation')}
            className="ml-2 inline-flex items-center gap-2 px-4 py-2 bg-rm-red hover:bg-rm-red-dark text-white text-sm font-semibold rounded-md transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-rm-red/30"
          >
            <TrendingUp size={14} />
            Free Valuation
          </button>
        </nav>

        {/* Hamburger */}
        <button
          className="xl:hidden p-2 rounded-md hover:bg-slate-100 transition-colors"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open
            ? <X size={22} className="text-slate-700" />
            : <Menu size={22} className="text-slate-700" />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <div className="xl:hidden absolute inset-x-0 top-[72px] bg-white border-b border-slate-200 shadow-xl p-4 space-y-1">
          {[
            ['Our Listings',        () => { triggerTab('our-listings'); close() }],
            ['Realtor.ca Listings', () => { triggerTab('realtorca');    close() }],
            ['Why Buy With Us',     () => { scrollTo('buy');   close() }],
            ['Why Sell With Us',    () => { scrollTo('sell');  close() }],
            ['Meet the Team',       () => { scrollTo('team');  close() }],
            ['Contact',             () => { scrollTo('contact'); close() }],
          ].map(([label, onClick]) => (
            <button
              key={label as string}
              onClick={onClick as () => void}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
            >
              {label as string}
            </button>
          ))}
          <button
            onClick={() => { triggerTab('valuation'); close() }}
            className="w-full mt-2 px-4 py-3 bg-rm-red hover:bg-rm-red-dark text-white text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp size={15} /> Free Home Valuation
          </button>
        </div>
      )}
    </header>
  )
}
