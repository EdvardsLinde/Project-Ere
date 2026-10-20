import { useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, Check, CheckCircle2, ChevronDown, Clock, Dumbbell, Languages, Mail, MapPin, Play, X } from 'lucide-react'
import { CAREERS, COURSES, PROVIDERS, SKILL_AREAS, TASKS } from '../../data'
import type { TaskMaterial, TrainingTask } from '../../data'
import { useApp } from '../../lib/state'
import type { CourseStatus } from '../../lib/state'
import { Button, Card, Meter, cx } from '../../components/ui'
import { ExampleBadge, ExampleNotice } from '../../components/cards'
import { Illustration } from '../../components/Illustration'

/**
 * Course page. Shows the course and — if the provider offers them — free training
 * tasks the user can solve right here. Solved tasks add skill points.
 */
export function CourseDetail() {
  const { t, l, profile, update, courseId, goTo } = useApp()
  const course = COURSES.find((c) => c.id === courseId)

  if (!course) {
    return (
      <Button variant="ghost" onClick={() => goTo('courses')}>
        <ArrowLeft className="size-4" /> {t.tasks.back}
      </Button>
    )
  }

  const provider = PROVIDERS.find((p) => p.id === course.providerId)!
  const career = CAREERS.find((c) => c.id === course.careerId)!
  const tasks = TASKS.filter((x) => x.courseId === course.id)
  const doneCount = tasks.filter((x) => profile.taskProgress[x.id] === 'done').length
  const status = profile.courseProgress[course.id]
  const skillName = (id: string) => l(SKILL_AREAS.find((s) => s.id === id)!.label)
  const setStatus = (next: CourseStatus | null) => {
    const progress = { ...profile.courseProgress }
    if (next) progress[course.id] = next
    else delete progress[course.id]
    update({ courseProgress: progress })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={() => goTo('courses')}
        className="-ml-2 mb-4 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" /> {t.tasks.back}
      </button>
      <ExampleNotice />

      <Card className="overflow-hidden">
        <Illustration scene={career.id} size="sm" />
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold', provider.tone)}>
              {provider.name.charAt(0)}
            </span>
            <span className="text-sm font-semibold text-slate-800">{provider.name}</span>
            <ExampleBadge />
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{l(course.title)}</h1>
          <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
            <Tag>{t.courses.types[course.type]}</Tag>
            <Tag icon={<career.icon className="size-3.5" />}>{l(career.title)}</Tag>
            <Tag icon={<Clock className="size-3.5" />}>{l(course.duration)}</Tag>
            <Tag icon={<MapPin className="size-3.5" />}>{t.courses.formats[course.format]}</Tag>
            <Tag icon={<Languages className="size-3.5" />}>{course.languages.map((x) => t.filters.langs[x]).join(', ')}</Tag>
            <Tag strong>{course.price === 0 ? t.courses.free : `€${course.price}`}</Tag>
          </div>
          <p className="mt-4 text-slate-700">{l(course.description)}</p>
          <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            {t.progress.gains}
            {Object.entries(course.skills).map(([id, gain]) => (
              <span key={id} className="rounded-md bg-accent-50 px-1.5 py-0.5 font-semibold text-accent-800">
                +{gain} {skillName(id)}
              </span>
            ))}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {status === 'completed' ? (
              <>
                <span className="inline-flex h-11 items-center gap-1.5 px-1 text-sm font-semibold text-accent-700">
                  <Check className="size-4" strokeWidth={2.5} /> {t.progress.completed}
                </span>
                <Button variant="ghost" onClick={() => setStatus(null)}>
                  {t.progress.undo}
                </Button>
              </>
            ) : status === 'started' ? (
              <Button variant="accent" onClick={() => setStatus('completed')}>
                <Check className="size-4" strokeWidth={2.5} /> {t.progress.complete}
              </Button>
            ) : (
              <Button onClick={() => setStatus('started')}>
                <Play className="size-4" /> {t.progress.start}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {tasks.length > 0 && (
        <section className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Dumbbell className="size-5 text-accent-600" /> {t.tasks.title}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">{t.tasks.from(provider.name)}</p>
            </div>
            <span className="text-sm font-semibold text-slate-600 tabular-nums">{t.tasks.done(doneCount, tasks.length)}</span>
          </div>
          <div className="mt-3">
            <Meter value={(doneCount / tasks.length) * 100} tone="accent" label={t.tasks.done(doneCount, tasks.length)} />
          </div>
          {doneCount === tasks.length && (
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-accent-50 px-3 py-2 text-sm font-medium text-accent-800 ring-1 ring-accent-200">
              <CheckCircle2 className="size-4" /> {t.tasks.allDone}
            </p>
          )}
          <ol className="mt-4 space-y-3">
            {tasks.map((task, i) => (
              <TaskItem key={task.id} task={task} index={i} />
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}

function Tag({ icon, strong, children }: { icon?: ReactNode; strong?: boolean; children: ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium',
        strong ? 'bg-accent-100 font-semibold text-accent-800' : 'bg-slate-100 text-slate-700',
      )}
    >
      {icon}
      {children}
    </span>
  )
}

/** One task: collapsed row → expands into material, question and instant feedback. */
function TaskItem({ task, index }: { task: TrainingTask; index: number }) {
  const { t, l, profile, update } = useApp()
  const done = profile.taskProgress[task.id] === 'done'
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const correct = checked && picked === task.correct
  const skillName = (id: string) => l(SKILL_AREAS.find((s) => s.id === id)!.label)

  const check = () => {
    setChecked(true)
    if (picked === task.correct) update({ taskProgress: { ...profile.taskProgress, [task.id]: 'done' } })
  }

  return (
    <li>
      <Card className={cx('overflow-hidden', done && 'ring-2 ring-accent-300')}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center gap-3 p-4 text-left"
        >
          <span
            className={cx(
              'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold',
              done ? 'bg-accent-500 text-on-accent' : 'bg-brand-50 text-brand-700',
            )}
          >
            {done ? <Check className="size-4" strokeWidth={3} /> : index + 1}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-slate-900">{l(task.title)}</span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span>{t.tasks.difficulty[task.difficulty]}</span>
              <span>{t.tasks.minutes(task.minutes)}</span>
              <span className="font-semibold text-accent-700">
                {Object.entries(task.skills)
                  .map(([id, g]) => `+${g} ${skillName(id)}`)
                  .join(' · ')}
              </span>
            </span>
          </span>
          {done ? (
            <span className="hidden text-xs font-semibold text-accent-700 sm:inline">{t.tasks.solved}</span>
          ) : (
            <span className="hidden text-xs font-semibold text-brand-700 sm:inline">{t.tasks.start}</span>
          )}
          <ChevronDown className={cx('size-5 shrink-0 text-slate-400 transition', open && 'rotate-180')} />
        </button>

        {open && (
          <div className="animate-fade-up border-t border-slate-100 p-4 sm:p-5">
            <p className="text-sm text-slate-700">{l(task.brief)}</p>
            {task.material && <Material material={task.material} />}
            <p className="mt-4 font-semibold text-slate-900">{l(task.question)}</p>
            <div role="radiogroup" aria-label={l(task.question)} className="mt-2 space-y-2">
              {task.options.map((opt, i) => {
                const on = picked === i
                const showRight = checked && i === task.correct && correct
                const showWrong = checked && on && !correct
                return (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    disabled={correct}
                    onClick={() => {
                      setPicked(i)
                      setChecked(false)
                    }}
                    className={cx(
                      'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium ring-1 transition disabled:cursor-default',
                      showRight && 'bg-accent-50 text-accent-900 ring-2 ring-accent-500',
                      showWrong && 'bg-red-50 text-red-700 ring-2 ring-red-400',
                      !showRight && !showWrong && (on ? 'bg-brand-50 text-brand-900 ring-2 ring-brand-600' : 'bg-card text-slate-800 ring-slate-200 hover:ring-brand-300'),
                    )}
                  >
                    <span
                      className={cx(
                        'flex size-5 shrink-0 items-center justify-center rounded-full ring-2',
                        on ? 'bg-brand-600 ring-brand-600' : 'ring-slate-300',
                      )}
                    >
                      {on && <span className="size-2 rounded-full bg-white" />}
                    </span>
                    {l(opt)}
                  </button>
                )
              })}
            </div>

            {checked ? (
              <div
                className={cx(
                  'mt-4 rounded-xl p-3 text-sm ring-1',
                  correct ? 'bg-accent-50 text-accent-900 ring-accent-200' : 'bg-red-50 text-red-700 ring-red-200',
                )}
              >
                <p className="flex items-center gap-1.5 font-bold">
                  {correct ? <CheckCircle2 className="size-4" /> : <X className="size-4" />}
                  {correct ? t.tasks.correct : t.tasks.wrong}
                </p>
                {correct && <p className="mt-1">{l(task.explanation)}</p>}
              </div>
            ) : (
              <Button className="mt-4" disabled={picked === null} onClick={check}>
                {t.tasks.check}
              </Button>
            )}
          </div>
        )}
      </Card>
    </li>
  )
}

/** Task material: a mock email, a small log table or a list of web addresses. */
function Material({ material }: { material: TaskMaterial }) {
  const { t, l } = useApp()
  if (material.kind === 'email') {
    return (
      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <Mail className="size-3.5" /> {t.tasks.from_label}: <span className="font-mono text-slate-700">{material.from}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {t.tasks.subject}: <span className="font-semibold text-slate-800">{l(material.subject)}</span>
        </p>
        <p className="mt-2 text-slate-700">{l(material.body)}</p>
      </div>
    )
  }
  if (material.kind === 'table') {
    return (
      <div className="mt-3 overflow-x-auto rounded-xl ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              {material.columns.map((c) => (
                <th key={c.lv} className="px-3 py-2 font-semibold">
                  {l(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-slate-700 tabular-nums">
            {material.rows.map((row) => (
              <tr key={row.join('|')}>
                {row.map((cell, i) => (
                  <td key={i} className="px-3 py-2 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  return (
    <ul className="mt-3 space-y-1.5">
      {material.items.map((u, i) => (
        <li key={u} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm break-all text-slate-800 ring-1 ring-slate-200">
          <span className="text-xs font-bold text-slate-400">{i + 1}.</span> {u}
        </li>
      ))}
    </ul>
  )
}
