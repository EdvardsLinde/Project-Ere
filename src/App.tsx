import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { AppProvider, ROUTES, useApp } from './lib/state'
import { Footer, Header, RolePicker, Toast } from './components/Layout'
import { Landing } from './features/landing/Landing'
import { Board } from './features/placements/Board'
import { PlacementDetail } from './features/placements/PlacementDetail'
import { Apply } from './features/placements/Apply'
import { MyCertificate, MyPlacements } from './features/student/MyPlacements'
import { CertificatePage } from './features/certificate/CertificatePage'
import { Dashboard } from './features/company/Dashboard'
import { Constructor } from './features/company/Constructor'
import { AllApplications, PlacementApplications } from './features/company/Applications'
import { Privacy } from './features/privacy/Privacy'

/** Standard page frame: centred container with consistent padding; re-mounts per URL. */
function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <div key={pathname} className="animate-fade-up mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      {children}
    </div>
  )
}

/** Keyboard users: jump past the header to the page content. */
function SkipLink() {
  const { t } = useApp()
  return (
    <button
      type="button"
      onClick={() => document.getElementById('main')?.focus()}
      className="sr-only z-50 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
    >
      {t.common.skipToContent}
    </button>
  )
}

const PAGES: [string, ReactNode][] = [
  [ROUTES.landing, <Landing />],
  [ROUTES.board, <Board />],
  [ROUTES.placement, <PlacementDetail />],
  [ROUTES.apply, <Apply />],
  [ROUTES.mine, <MyPlacements />],
  [ROUTES.myCertificate, <MyCertificate />],
  [ROUTES.certificate, <CertificatePage />],
  [ROUTES.company, <Dashboard />],
  [ROUTES.newPlacement, <Constructor />],
  [ROUTES.editPlacement, <Constructor />],
  [ROUTES.applications, <PlacementApplications />],
  [ROUTES.allApplications, <AllApplications />],
  [ROUTES.privacy, <Privacy />],
]

function Shell() {
  const { pathname } = useLocation()
  // Every new page starts at the top.
  useEffect(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }), [pathname])
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-slate-50 text-slate-900">
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Routes>
          {PAGES.map(([path, element]) => (
            <Route key={path} path={path} element={<Page>{element}</Page>} />
          ))}
          <Route path="*" element={<Navigate to={ROUTES.landing} replace />} />
        </Routes>
      </main>
      <Footer />
      <RolePicker />
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
