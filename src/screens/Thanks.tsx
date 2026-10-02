import { ArrowRight, BookOpen, Mail, PartyPopper } from 'lucide-react'
import { useApp } from '../state'
import { Button } from '../components/ui'

/** End of onboarding. From here on the user lives in the app (profile, courses, people). */
export function Thanks() {
  const { t, profile, goTo } = useApp()

  return (
    <div className="mx-auto max-w-2xl py-6 text-center sm:py-12">
      <span className="animate-fade-up mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-hero-via to-hero-to text-white shadow-lift">
        <PartyPopper className="size-9" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {t.thanks.title(profile.name || '👋')}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600">{t.thanks.text}</p>
      {profile.email && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-50 px-4 py-2 text-sm font-medium text-accent-800 ring-1 ring-accent-200">
          <Mail className="size-4" /> {t.thanks.contact(profile.email)}
        </p>
      )}

      <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-brand-50 p-6 ring-1 ring-brand-100 sm:p-8">
        <p className="font-medium text-brand-900">{t.thanks.unlocked}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => goTo('me')}>
            {t.thanks.openProfile} <ArrowRight className="size-5" />
          </Button>
          <Button size="lg" variant="secondary" onClick={() => goTo('courses')}>
            <BookOpen className="size-5" /> {t.me.browseCourses}
          </Button>
        </div>
      </div>
      <p className="mt-6 text-xs text-slate-400">{t.thanks.prototype}</p>
    </div>
  )
}
