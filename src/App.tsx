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
import { Jobs } from './features/jobs/Jobs'
import { News } from './features/news/News'
import { MyProfile } from './features/profile/MyProfile'
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
  jobs: Jobs,
  news: News,
  people: People,
  person: PersonProfile,
  search: SearchPage,
}

/** Standard page frame: centred container with consistent padding. */
function Page({ step }: { step: Exclude<Step, 'welcome'> }) {
  const Screen = PAGES[step]
  return (
    <div key={step} className="animate-fade-up mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Screen />
    </div>
  )
}

function Shell() {
  const { step, stepIndex, onboarded, editing } = useApp()
  // Progress bar: during first-time onboarding, or when editing a step from the profile.
  const showStepBar = editing || (!onboarded && stepIndex > 0 && step !== 'thanks')

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      {showStepBar && <StepBar />}
      <main className="flex-1">
        <Routes>
          {/* Returning users skip sign-up and land on the news home page. */}
          <Route path={ROUTES.welcome} element={onboarded ? <Navigate to={ROUTES.news} replace /> : <Welcome />} />
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
