import type { TabId } from '../types'

interface Props { triggerTab: (tab: TabId) => void }

const INSTAGRAM_SVG = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const FACEBOOK_SVG = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' })
}

export default function Footer({ triggerTab }: Props) {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 pb-12 border-b border-white/10 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-rm-red font-black text-2xl tracking-tight">RE/MAX</span>
              <div className="w-px h-8 bg-white/20" />
              <span className="text-white/70 font-bold text-[11px] leading-tight uppercase tracking-widest">
                Narsingh<br />Team
              </span>
            </div>
            <p className="text-white/45 text-sm leading-relaxed">
              Brandon &amp; Jai Narsingh<br />
              RE/MAX Community Realty Inc.<br />
              Mississauga, ON
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Our Listings',       action: () => triggerTab('our-listings') },
                { label: 'Search MLS®',         action: () => triggerTab('realtorca') },
                { label: 'Free Valuation',      action: () => triggerTab('valuation') },
                { label: 'Why Buy With Us',     action: () => scrollTo('buy') },
                { label: 'Why Sell With Us',    action: () => scrollTo('sell') },
                { label: 'Meet the Team',       action: () => scrollTo('team') },
              ].map(({ label, action }) => (
                <li key={label}>
                  <button
                    onClick={action}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-4">Contact</h4>
            <div className="space-y-2 mb-5">
              <a href="tel:+16472052505" className="block text-sm text-white/55 hover:text-white transition-colors">(647) 205-2505</a>
              <a href="mailto:brandon@narsinghteam.com" className="block text-sm text-white/55 hover:text-white transition-colors">brandon@narsinghteam.com</a>
            </div>
            <div className="flex gap-2">
              {[
                { href: 'https://www.instagram.com/brandonnarsingh.realestate', icon: INSTAGRAM_SVG, label: 'Instagram' },
                { href: 'https://www.facebook.com/brandonnarsinghrealestate',  icon: FACEBOOK_SVG,  label: 'Facebook'  },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank" rel="noopener"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-white/45 hover:text-white hover:border-white/40 hover:bg-white/8 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="space-y-2">
          <p className="text-sm text-white/35">© 2025 Narsingh Real Estate Team. All rights reserved.</p>
          <p className="text-[11px] text-white/20 leading-relaxed max-w-4xl">
            Brandon Narsingh &amp; Jai Narsingh are licensed Sales Representatives with RE/MAX Community Realty Inc., Brokerage.
            Not intended to solicit buyers or sellers currently under contract. The trademarks REALTOR®, REALTORS®, MLS®,
            Multiple Listing Service® and associated logos are owned or controlled by The Canadian Real Estate Association (CREA).
          </p>
        </div>
      </div>
    </footer>
  )
}
