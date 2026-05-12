import { useState, type FormEvent } from 'react'
import {
  Home, MapPin, TrendingUp, Layers, Droplet, Maximize,
  ExternalLink, Search, RotateCcw, Info, CheckCircle,
  User, Mail, Phone, Calendar, DollarSign, Key,
} from 'lucide-react'
import type { TabId } from '../types'

const BASE = import.meta.env.BASE_URL

// ── Shared primitives ────────────────────────────────────────────────────────

function Chip({ label, red }: { label: string; red?: boolean }) {
  return (
    <span className={`inline-block px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-3 ${
      red ? 'bg-rm-red-light text-rm-red' : 'bg-rm-blue-light text-rm-blue'
    }`}>
      {label}
    </span>
  )
}

function PrimaryBtn({ children, onClick, href, className = '' }: {
  children: React.ReactNode; onClick?: () => void; href?: string; className?: string
}) {
  const cls = `inline-flex items-center gap-2 px-6 py-3 bg-rm-red hover:bg-rm-red-dark text-white font-semibold rounded-md transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-rm-red/30 ${className}`
  return href
    ? <a href={href} target="_blank" rel="noopener" className={cls}>{children}</a>
    : <button onClick={onClick} className={cls}>{children}</button>
}

function FieldWrap({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-slate-400 pointer-events-none">{icon}</span>
      {children}
    </div>
  )
}

const inputCls = 'w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-md text-sm text-slate-800 bg-white focus:outline-none focus:border-rm-blue focus:ring-2 focus:ring-rm-blue/10 transition-all appearance-none'

// ── Our Listings panel ───────────────────────────────────────────────────────

const LISTINGS = [
  { price: '$1,249,000', address: '42 Maple Ridge Drive',     city: 'Brampton, ON · L6Y 2K4',    beds: 4, baths: 3, sqft: '2,450', featured: true },
  { price: '$879,900',   address: '17 Brookfield Crescent',   city: 'Mississauga, ON · L5R 1P3', beds: 3, baths: 2, sqft: '1,780', featured: false },
  { price: '$2,100,000', address: '88 Estates Blvd',          city: 'Oakville, ON · L6H 7A2',    beds: 5, baths: 4, sqft: '3,900', featured: false },
]

function ListingCard({ price, address, city, beds, baths, sqft, featured }: typeof LISTINGS[0]) {
  function scrollContact() {
    const el = document.getElementById('contact')
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' })
  }
  return (
    <div className={`bg-white rounded-xl border overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all ${featured ? 'border-rm-blue ring-1 ring-rm-blue' : 'border-slate-200'}`}>
      {featured && <div className="h-1 bg-rm-blue" />}
      <div className="relative h-48 bg-gradient-to-br from-rm-blue-light to-slate-100 flex flex-col items-center justify-center gap-2 text-slate-400">
        {featured && (
          <span className="absolute top-3 left-3 bg-rm-blue text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
        <Home size={32} strokeWidth={1.5} />
        <span className="text-xs">Property Photo</span>
      </div>
      <div className="p-5">
        <p className="text-2xl font-black text-rm-blue tracking-tight mb-0.5">{price}</p>
        <h3 className="font-bold text-slate-800 mb-0.5">{address}</h3>
        <p className="text-xs text-slate-500 mb-3">{city}</p>
        <div className="flex gap-4 text-xs font-semibold text-slate-600 mb-4">
          <span className="flex items-center gap-1"><Layers size={12} /> {beds} Bed</span>
          <span className="flex items-center gap-1"><Droplet size={12} /> {baths} Bath</span>
          <span className="flex items-center gap-1"><Maximize size={12} /> {sqft} sqft</span>
        </div>
        <div className="flex gap-2">
          <button onClick={scrollContact} className="flex-1 py-2 bg-rm-red hover:bg-rm-red-dark text-white text-sm font-semibold rounded-md transition-colors">
            Book Showing
          </button>
          <button className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-rm-blue text-sm font-semibold rounded-md transition-colors">
            Details
          </button>
        </div>
      </div>
    </div>
  )
}

function OurListingsPanel() {
  return (
    <div>
      <div className="text-center mb-10">
        <Chip label="Active Listings" />
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Our Current Listings</h2>
        <p className="text-slate-500 max-w-md mx-auto">Handpicked properties expertly marketed and represented by the Narsingh Team.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {LISTINGS.map(l => <ListingCard key={l.address} {...l} />)}
      </div>
      <div className="pt-8 border-t border-slate-200 text-center">
        <a
          href="https://www.realtor.ca/agent/2213245/brandon-narsingh"
          target="_blank" rel="noopener"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-rm-blue hover:bg-rm-blue-dark text-white font-semibold rounded-md transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-rm-blue/30"
        >
          <ExternalLink size={16} /> Show All Our Listings on Realtor.ca
        </a>
      </div>
    </div>
  )
}

// ── Realtor.ca search panel ──────────────────────────────────────────────────

const MOCK = [
  { price: '$1,149,000', address: '27 Thornberry Way',          city: 'Brampton, ON',     beds: 4, baths: 3, sqft: '2,280', type: 'Detached' },
  { price: '$799,900',   address: '104 Forestbrook Dr',         city: 'Mississauga, ON',  beds: 3, baths: 2, sqft: '1,620', type: 'Semi-Detached' },
  { price: '$1,589,000', address: '9 Ravenscroft Crt',          city: 'Oakville, ON',     beds: 5, baths: 4, sqft: '3,200', type: 'Detached' },
  { price: '$649,000',   address: '302-880 Dundas St W',        city: 'Mississauga, ON',  beds: 2, baths: 2, sqft: '950',   type: 'Condo' },
  { price: '$2,450,000', address: '14 White Pines Dr',          city: 'Burlington, ON',   beds: 6, baths: 5, sqft: '4,100', type: 'Detached' },
  { price: '$539,900',   address: '1108-360 Square One Dr',     city: 'Mississauga, ON',  beds: 1, baths: 1, sqft: '620',   type: 'Condo' },
]

function RealtorCaPanel() {
  const [results, setResults] = useState<typeof MOCK | null>(null)
  const [searched, setSearched] = useState(false)

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const loc      = (fd.get('location') as string).toLowerCase()
    const type     = (fd.get('propertyType') as string).toLowerCase()
    const minPrice = parseInt(fd.get('minPrice') as string) || 0
    const maxPrice = parseInt(fd.get('maxPrice') as string) || Infinity
    const beds     = parseInt(fd.get('beds') as string) || 0

    const filtered = MOCK.filter(l => {
      const num = parseInt(l.price.replace(/\D/g, ''))
      if (loc  && !l.city.toLowerCase().includes(loc) && !l.address.toLowerCase().includes(loc)) return false
      if (type && !l.type.toLowerCase().includes(type.replace('-', ' '))) return false
      if (num < minPrice || num > maxPrice) return false
      if (l.beds < beds) return false
      return true
    })
    setResults(filtered)
    setSearched(true)
  }

  return (
    <div>
      <div className="text-center mb-8">
        <Chip label="MLS® Search" />
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Search MLS® Listings</h2>
        <p className="text-slate-500 max-w-md mx-auto">Powered by the CREA DDF® data feed — search nationwide MLS® properties.</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">City / Postal Code</label>
            <FieldWrap icon={<MapPin size={15} />}>
              <input name="location" type="text" placeholder="e.g. Brampton, ON" className={inputCls} />
            </FieldWrap>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Property Type</label>
            <FieldWrap icon={<Home size={15} />}>
              <select name="propertyType" className={inputCls}>
                <option value="">Any Type</option>
                {['Detached','Semi-Detached','Townhouse','Condo','Bungalow','Vacant Land'].map(t => (
                  <option key={t} value={t.toLowerCase()}>{t}</option>
                ))}
              </select>
            </FieldWrap>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bedrooms</label>
            <FieldWrap icon={<Layers size={15} />}>
              <select name="beds" className={inputCls}>
                <option value="">Any</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </FieldWrap>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Min Price</label>
            <FieldWrap icon={<DollarSign size={15} />}>
              <select name="minPrice" className={inputCls}>
                <option value="">No Min</option>
                {[300000,500000,700000,900000,1100000,1500000,2000000].map(p => (
                  <option key={p} value={p}>${(p/1000).toFixed(0)}K</option>
                ))}
              </select>
            </FieldWrap>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Max Price</label>
            <FieldWrap icon={<DollarSign size={15} />}>
              <select name="maxPrice" className={inputCls}>
                <option value="">No Max</option>
                {[500000,700000,900000,1100000,1500000,2000000,3000000].map(p => (
                  <option key={p} value={p}>${(p/1000).toFixed(0)}K</option>
                ))}
              </select>
            </FieldWrap>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bathrooms</label>
            <FieldWrap icon={<Droplet size={15} />}>
              <select name="baths" className={inputCls}>
                <option value="">Any</option>
                {[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </FieldWrap>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ownership</label>
            <FieldWrap icon={<Key size={15} />}>
              <select name="ownership" className={inputCls}>
                <option value="">Any</option>
                {['Freehold','Condo','Leasehold'].map(o => <option key={o} value={o.toLowerCase()}>{o}</option>)}
              </select>
            </FieldWrap>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-rm-blue hover:bg-rm-blue-dark text-white font-semibold rounded-md transition-colors">
            <Search size={15} /> Search MLS®
          </button>
          <button type="reset" onClick={() => { setResults(null); setSearched(false) }}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium rounded-md transition-colors">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </form>

      {/* Results */}
      {!searched ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 flex flex-col items-center justify-center text-center">
          <Search size={48} className="text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Ready to Search</h3>
          <p className="text-slate-500 mb-5 max-w-sm">Enter criteria above or browse live listings on Realtor.ca.</p>
          <a href="https://www.realtor.ca" target="_blank" rel="noopener"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rm-blue hover:bg-rm-blue-dark text-white font-semibold rounded-md transition-colors">
            <ExternalLink size={15} /> Browse All MLS® on Realtor.ca
          </a>
        </div>
      ) : results && results.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 flex flex-col items-center text-center">
          <Search size={48} className="text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">No Results Found</h3>
          <p className="text-slate-500">Try broadening your filters or <a href="https://www.realtor.ca" target="_blank" rel="noopener" className="text-rm-blue font-semibold underline">browse Realtor.ca</a>.</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-slate-500 font-semibold mb-4">
            {results!.length} listing{results!.length !== 1 ? 's' : ''} found · Sample data — view live results on Realtor.ca
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results!.map(l => (
              <div key={l.address} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
                <div className="h-40 bg-gradient-to-br from-rm-blue-light to-slate-100 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Home size={28} strokeWidth={1.5} />
                  <span className="text-xs">MLS® Listing</span>
                </div>
                <div className="p-4">
                  <p className="text-xl font-black text-rm-blue mb-0.5">{l.price}</p>
                  <h3 className="font-bold text-slate-800 text-sm mb-0.5">{l.address}</h3>
                  <p className="text-xs text-slate-500 mb-3">{l.city} · {l.type}</p>
                  <div className="flex gap-3 text-xs font-semibold text-slate-600 mb-3">
                    <span className="flex items-center gap-1"><Layers size={11} /> {l.beds} Bed</span>
                    <span className="flex items-center gap-1"><Droplet size={11} /> {l.baths} Bath</span>
                    <span className="flex items-center gap-1"><Maximize size={11} /> {l.sqft} sqft</span>
                  </div>
                  <a href="https://www.realtor.ca" target="_blank" rel="noopener"
                    className="w-full flex items-center justify-center gap-1.5 py-2 border border-slate-200 hover:bg-slate-50 text-rm-blue text-xs font-semibold rounded-md transition-colors">
                    <ExternalLink size={12} /> View on MLS®
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-3 items-start bg-rm-blue-light border border-blue-200 rounded-lg p-4 text-sm text-rm-blue">
        <Info size={15} className="flex-shrink-0 mt-0.5" />
        <p>Listings sourced from CREA DDF®. All MLS® data is the property of CREA and its members.
          {' '}<strong>Want personalised help?</strong>{' '}
          <a href="#contact" onClick={() => { const el = document.getElementById('contact'); if(el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' }) }} className="underline font-bold">Contact us directly.</a>
        </p>
      </div>
    </div>
  )
}

// ── Free valuation panel ─────────────────────────────────────────────────────

function ValuationPanel() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1400)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-14 items-start">
      {/* Copy */}
      <div className="pt-2">
        <Chip label="100% Free · No Obligation" />
        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          What Is Your<br />Home Worth?
        </h2>
        <p className="text-slate-500 text-lg leading-relaxed mb-8">
          Discover your property's current market value — backed by real-time MLS® comparable sales,
          neighbourhood trends, and expert analysis from the Narsingh Team.
        </p>
        <ul className="space-y-3">
          {[
            'Personalized CMA (Comparative Market Analysis)',
            'Recent neighbourhood sales data',
            'Expert pricing strategy consultation',
            'Delivered within 24 hours',
            'Zero cost. Zero obligation.',
          ].map(item => (
            <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
              <CheckCircle size={18} className="text-rm-blue flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-slate-900 mb-3">Thank You!</h3>
            <p className="text-slate-600 mb-2">Your valuation request has been received. We'll have your personalized CMA ready within 24 hours.</p>
            <p className="text-slate-700 font-semibold">Expect a call or email from the Narsingh Team shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 mb-6">Get Your Free Valuation</h3>

            {[
              { name: 'name',    label: 'Full Name *',         type: 'text',  placeholder: 'Jane Smith',                   icon: <User size={15} />,     required: true },
              { name: 'email',   label: 'Email Address *',     type: 'email', placeholder: 'jane@example.com',              icon: <Mail size={15} />,     required: true },
              { name: 'phone',   label: 'Phone Number',        type: 'tel',   placeholder: '(416) 555-0123',                icon: <Phone size={15} />,    required: false },
              { name: 'address', label: 'Property Address *',  type: 'text',  placeholder: '123 Main St, Brampton, ON',     icon: <MapPin size={15} />,   required: true },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{f.label}</label>
                <FieldWrap icon={f.icon}>
                  <input name={f.name} type={f.type} placeholder={f.placeholder} required={f.required} className={inputCls} />
                </FieldWrap>
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Property Type</label>
              <FieldWrap icon={<Home size={15} />}>
                <select name="propertyType" className={inputCls}>
                  <option value="">Select type</option>
                  {['Detached','Semi-Detached','Townhouse','Condo','Bungalow'].map(t => (
                    <option key={t} value={t.toLowerCase()}>{t}</option>
                  ))}
                </select>
              </FieldWrap>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Selling Timeline</label>
              <FieldWrap icon={<Calendar size={15} />}>
                <select name="timeline" className={inputCls}>
                  <option value="">When are you looking to sell?</option>
                  {[
                    ['asap',      'As soon as possible'],
                    ['3months',   'Within 3 months'],
                    ['6months',   'Within 6 months'],
                    ['1year',     'Within 1 year'],
                    ['exploring', 'Just exploring'],
                  ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </FieldWrap>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Additional Notes</label>
              <textarea name="notes" rows={3} placeholder="Renovations, unique features, questions…"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm text-slate-800 focus:outline-none focus:border-rm-blue focus:ring-2 focus:ring-rm-blue/10 transition-all resize-y" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-rm-red hover:bg-rm-red-dark disabled:opacity-60 text-white font-semibold rounded-md transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-rm-red/30">
              {loading
                ? <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                : <TrendingUp size={16} />}
              {loading ? 'Sending…' : 'Request My Free Valuation'}
            </button>
            <p className="text-[11px] text-slate-400 text-center leading-snug">
              By submitting, you agree to be contacted by the Narsingh Team at RE/MAX Community Realty. We respect your privacy.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Main tab container ───────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'our-listings', label: 'Our Listings',         icon: <Home size={16} /> },
  { id: 'realtorca',    label: 'Realtor.ca Listings',  icon: <MapPin size={16} /> },
  { id: 'valuation',    label: 'Free Home Valuation',  icon: <TrendingUp size={16} /> },
]

interface Props { activeTab: TabId; setActiveTab: (t: TabId) => void }

export default function ListingsTabs({ activeTab, setActiveTab }: Props) {
  // suppress unused warning — BASE is used if images need it later
  void BASE

  return (
    <section id="listings" className="bg-slate-50 py-20 scroll-mt-header">
      <div className="max-w-7xl mx-auto px-6">
        {/* Tab nav */}
        <div className="flex flex-wrap gap-1.5 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm mb-10">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? 'bg-rm-blue text-white shadow-md shadow-rm-blue/30'
                  : 'text-slate-500 hover:text-rm-blue hover:bg-rm-blue-light'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        {activeTab === 'our-listings' && <OurListingsPanel />}
        {activeTab === 'realtorca'    && <RealtorCaPanel />}
        {activeTab === 'valuation'    && <ValuationPanel />}
      </div>
    </section>
  )
}
