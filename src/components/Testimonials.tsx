const GOOGLE_SVG = (
  <svg viewBox="0 0 24 24" width="16" height="16">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const REVIEWS = [
  {
    initials: 'MR', name: 'Michael & Rachel T.', location: 'First-Time Homebuyers, Brampton',
    text: '"Brandon was an absolute rockstar throughout our home purchase. His market knowledge and negotiation skills saved us over $30,000 on our dream home. We couldn\'t have done it without him!"',
    featured: false,
  },
  {
    initials: 'SP', name: 'Sunita & Pradeep K.', location: 'Sellers, Mississauga',
    text: '"Jai has been in the business for so long and it truly shows. His calm experience and deep knowledge made us feel completely at ease throughout our entire sale. We sold in 5 days over asking!"',
    featured: true,
  },
  {
    initials: 'AL', name: 'Amanda L.', location: 'Buyer, Oakville',
    text: '"The full inspection report and professional cleaning were amazing bonuses we didn\'t expect. Brandon\'s team made the whole process so seamless. We\'re telling all our friends!"',
    featured: false,
  },
  {
    initials: 'DM', name: 'David M.', location: 'Seller, Burlington',
    text: '"The drone video they produced for our listing was stunning. We had multiple offers within the first weekend. The entire Narsingh Team is truly next level."',
    featured: false,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-3.5 py-1 bg-rm-blue-light text-rm-blue text-[11px] font-bold uppercase tracking-widest rounded-full mb-3">
            Client Stories
          </span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">What Our Clients Say</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Don't take our word for it — hear from the families and investors we've helped achieve their goals.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {REVIEWS.map(r => (
            <div
              key={r.name}
              className={`rounded-xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-all ${
                r.featured
                  ? 'bg-rm-blue text-white shadow-xl shadow-rm-blue/30'
                  : 'bg-slate-50 border border-slate-200 hover:shadow-md'
              }`}
            >
              <div className={`text-lg tracking-widest ${r.featured ? 'text-yellow-300' : 'text-gold'}`}>
                ★★★★★
              </div>
              <p className={`text-sm leading-relaxed flex-1 italic ${r.featured ? 'text-white/90' : 'text-slate-600'}`}>
                {r.text}
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  r.featured ? 'bg-white/20 text-white' : 'bg-rm-blue text-white'
                }`}>
                  {r.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${r.featured ? 'text-white' : 'text-slate-800'}`}>{r.name}</p>
                  <p className={`text-xs truncate ${r.featured ? 'text-white/65' : 'text-slate-500'}`}>{r.location}</p>
                </div>
                <div className={`flex items-center gap-1 text-[10px] flex-shrink-0 ${r.featured ? 'text-white/50' : 'text-slate-400'}`}>
                  {GOOGLE_SVG} Google
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <a
            href="https://g.page/r/narsinghteam/review"
            target="_blank" rel="noopener"
            className="inline-flex items-center gap-2.5 px-6 py-3 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold rounded-md transition-colors"
          >
            {GOOGLE_SVG} Leave Us a Google Review
          </a>
          <span className="text-slate-600 text-sm">
            <span className="text-gold text-base">★★★★★</span>{' '}
            <strong className="text-slate-900">5.0</strong> on Google
          </span>
        </div>
      </div>
    </section>
  )
}
