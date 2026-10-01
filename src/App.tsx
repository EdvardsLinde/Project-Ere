import { AppProvider, useApp } from './state'
import { Footer, Header, StepBar } from './components/Layout'
import { Welcome } from './screens/Welcome'
import { Interests } from './screens/Interests'
import { Profile } from './screens/Profile'
import { Paths } from './screens/Paths'
import { Training } from './screens/Training'
import { Saldus } from './screens/Saldus'
import { Thanks } from './screens/Thanks'
import { MyProfile } from './screens/MyProfile'
import { Home } from './screens/Home'
import { People } from './screens/People'
import { SearchPage } from './screens/SearchPage'

const SCREENS = {
  interests: Interests,
  profile: Profile,
  paths: Paths,
  training: Training,
  saldus: Saldus,
  thanks: Thanks,
  me: MyProfile,
  home: Home,
  people: People,
  search: SearchPage,
}

function Shell() {
  const { step, stepIndex, onboarded, editing } = useApp()
  // Progress bar: during first-time onboarding, or when editing a step from the profile.
  const showStepBar = editing || (!onboarded && stepIndex > 0 && step !== 'thanks')
  const Screen = step === 'welcome' ? null : SCREENS[step]

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      {showStepBar && <StepBar />}
      <main className="flex-1">
        {Screen ? (
          <div key={step} className="animate-fade-up mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <Screen />
          </div>
        ) : (
          <Welcome />
        )}
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
