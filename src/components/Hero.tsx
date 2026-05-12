import { TrendingUp, Home } from 'lucide-react'
import type { TabId } from '../types'

interface Props { triggerTab: (tab: TabId) => void }

export default function Hero({ triggerTab }: Props) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center text-white pt-[72px]"
      style={{
        backgroundImage: [
          'linear-gradient(135deg, rgba(0,45,122,0.93) 0%, rgba(0,61,165,0.82) 50%, rgba(220,28,46,0.76) 100%)',
          "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1800&q=80')",
        ].join(', '),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Subtle radial overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(220,28,46,0.18) 0%, transparent 60%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 max-w-2xl">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm text-[11px] font-semibold uppercase tracking-widest text-white/90">
          RE/MAX Community Realty Inc.
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-5">
          Your Trusted<br />
          <span className="text-[#ff4d5e]">Real Estate</span><br />
          Partners
        </h1>

        <p className="text-lg text-white/85 max-w-xl leading-relaxed mb-10 font-light">
          Brandon &amp; Jai Narsingh — Award-winning agents committed to delivering exceptional
          results for buyers and sellers across the GTA.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-16">
          <button
            onClick={() => triggerTab('our-listings')}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-rm-red hover:bg-rm-red-dark text-white font-semibold rounded-md transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rm-red/40"
          >
            <Home size={16} /> View Our Listings
          </button>
          <button
            onClick={() => triggerTab('valuation')}
            className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/60 hover:border-white hover:bg-white/12 text-white font-semibold rounded-md transition-all"
          >
            <TrendingUp size={16} /> Free Home Valuation
          </button>
        </div>

        {/* Stats bar */}
        <div className="inline-flex flex-wrap items-center divide-x divide-white/20 bg-white/8 border border-white/15 rounded-xl px-2 py-4 backdrop-blur-md">
          {[
            { num: '#1',   label: 'Top Producing Agent\nRE/MAX Community 2025' },
            { num: '40+',  label: 'Years Combined\nExperience' },
            { num: '100%', label: 'Client-First\nApproach' },
          ].map(({ num, label }) => (
            <div key={num} className="flex flex-col items-center text-center px-7">
              <span className="text-3xl font-black text-[#ff4d5e] leading-none mb-1">{num}</span>
              <span className="text-[11px] text-white/70 whitespace-pre-line leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="relative w-6 h-10 border-2 border-white/40 rounded-xl scroll-indicator" />
      </div>
    </section>
  )
}
