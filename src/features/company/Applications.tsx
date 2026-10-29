import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Award, Check, CircleCheck, CircleX, Copy, Inbox, Play, ShieldAlert, ShieldCheck } from 'lucide-react'
import type { Application, Placement, SkillLevel } from '../../data'
import { ROUTES, path, useApp } from '../../lib/state'
import { canMove } from '../../lib/placements'
import { formatRange } from '../../lib/format'
import { ExampleBadge } from '../../components/cards'
import { Field, TextArea, TextInput } from '../../components/form'
import { Modal } from '../../components/Modal'
import { Button, Card, PageHeader, cx } from '../../components/ui'
import { StatusPill } from '../student/MyPlacements'
import { NeedCompany } from './Dashboard'

/** /company/placements/:id — applicants for one placement. */
export function PlacementApplications() {
  const { id = '' } = useParams()
  const { t, l, role, companyId, placements, applications, notify } = useApp()
  const [fallback, setFallback] = useState('')
  if (role !== 'company') return <NeedCompany />
  const p = placements.find((x) => x.id === id && x.companyId === companyId)
  if (!p)
    return (
      <Link to={ROUTES.company} className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline">
        <ArrowLeft className="size-4" /> {t.nav.ourPlacements}
      </Link>
    )
  const apps = applications.filter((a) => a.placementId === p.id)
  const copyLink = async () => {
    const url = window.location.href.replace(/company\/placements\/.*/, `placements/${encodeURIComponent(p.id)}`)
    try {
      await navigator.clipboard.writeText(url)
      notify(t.applications.linkCopied)
    } catch {
      setFallback(url)
    }
  }

  return (
    <>
      <Link to={ROUTES.company} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeft className="size-4" /> {t.nav.ourPlacements}
      </Link>
      <div className="mt-4 mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-accent-600">{t.applications.title}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{l(p.title)}</h1>
        </div>
        <Button variant="secondary" onClick={copyLink}>
          <Copy className="size-4" /> {t.applications.copyLink}
        </Button>
      </div>
      {fallback && (
        <div className="mb-4 rounded-xl bg-card p-3 ring-1 ring-slate-200">
          <label htmlFor="placement-link" className="text-sm font-medium text-slate-700">
            {t.certificate.copyFallback}
          </label>
          <input id="placement-link" readOnly value={fallback} onFocus={(e) => e.currentTarget.select()} autoFocus className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 ring-1 ring-slate-300" />
        </div>
      )}
      <ApplicantList apps={apps} placements={[p]} />
    </>
  )
}

/** /company/applications — all applicants across the company's placements. */
export function AllApplications() {
  const { t, role, companyId, placements, applications } = useApp()
  if (role !== 'company') return <NeedCompany />
  const ours = placements.filter((p) => p.companyId === companyId)
  const apps = applications.filter((a) => ours.some((p) => p.id === a.placementId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return (
    <>
      <PageHeader icon={Inbox} eyebrow={t.nav.applications} title={t.applications.allTitle} />
      <ApplicantList apps={apps} placements={ours} showPlacement />
    </>
  )
}

function ApplicantList({ apps, placements, showPlacement = false }: { apps: Application[]; placements: Placement[]; showPlacement?: boolean }) {
  const { t, l, lang, certificates, moveApplication, notify } = useApp()
  const [completing, setCompleting] = useState<Application | null>(null)

  if (!apps.length) return <Card className="p-8 text-center text-slate-600">{t.applications.empty}</Card>

  const move = (a: Application, to: Application['status']) => moveApplication(a.id, to) && notify(t.applications.moved)

  return (
    <>
      <ul className="space-y-3">
        {apps.map((a) => {
          const p = placements.find((x) => x.id === a.placementId)
          const certificate = certificates.find((x) => x.applicationId === a.id)
          const minor = a.student.age < 18
          return (
            <li key={a.id} className="rounded-2xl bg-card p-4 ring-1 ring-slate-200 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={a.status} />
                    {a.isExample && <ExampleBadge />}
                    {showPlacement && p && <span className="text-sm font-semibold text-slate-700">{l(p.title)}</span>}
                  </div>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {a.student.name} <span className="text-sm font-medium text-slate-500">· {t.applications.age(a.student.age)}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    {a.student.school} · {formatRange(a.dates, lang)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 select-all">{a.student.email}{a.student.phone && ` · ${a.student.phone}`}</p>
                  <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">“{a.motivation}”</p>
                  {a.experience && <p className="mt-2 text-sm text-slate-600">{a.experience}</p>}
                  {minor && (
                    <p className={cx('mt-2 flex items-center gap-1.5 text-sm font-semibold', a.student.guardianConsent ? 'text-accent-700' : 'text-red-700')}>
                      {a.student.guardianConsent ? <ShieldCheck className="size-4" /> : <ShieldAlert className="size-4" />}
                      {a.student.guardianConsent ? t.applications.guardianOk : t.applications.guardianMissing}
                      {a.student.guardianContact && <span className="font-normal text-slate-500">· {a.student.guardianContact}</span>}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 lg:w-56 lg:flex-col">
                  {canMove(a.status, 'accepted') && (
                    <Button onClick={() => move(a, 'accepted')}>
                      <CircleCheck className="size-4" /> {t.applications.accept}
                    </Button>
                  )}
                  {canMove(a.status, 'in_progress') && (
                    <Button variant="accent" onClick={() => move(a, 'in_progress')}>
                      <Play className="size-4" /> {t.applications.start}
                    </Button>
                  )}
                  {canMove(a.status, 'completed') && (
                    <Button onClick={() => setCompleting(a)}>
                      <Award className="size-4" /> {t.applications.complete}
                    </Button>
                  )}
                  {canMove(a.status, 'declined') && (
                    <Button variant="secondary" onClick={() => move(a, 'declined')}>
                      <CircleX className="size-4" /> {t.applications.decline}
                    </Button>
                  )}
                  {certificate && (
                    <Link to={path(ROUTES.certificate, certificate.id)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-600 px-3.5 text-sm font-semibold text-white hover:bg-brand-700">
                      <Award className="size-4" /> {t.applications.viewCertificate}
                    </Link>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {completing && (
        <FeedbackModal
          application={completing}
          placement={placements.find((x) => x.id === completing.placementId)}
          onClose={() => setCompleting(null)}
        />
      )}
    </>
  )
}

/** Mentor feedback: rate each certificate skill (1–4), write a comment → issues the certificate. */
function FeedbackModal({ application, placement, onClose }: { application: Application; placement?: Placement; onClose: () => void }) {
  const { t, l, issueCertificate, notify } = useApp()
  const skills = placement?.certificateSkills ?? []
  const [levels, setLevels] = useState<SkillLevel[]>(skills.map(() => 2))
  const [comment, setComment] = useState('')
  const [mentor, setMentor] = useState(placement?.mentor.name ?? '')
  const [mentorRole, setMentorRole] = useState(placement ? l(placement.mentor.role) : '')
  const [issued, setIssued] = useState<string | null>(null)
  const [tried, setTried] = useState(false)
  const valid = comment.trim().length >= 20 && mentor.trim() && mentorRole.trim()

  const issue = () => {
    setTried(true)
    if (!valid || !placement) return
    const id = issueCertificate(application.id, {
      skills: skills.map((label, i) => ({ label, level: levels[i] })),
      feedback: comment.trim(),
      mentorName: mentor.trim(),
      mentorRole: mentorRole === l(placement.mentor.role) ? placement.mentor.role : { lv: mentorRole.trim(), en: mentorRole.trim() },
    })
    setIssued(id)
    notify(t.applications.issued)
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t.applications.feedbackTitle}
      footer={
        issued ? (
          <Link to={path(ROUTES.certificate, issued)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700">
            <Award className="size-4" /> {t.applications.viewCertificate}
          </Link>
        ) : (
          <Button onClick={issue}>
            <Award className="size-4" /> {t.applications.issue}
          </Button>
        )
      }
    >
      <div className="space-y-5 p-5 sm:p-6">
        <div className="pr-10">
          <h2 className="text-xl font-bold text-slate-900">{t.applications.feedbackTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {application.student.name} · {t.applications.feedbackText}
          </p>
        </div>
        {issued ? (
          <p className="flex items-center gap-2 rounded-xl bg-accent-100 p-4 font-semibold text-accent-800">
            <Check className="size-5" /> {t.applications.issued}: <span className="font-mono">{issued}</span>
          </p>
        ) : (
          <>
            <fieldset className="space-y-3">
              <legend className="mb-2 text-sm font-medium text-slate-800">{t.certificate.skills}</legend>
              {skills.map((s, i) => (
                <div key={i} className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-800">{l(s)}</span>
                  <div role="radiogroup" aria-label={l(s)} className="flex gap-1">
                    {([1, 2, 3, 4] as SkillLevel[]).map((n) => (
                      <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={levels[i] === n}
                        title={t.certificate.levels[n - 1]}
                        onClick={() => setLevels((ls) => ls.map((x, j) => (j === i ? n : x)))}
                        className={cx(
                          'h-9 cursor-pointer rounded-lg px-2.5 text-xs font-semibold ring-1 transition',
                          levels[i] === n ? 'bg-accent-500 text-on-accent ring-accent-500' : n < levels[i] ? 'bg-accent-100 text-accent-800 ring-accent-200' : 'bg-card text-slate-600 ring-slate-300 hover:ring-slate-400',
                        )}
                      >
                        {t.certificate.levels[n - 1]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </fieldset>
            <Field id="fb-comment" label={t.applications.comment} required hint={t.applications.commentHint} error={tried && comment.trim().length < 20 ? 'short' : undefined}>
              <TextArea id="fb-comment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} error={tried && comment.trim().length < 20 ? 'short' : undefined} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="fb-mentor" label={t.applications.mentorName} required error={tried && !mentor.trim() ? 'required' : undefined}>
                <TextInput id="fb-mentor" value={mentor} onChange={(e) => setMentor(e.target.value)} />
              </Field>
              <Field id="fb-role" label={t.applications.mentorRole} required error={tried && !mentorRole.trim() ? 'required' : undefined}>
                <TextInput id="fb-role" value={mentorRole} onChange={(e) => setMentorRole(e.target.value)} />
              </Field>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
