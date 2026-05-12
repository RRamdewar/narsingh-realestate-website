import { Users, BarChart2, FileText, Star, Shield, Heart } from 'lucide-react'

const CARDS = [
  {
    icon: <Users size={22} />,
    color: 'blue' as const,
    title: 'Trusted Professional Network',
    body: 'Gain instant access to our dedicated team of vetted mortgage brokers, certified property inspectors, and experienced real estate lawyers — all working in your best interest.',
  },
  {
    icon: <BarChart2 size={22} />,
    color: 'red' as const,
    title: 'Deep Market Research & Due Diligence',
    body: "We execute extensive market research and thorough due diligence on every property before you commit. You'll always have the data you need to make a confident, informed decision.",
  },
  {
    icon: <FileText size={22} />,
    color: 'blue' as const,
    title: 'Full Inspection Report — Included',
    body: 'Every property purchase includes a comprehensive, full professional inspection report so you know exactly what you\'re buying — no surprises after closing.',
  },
  {
    icon: <Star size={22} />,
    color: 'red' as const,
    title: 'Professional Cleaning Service',
    body: 'As a value-add gift to every buyer client, we arrange a professional cleaning of your new home at your convenience — so you can move into a fresh, spotless space from day one.',
  },
  {
    icon: <Shield size={22} />,
    color: 'blue' as const,
    title: 'Client-First, Always',
    body: 'Your goals drive every decision we make. We negotiate strategically and fiercely on your behalf, ensuring you secure the right property at the right price.',
  },
  {
    icon: <Heart size={22} />,
    color: 'red' as const,
    title: "We've Been In Your Shoes",
    body: 'Both Brandon and Jai have personally navigated the homebuying process. That lived experience means empathy, honesty, and genuine guidance — not just a transaction.',
  },
]

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' })
}

export default function WhyBuy() {
  return (
    <section id="buy" className="bg-white py-24 scroll-mt-header">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-3.5 py-1 bg-rm-blue-light text-rm-blue text-[11px] font-bold uppercase tracking-widest rounded-full mb-3">
            For Buyers
          </span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Why Buy With Us?</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            We were once in your shoes — both as first-time homebuyers and seasoned purchasers.
            We understand what's at stake, and we're with you every step of the way.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CARDS.map(c => (
            <div
              key={c.title}
              className="bg-slate-50 border border-slate-200 rounded-xl p-7 hover:-translate-y-1 hover:shadow-lg hover:border-rm-blue transition-all group"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${
                c.color === 'blue' ? 'bg-rm-blue-light text-rm-blue' : 'bg-rm-red-light text-rm-red'
              }`}>
                {c.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{c.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => scrollTo('contact')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-rm-red hover:bg-rm-red-dark text-white font-semibold rounded-md transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-rm-red/30"
          >
            Start Your Buyer Journey
          </button>
          <button
            onClick={() => scrollTo('team')}
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-rm-blue text-rm-blue hover:bg-rm-blue hover:text-white font-semibold rounded-md transition-all"
          >
            Meet Your Agents
          </button>
        </div>
      </div>
    </section>
  )
}
