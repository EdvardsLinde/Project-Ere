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

const SCREENS = {
  interests: Interests,
  profile: Profile,
  paths: Paths,
  training: Training,
  saldus: Saldus,
  thanks: Thanks,
  me: MyProfile,
}

function Shell() {
  const { step } = useApp()
  const Screen = step === 'welcome' ? null : SCREENS[step]

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      {step !== 'welcome' && step !== 'thanks' && step !== 'me' && <StepBar />}
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
