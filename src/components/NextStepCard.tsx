import { ArrowRight, BriefcaseBusiness, ClipboardCheck, Dumbbell, GraduationCap, UserRound } from 'lucide-react'
import { useApp } from '../lib/state'
import { nextStep } from '../lib/nextStep'
import { Button } from './ui'

/** One clear "do this next" card that walks the user along the core path. */
export function NextStepCard() {
  const { t, l, profile, goTo, openCourse } = useApp()
  const step = nextStep(profile)

  const view = (() => {
    switch (step.kind) {
      case 'profile':
        return { icon: UserRound, title: t.nextStep.profile.title, text: t.nextStep.profile.text, cta: t.nextStep.profile.cta, go: () => goTo('welcome') }
      case 'test':
        return { icon: ClipboardCheck, title: t.nextStep.test.title, text: t.nextStep.test.text, cta: t.nextStep.test.cta, go: () => goTo('test') }
      case 'tasks':
        return {
          icon: Dumbbell,
          title: t.nextStep.tasks.title(step.left),
          text: l(step.course.title),
          cta: t.nextStep.tasks.cta,
          go: () => openCourse(step.course.id),
        }
      case 'course':
        return {
          icon: GraduationCap,
          title: t.nextStep.course.title,
          text: l(step.course.title),
          cta: t.nextStep.course.cta,
          go: () => openCourse(step.course.id),
        }
      default:
        return { icon: BriefcaseBusiness, title: t.nextStep.jobs.title, text: t.nextStep.jobs.text, cta: t.nextStep.jobs.cta, go: () => goTo('jobs') }
    }
  })()
  const Icon = view.icon

  return (
    <div className="mb-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-hero-from via-hero-via to-hero-to p-3 text-white shadow-lift sm:gap-4 sm:p-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30 sm:size-12">
        <Icon className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold tracking-wide text-white/75 uppercase">{t.nextStep.label}</span>
        <span className="block truncate font-bold sm:text-lg">{view.title}</span>
        <span className="block truncate text-xs text-white/80 sm:text-sm">{view.text}</span>
      </span>
      <Button variant="light" className="shrink-0" onClick={view.go}>
        <span className="hidden sm:inline">{view.cta}</span> <ArrowRight className="size-4" />
      </Button>
    </div>
  )
}
