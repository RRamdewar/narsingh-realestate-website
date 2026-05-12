import { useState, useCallback } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ListingsTabs from './components/ListingsTabs'
import WhyBuy from './components/WhyBuy'
import WhySell from './components/WhySell'
import Team from './components/Team'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import type { TabId } from './types'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('our-listings')

  const triggerTab = useCallback((tab: TabId) => {
    setActiveTab(tab)
    requestAnimationFrame(() => {
      const el = document.getElementById('listings')
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 80
        window.scrollTo({ top, behavior: 'smooth' })
      }
    })
  }, [])

  return (
    <div className="font-sans antialiased text-slate-800">
      <Header triggerTab={triggerTab} />
      <main>
        <Hero triggerTab={triggerTab} />
        <ListingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <WhyBuy />
        <WhySell triggerTab={triggerTab} />
        <Team />
        <Testimonials />
        <Contact />
      </main>
      <Footer triggerTab={triggerTab} />
    </div>
  )
}
