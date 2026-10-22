import type { ComponentType } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppProvider, ROUTES, useApp } from './lib/state'
import type { Step } from './lib/state'
import { Footer, Header, StepBar } from './components/Layout'
// Onboarding (runs once)
import { Welcome } from './features/onboarding/Welcome'
import { Interests } from './features/onboarding/Interests'
import { Profile } from './features/onboarding/ProfileBuilder'
import { Saldus } from './features/onboarding/Saldus'
import { Thanks } from './features/onboarding/Thanks'
// Features (one route each)
import { Paths } from './features/career-match/Paths'
import { Training } from './features/career-match/Training'
import { MyPath } from './features/career-match/MyPath'
import { SkillsTest } from './features/skills-test/SkillsTest'
import { Courses } from './features/courses/Courses'
import { CourseDetail } from './features/courses/CourseDetail'
import { Jobs } from './features/jobs/Jobs'
import { News } from './features/news/News'
import { Article } from './features/news/Article'
import { MyProfile } from './features/profile/MyProfile'
import { Privacy } from './features/profile/Privacy'
import { People } from './features/people/People'
import { PersonProfile } from './features/people/PersonProfile'
import { SearchPage } from './features/search/SearchPage'

const PAGES: Record<Exclude<Step, 'welcome'>, ComponentType> = {
  interests: Interests,
  profile: Profile,
  paths: Paths,
  training: Training,
  saldus: Saldus,
  thanks: Thanks,
  me: MyProfile,
  test: SkillsTest,
  match: MyPath,
  courses: Courses,
  course: CourseDetail,
  jobs: Jobs,
  news: News,
  article: Article,
  people: People,
  person: PersonProfile,
  search: SearchPage,
  privacy: Privacy,
}

/** Standard page frame: centred container with consistent padding. */
function Page({ step }: { step: Exclude<Step, 'welcome'> }) {
  const Screen = PAGES[step]
  return (
    <div key={step} className="animate-fade-up mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <Screen />
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

function Shell() {
  const { step, stepIndex, onboarded, editing, flowActive, profile } = useApp()
  // Progress bar: during the sign-up steps, or when editing a step from the profile.
  const showStepBar = editing || (flowActive && stepIndex > 0 && step !== 'thanks')
  // Sign-up page for new users and guests; people with a profile go straight to the app.
  // (not while the sign-up steps are running — a guest who just entered a name is mid-flow)
  const hasProfile = onboarded && !!profile.name && !flowActive

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-slate-50 text-slate-900">
      <SkipLink />
      <Header />
      {showStepBar && <StepBar />}
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Routes>
          {/* Returning users skip sign-up and land on the news home page. */}
          <Route path={ROUTES.welcome} element={hasProfile ? <Navigate to={ROUTES.news} replace /> : <Welcome />} />
          {(Object.keys(PAGES) as Exclude<Step, 'welcome'>[]).map((s) => (
            <Route key={s} path={ROUTES[s]} element={<Page step={s} />} />
          ))}
          <Route path="*" element={<Navigate to={onboarded ? ROUTES.news : ROUTES.welcome} replace />} />
        </Routes>
      </main>
      <Footer />
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
