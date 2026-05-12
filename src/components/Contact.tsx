import { useState, type FormEvent } from 'react'
import { Phone, Mail, MapPin, CheckCircle, Send } from 'lucide-react'

const INSTAGRAM_SVG = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const FACEBOOK_SVG = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const inputCls = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm text-slate-800 bg-white focus:outline-none focus:border-rm-blue focus:ring-2 focus:ring-rm-blue/10 transition-all placeholder:text-slate-400'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1400)
  }

  return (
    <section id="contact" className="bg-slate-50 py-24 scroll-mt-header">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-3.5 py-1 bg-rm-blue-light text-rm-blue text-[11px] font-bold uppercase tracking-widest rounded-full mb-3">
            Get In Touch
          </span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Ready to Make Your Move?</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Whether you're buying, selling, or just exploring — the Narsingh Team is here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-12 items-start">
          {/* Info column */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
              {[
                { icon: <Phone size={20} />, label: 'Call Us',    value: '(647) 205-2505',            href: 'tel:+16472052505' },
                { icon: <Mail size={20} />,  label: 'Email Us',   value: 'brandon@narsinghteam.com',  href: 'mailto:brandon@narsinghteam.com' },
                { icon: <MapPin size={20} />, label: 'Brokerage', value: 'RE/MAX Community Realty Inc.\nMississauga, ON', href: undefined },
              ].map((item, i) => (
                <div key={item.label} className={`flex items-start gap-4 py-4 ${i < 2 ? 'border-b border-slate-100' : ''}`}>
                  <div className="w-11 h-11 rounded-lg bg-rm-blue-light text-rm-blue flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="font-semibold text-slate-800 hover:text-rm-blue transition-colors">{item.value}</a>
                      : <p className="font-semibold text-slate-800 whitespace-pre-line text-sm">{item.value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Follow Us</p>
              <div className="space-y-2.5">
                <a
                  href="https://www.instagram.com/brandonnarsingh.realestate"
                  target="_blank" rel="noopener"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-pink-50 border border-pink-200 text-pink-600 hover:bg-pink-100 transition-colors font-semibold text-sm"
                >
                  {INSTAGRAM_SVG} @narsinghteam
                </a>
                <a
                  href="https://www.facebook.com/brandonnarsinghrealestate"
                  target="_blank" rel="noopener"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 transition-colors font-semibold text-sm"
                >
                  {FACEBOOK_SVG} NarsinghTeam
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            {submitted ? (
              <div className="flex items-center gap-3 p-5 bg-green-50 border border-green-200 rounded-xl text-green-700 font-semibold">
                <CheckCircle size={22} className="flex-shrink-0" />
                Thanks! We'll be in touch within 24 hours.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                    <input type="text" name="name" placeholder="Your name" required className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
                    <input type="email" name="email" placeholder="your@email.com" required className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
                    <input type="tel" name="phone" placeholder="(416) 555-0123" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Inquiry Type</label>
                    <select name="inquiry" className={inputCls + ' appearance-none'}>
                      <option value="">Select…</option>
                      {[
                        ['buying',   "I'm looking to buy"],
                        ['selling',  "I'm looking to sell"],
                        ['valuation','Free home valuation'],
                        ['general',  'General question'],
                      ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message *</label>
                  <textarea name="message" rows={4} placeholder="Tell us how we can help…" required
                    className={inputCls + ' resize-y'} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-rm-red hover:bg-rm-red-dark disabled:opacity-60 text-white font-semibold rounded-md transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-rm-red/30">
                  {loading
                    ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    : <Send size={15} />}
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
