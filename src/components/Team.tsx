import { useState } from 'react'
import { Award, ChevronDown, Star, Smile, Clock } from 'lucide-react'

const BASE = import.meta.env.BASE_URL

interface Agent {
  name: string
  title: string
  img: string
  bio: string
  personal: string
  badge: { icon: React.ReactNode; label: string; gold: boolean }
  awards: string[]
}

const AGENTS: Agent[] = [
  {
    name: 'Brandon Narsingh',
    title: 'Sales Representative · RE/MAX Community Realty Inc.',
    img: `${BASE}images/brandon-headshot.jpg`,
    bio: 'Known for delivering results through strategic marketing, sharp negotiation, and a client-first approach. With a strong understanding of the local market and a commitment to excellence, Brandon ensures every client experiences a smooth and successful transaction.',
    personal: "When he's not selling real estate, he's hanging out with his 2 young children and looking for the next vacation with his wife.",
    badge: { icon: <Award size={13} />, label: '#1 Agent 2025', gold: true },
    awards: [
      '#1 Top Producing Agent — RE/MAX Community Realty Inc., 2025',
      'RE/MAX 100% Club Award',
      'RE/MAX Platinum Club Award',
      'RE/MAX Chairman\'s Club Award',
      'Consistent Top Performer — GTA Region',
    ],
  },
  {
    name: 'Jai Narsingh',
    title: 'Broker · RE/MAX Community Realty Inc.',
    img: `${BASE}images/jai-headshot.jpg`,
    bio: "Ambition, energy and charisma are just a few words that made Jai an industry pioneer. Adored by his many clients, Jai's experience in real estate has lasted over 40 years.",
    personal: 'You can find Jai at the cottage in the summer months and travelling to warmer countries during the winter.',
    badge: { icon: <Clock size={13} />, label: '40+ Yrs Experience', gold: false },
    awards: [
      'RE/MAX Lifetime Achievement Award',
      'RE/MAX Hall of Fame Inductee',
      'RE/MAX Diamond Award',
      'RE/MAX Platinum Club Award — Multiple Years',
      'Industry Pioneer — 40+ Years Serving Clients',
    ],
  },
]

function AgentCard({ agent }: { agent: Agent }) {
  const [awardsOpen, setAwardsOpen] = useState(false)

  function scrollContact() {
    const el = document.getElementById('contact')
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' })
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow flex flex-col">
      {/* Photo */}
      <div className="relative h-[380px] overflow-hidden bg-gradient-to-br from-rm-blue-light to-slate-100">
        <img
          src={agent.img}
          alt={agent.name}
          className="w-full h-full object-cover object-top"
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div className="absolute bottom-4 right-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-md border border-white/25 ${
            agent.badge.gold ? 'bg-gold/90' : 'bg-rm-blue/90'
          }`}>
            {agent.badge.icon} {agent.badge.label}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{agent.name}</h3>
        <p className="text-[11px] text-rm-blue font-bold uppercase tracking-widest mb-4">{agent.title}</p>
        <p className="text-slate-600 text-sm leading-relaxed mb-3">{agent.bio}</p>

        <div className="flex items-start gap-2.5 bg-slate-50 rounded-lg px-3.5 py-3 mb-5 text-sm text-slate-500 italic">
          <Smile size={14} className="text-rm-blue flex-shrink-0 mt-0.5" />
          {agent.personal}
        </div>

        {/* Expandable awards */}
        <div className="border border-slate-200 rounded-lg overflow-hidden mb-5">
          <button
            onClick={() => setAwardsOpen(o => !o)}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-rm-blue hover:bg-rm-blue-light transition-colors"
            aria-expanded={awardsOpen}
          >
            <Award size={15} />
            <span className="flex-1 text-left">Show All Career Awards</span>
            <ChevronDown size={15} className={`transition-transform ${awardsOpen ? 'rotate-180' : ''}`} />
          </button>
          {awardsOpen && (
            <ul className="border-t border-slate-200 divide-y divide-slate-100">
              {agent.awards.map(a => (
                <li key={a} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700">
                  <Star size={13} className="text-gold flex-shrink-0" />
                  {a.includes('2025') || a.includes('Lifetime') || a.includes('Hall')
                    ? <strong>{a}</strong>
                    : a}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={scrollContact}
          className="mt-auto w-full py-2.5 bg-rm-red hover:bg-rm-red-dark text-white font-semibold rounded-md transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-rm-red/30 text-sm"
        >
          Book a Consultation
        </button>
      </div>
    </div>
  )
}

export default function Team() {
  return (
    <section id="team" className="bg-slate-50 py-24 scroll-mt-header">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-3.5 py-1 bg-rm-blue-light text-rm-blue text-[11px] font-bold uppercase tracking-widest rounded-full mb-3">
            The Narsingh Team
          </span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Meet the Partners</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Two generations of real estate excellence. One shared commitment: your success.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {AGENTS.map(a => <AgentCard key={a.name} agent={a} />)}
        </div>
      </div>
    </section>
  )
}
