import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'

// Calendar pages pull in MSAL, so lazy-load them to keep the marketing
// homepage bundle small — they're only fetched when those routes are visited.
const CalendarDashboard = lazy(() => import('./pages/CalendarDashboard'))
const AvailabilityPage = lazy(() => import('./pages/AvailabilityPage'))

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-7 h-7 border-2 border-slate-300 border-t-rm-blue rounded-full animate-spin" />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter keeps deep links (e.g. /#/availability) working on GitHub Pages,
        which has no server-side rewrites for client routes. */}
    <HashRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/calendar" element={<CalendarDashboard />} />
          <Route path="/availability" element={<AvailabilityPage />} />
        </Routes>
      </Suspense>
    </HashRouter>
  </StrictMode>,
)
