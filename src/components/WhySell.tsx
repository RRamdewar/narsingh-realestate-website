import { Layout, Camera, Video, PenTool, File, Zap, Globe, Map, TrendingUp } from 'lucide-react'
import type { TabId } from '../types'

interface Props { triggerTab: (tab: TabId) => void }

const CARDS = [
  {
    icon: <Layout size={20} />,
    title: 'Home Staging',
    body: 'Expert property presentation that emotionally connects buyers to your home — strategically showcasing every space to maximise perceived value and accelerate offers.',
    highlight: false,
  },
  {
    icon: <Camera size={20} />,
    title: 'Professional Photography',
    body: 'High-definition, magazine-quality imagery captured by seasoned real estate photographers — the first impression that stops scrolling and books showings.',
    highlight: false,
  },
  {
    icon: <Video size={20} />,
    title: 'Professional Videography',
    body: 'Cinematic property walkthroughs including stunning drone footage that delivers an immersive aerial perspective, amplifying your listing\'s reach and appeal.',
    highlight: true,
  },
  {
    icon: <PenTool size={20} />,
    title: 'Custom Graphic Design',
    body: 'Localised print marketing campaigns featuring custom-designed flyers and mailers distributed directly in your property\'s neighbourhood to capture local buyer interest.',
    highlight: false,
  },
  {
    icon: <File size={20} />,
    title: 'Premium Printed Materials',
    body: 'Luxury feature sheets handed to every showing visitor — highlighting pre-listing inspections, property highlights, and premium finishes in a polished, tangible format.',
    highlight: false,
  },
  {
    icon: <Zap size={20} />,
    title: 'Pre-Listing Professional Cleaning',
    body: 'A rigorous deep-clean by professional cleaners before your home hits the market — ensuring it shows at its absolute best from the very first viewing.',
    highlight: false,
  },
  {
    icon: <Globe size={20} />,
    title: 'Multi-Platform Exposure',
    body: 'Maximum reach across Realtor.ca, all major social media channels, and the global RE/MAX network — the world\'s #1 real estate brand with buyers in every market.',
    highlight: true,
  },
  {
    icon: <Map size={20} />,
    title: 'Open House Campaigns',
    body: 'High-visibility open house events backed by bold street signage strategically placed throughout the neighbourhood — directing every passerby directly to your property.',
    highlight: false,
  },
]

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' })
}

export default function WhySell({ triggerTab }: Props) {
  return (
    <section id="sell" className="bg-slate-900 py-24 scroll-mt-header">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-3.5 py-1 bg-rm-red/20 text-[#ff7080] border border-rm-red/30 text-[11px] font-bold uppercase tracking-widest rounded-full mb-3">
            For Sellers
          </span>
          <h2 className="text-4xl font-black text-white tracking-tight mb-4">Why Sell With Us?</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            From listing day to closing, we deploy a full-service premium concierge that maximises
            your property's value and minimises days on market.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {CARDS.map(c => (
            <div
              key={c.title}
              className={`rounded-xl p-6 transition-all hover:-translate-y-1 ${
                c.highlight
                  ? 'bg-rm-red/10 border border-rm-red/40 hover:border-rm-red'
                  : 'bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/25'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                c.highlight ? 'bg-rm-red/30 text-white' : 'bg-white/10 text-white/80'
              }`}>
                {c.icon}
              </div>
              <h3 className="font-bold text-white mb-2 text-sm">{c.title}</h3>
              <p className="text-white/60 text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: c.body.replace(/(drone footage|Realtor\.ca|RE\/MAX network|world's #1)/g, '<strong class="text-white/90">$1</strong>') }}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => triggerTab('valuation')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-rm-red hover:bg-rm-red-dark text-white font-semibold rounded-md transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-rm-red/40"
          >
            <TrendingUp size={16} /> Get My Free Home Valuation
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/50 hover:border-white hover:bg-white/10 text-white font-semibold rounded-md transition-all"
          >
            Talk to an Agent
          </button>
        </div>
      </div>
    </section>
  )
}
