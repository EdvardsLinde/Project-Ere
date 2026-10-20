import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, RotateCcw, Sparkles } from 'lucide-react'
import { CAREERS, SKILL_AREAS, TEST_QUESTIONS } from '../../data'
import { useApp } from '../../lib/state'
import { scoreTest } from '../../lib/skills'
import { Button, Card, Meter, PageHeader, cx } from '../../components/ui'

type Phase = 'intro' | 'quiz' | 'result'

/**
 * Skills test: 12 questions (interests, self-rated ability, small scenarios).
 * Writes `profile.testResult`, which Career Match, Courses and Jobs read.
 */
export function SkillsTest() {
  const { t, l, lang, profile, update, goTo } = useApp()
  const [phase, setPhase] = useState<Phase>(profile.testResult ? 'result' : 'intro')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const total = TEST_QUESTIONS.length
  const q = TEST_QUESTIONS[index]
  const picked = answers[q?.id]

  const start = () => {
    setAnswers({})
    setIndex(0)
    setPhase('quiz')
  }

  const finish = () => {
    const result = scoreTest(answers)
    const best = Object.entries(result.trackScores).sort((a, b) => b[1] - a[1])[0][0]
    // Keep a track the user already chose; otherwise pick their best match.
    update({ testResult: result, careerId: profile.careerId ?? best })
    setPhase('result')
  }

  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-hero-from via-hero-via to-hero-to px-6 py-8 text-white sm:px-10">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
              <ClipboardCheck className="size-7" />
            </span>
            <p className="mt-5 text-sm font-semibold text-white/80">
              {t.skillsTest.eyebrow} · {t.skillsTest.duration}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{t.skillsTest.title}</h1>
            <p className="mt-3 text-white/85">{t.skillsTest.subtitle}</p>
          </div>
          <div className="p-6 sm:p-10">
            <ul className="space-y-3">
              {t.skillsTest.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent-500" /> {p}
                </li>
              ))}
            </ul>
            <Button size="lg" className="mt-8 w-full sm:w-auto" onClick={start}>
              {t.skillsTest.start} <ArrowRight className="size-5" />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (phase === 'quiz') {
    const isLast = index === total - 1
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between gap-4 text-sm">
          <span className="font-semibold text-slate-600">{t.skillsTest.question(index + 1, total)}</span>
          <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-800">
            {t.skillsTest.kinds[q.kind]}
          </span>
        </div>
        <div className="mb-8 h-2 rounded-full bg-slate-100" aria-hidden>
          <div
            className="h-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 transition-all duration-300"
            style={{ width: `${((index + (picked !== undefined ? 1 : 0)) / total) * 100}%` }}
          />
        </div>

        <h1 key={q.id} className="animate-fade-up text-2xl font-bold tracking-tight text-balance text-slate-900 sm:text-3xl">
          {l(q.prompt)}
        </h1>
        {q.help && <p className="mt-2 text-slate-500">{l(q.help)}</p>}

        <div
          role="radiogroup"
          aria-label={l(q.prompt)}
          className={cx('mt-8 grid gap-3', q.kind === 'rating' ? 'grid-cols-1 sm:grid-cols-5' : 'grid-cols-1')}
        >
          {q.options.map((opt, i) => {
            const on = picked === i
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setAnswers({ ...answers, [q.id]: i })}
                className={cx(
                  'flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl px-5 py-4 text-left font-medium transition',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
                  q.kind === 'rating' && 'sm:flex-col sm:justify-center sm:px-3 sm:text-center',
                  on
                    ? 'bg-brand-50 text-brand-900 shadow-card ring-2 ring-brand-600'
                    : 'bg-card text-slate-800 shadow-card ring-1 ring-slate-200 hover:ring-brand-300',
                )}
              >
                {q.kind === 'rating' ? (
                  <span
                    className={cx(
                      'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                      on ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600',
                    )}
                  >
                    {i + 1}
                  </span>
                ) : (
                  <span
                    className={cx(
                      'flex size-6 shrink-0 items-center justify-center rounded-full ring-2',
                      on ? 'bg-brand-600 ring-brand-600' : 'ring-slate-300',
                    )}
                  >
                    {on && <span className="size-2.5 rounded-full bg-white" />}
                  </span>
                )}
                <span className={q.kind === 'rating' ? 'text-sm' : ''}>{l(opt.label)}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => (index ? setIndex(index - 1) : setPhase('intro'))}>
            <ArrowLeft className="size-4" /> {t.skillsTest.prev}
          </Button>
          <Button size="lg" disabled={picked === undefined} onClick={() => (isLast ? finish() : setIndex(index + 1))}>
            {isLast ? t.skillsTest.finish : t.skillsTest.next} <ArrowRight className="size-5" />
          </Button>
        </div>
      </div>
    )
  }

  // Result
  const result = profile.testResult!
  const ranked = CAREERS.map((c) => ({ career: c, score: result.trackScores[c.id] ?? 0 })).sort((a, b) => b.score - a.score)
  const date = new Intl.DateTimeFormat(lang === 'lv' ? 'lv-LV' : 'en-GB', { day: 'numeric', month: 'long' }).format(
    new Date(result.takenAt),
  )

  return (
    <>
      <PageHeader icon={ClipboardCheck} eyebrow={t.skillsTest.eyebrow} title={t.skillsTest.resultTitle} subtitle={t.skillsTest.resultText} />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {ranked.map(({ career, score }, i) => (
            <Card key={career.id} className={cx('p-5 sm:p-6', i === 0 && 'ring-2 ring-brand-600')}>
              <div className="flex items-center gap-4">
                <span className={cx('flex size-12 shrink-0 items-center justify-center rounded-xl ring-1', career.tone)}>
                  <career.icon className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  {i === 0 && (
                    <p className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                      <Sparkles className="size-3.5" /> {t.skillsTest.bestFit}
                    </p>
                  )}
                  <h2 className="font-bold text-slate-900 sm:text-lg">{l(career.title)}</h2>
                </div>
                <p className="text-right">
                  <span className="block text-2xl font-extrabold text-brand-700 tabular-nums">{score}%</span>
                  <span className="text-xs text-slate-500">{t.skillsTest.match}</span>
                </p>
              </div>
              <div className="mt-4">
                <Meter value={score} tone={i === 0 ? 'brand' : 'accent'} label={l(career.title)} />
              </div>
            </Card>
          ))}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button size="lg" onClick={() => goTo('match')}>
              {t.skillsTest.seePath} <ArrowRight className="size-5" />
            </Button>
            <Button size="lg" variant="secondary" onClick={start}>
              <RotateCcw className="size-4" /> {t.skillsTest.retake}
            </Button>
          </div>
        </div>

        <Card className="p-5 sm:p-6">
          <h2 className="font-bold text-slate-900">{t.skillsTest.yourSkills}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{t.skillsTest.takenOn(date)}</p>
          <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-800">{t.skillsTest.selfCap}</p>
          <ul className="mt-5 space-y-4">
            {SKILL_AREAS.map((s) => (
              <li key={s.id}>
                <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <s.icon className="size-4 text-accent-600" /> {l(s.label)}
                  </span>
                  <span className="font-semibold text-slate-500 tabular-nums">{result.skills[s.id]}</span>
                </div>
                <Meter value={result.skills[s.id]} tone="accent" label={l(s.label)} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
