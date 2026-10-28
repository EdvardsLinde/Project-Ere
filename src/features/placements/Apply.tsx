import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Send } from 'lucide-react'
import { ROUTES, newId, path, todayIso, useApp } from '../../lib/state'
import { isMinor, spotsLeftIn, validateApplication } from '../../lib/placements'
import type { ApplicationForm, Errors } from '../../lib/placements'
import { formatRange } from '../../lib/format'
import { Checkbox, Field, Select, TextArea, TextInput, described } from '../../components/form'
import { Button, Card } from '../../components/ui'
import { ExampleBadge } from '../../components/cards'

const EMPTY: ApplicationForm = {
  name: '', age: '', school: '', email: '', phone: '', dates: '', motivation: '', experience: '',
  guardianConsent: false, guardianContact: '', shareConsent: false,
}

/** Student application for one placement (guardian consent when under 18). */
export function Apply() {
  const { id = '' } = useParams()
  const { t, l, lang, role, placements, applications, companyOf, submitApplication, notify } = useApp()
  const navigate = useNavigate()
  const p = placements.find((x) => x.id === id)
  const upcoming = p ? p.dates.filter((d) => d.start >= todayIso() && spotsLeftIn(p, applications, d) > 0) : []
  const [form, setForm] = useState<ApplicationForm>({ ...EMPTY, dates: upcoming.length === 1 ? upcoming[0].start : '' })
  const [errors, setErrors] = useState<Errors>({})

  if (!p) return <Navigate to={ROUTES.board} replace />
  if (role !== 'student') return <Navigate to={path(ROUTES.placement, p.id)} replace />

  const company = companyOf(p)
  const set = (patch: Partial<ApplicationForm>) => setForm((f) => ({ ...f, ...patch }))
  const age = Number(form.age)
  const minor = Number.isInteger(age) && age >= 15 && isMinor(age)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validateApplication(form, p)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`apply-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    const range = p.dates.find((d) => d.start === form.dates) ?? p.dates[0]
    submitApplication({
      id: newId('app'),
      placementId: p.id,
      student: {
        name: form.name.trim(),
        age,
        school: form.school.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        guardianConsent: minor ? form.guardianConsent : undefined,
        guardianContact: minor ? form.guardianContact.trim() : undefined,
      },
      dates: range,
      motivation: form.motivation.trim(),
      experience: form.experience.trim() || undefined,
      status: 'applied',
      mine: true,
      isExample: false,
      createdAt: new Date().toISOString(),
    })
    notify(t.apply.sent)
    navigate(ROUTES.mine)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to={path(ROUTES.placement, p.id)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeft className="size-4" /> {l(p.title)}
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">{t.apply.title}</h1>
      <p className="mt-2 flex flex-wrap items-center gap-2 text-slate-600">
        {company?.name} · {l(p.title)} {p.isExample && <ExampleBadge />}
      </p>

      <form noValidate onSubmit={submit} className="mt-6 space-y-5">
        <Card className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <Field id="apply-name" label={t.apply.name} required error={errors.name} className="sm:col-span-2">
            <TextInput {...described('apply-name', errors.name)} autoComplete="name" value={form.name} onChange={(e) => set({ name: e.target.value })} error={errors.name} />
          </Field>
          <Field id="apply-age" label={t.apply.age} required error={errors.age}>
            <TextInput {...described('apply-age', errors.age)} type="number" inputMode="numeric" min={15} max={24} value={form.age} onChange={(e) => set({ age: e.target.value })} error={errors.age} />
          </Field>
          <Field id="apply-school" label={t.apply.school} required hint={t.apply.schoolHint} error={errors.school}>
            <TextInput {...described('apply-school', errors.school, t.apply.schoolHint)} value={form.school} onChange={(e) => set({ school: e.target.value })} error={errors.school} />
          </Field>
          <Field id="apply-email" label={t.apply.email} required error={errors.email}>
            <TextInput {...described('apply-email', errors.email)} type="email" autoComplete="email" value={form.email} onChange={(e) => set({ email: e.target.value })} error={errors.email} />
          </Field>
          <Field id="apply-phone" label={t.apply.phone}>
            <TextInput id="apply-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
          </Field>
          <Field id="apply-dates" label={t.apply.dates} required error={errors.dates} className="sm:col-span-2">
            <Select {...described('apply-dates', errors.dates)} value={form.dates} onChange={(e) => set({ dates: e.target.value })} error={errors.dates}>
              <option value="">—</option>
              {upcoming.map((d) => (
                <option key={d.start} value={d.start}>
                  {formatRange(d, lang)}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="apply-motivation" label={t.apply.motivation} required hint={t.apply.motivationHint} error={errors.motivation} className="sm:col-span-2">
            <TextArea {...described('apply-motivation', errors.motivation, t.apply.motivationHint)} value={form.motivation} onChange={(e) => set({ motivation: e.target.value })} error={errors.motivation} />
          </Field>
          <Field id="apply-experience" label={t.apply.experience} hint={t.apply.experienceHint} className="sm:col-span-2">
            <TextArea id="apply-experience" rows={2} value={form.experience} onChange={(e) => set({ experience: e.target.value })} />
          </Field>
        </Card>

        {minor && (
          <Card className="space-y-4 p-5 ring-amber-300 sm:p-6">
            <div>
              <h2 className="font-bold text-slate-900">{t.apply.guardianTitle}</h2>
              <p className="mt-1 text-sm text-slate-600">{t.apply.guardianText}</p>
            </div>
            <Checkbox id="apply-guardianConsent" checked={form.guardianConsent} onChange={(v) => set({ guardianConsent: v })} label={t.apply.guardianConsent} error={errors.guardianConsent} />
            <Field id="apply-guardianContact" label={t.apply.guardianContact} required error={errors.guardianContact}>
              <TextInput {...described('apply-guardianContact', errors.guardianContact)} value={form.guardianContact} onChange={(e) => set({ guardianContact: e.target.value })} error={errors.guardianContact} />
            </Field>
          </Card>
        )}

        <Checkbox id="apply-shareConsent" checked={form.shareConsent} onChange={(v) => set({ shareConsent: v })} label={t.apply.shareConsent} error={errors.shareConsent} />

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <Button type="submit" size="lg">
            <Send className="size-4" /> {t.apply.submit}
          </Button>
        </div>
      </form>
    </div>
  )
}
