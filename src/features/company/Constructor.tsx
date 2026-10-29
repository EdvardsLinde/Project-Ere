import { useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Building2, ClipboardList, Eye, Plus, Save, Send, ShieldCheck, Trash2, Truck, Upload, X } from 'lucide-react'
import { FIELDS } from '../../data'
import type { Company, Duration, Field as TaskField, Lang, Level, Localized, Placement, WorkLang } from '../../data'
import { ROUTES, newId, useApp } from '../../lib/state'
import { fitDayPlan, validateDraft } from '../../lib/placements'
import type { ErrorKey, Errors } from '../../lib/placements'
import { Checkbox, Field, Select, TextArea, TextInput, described } from '../../components/form'
import { Button, Card, cx } from '../../components/ui'
import { PlacementCard } from '../placements/PlacementCard'
import { NeedCompany } from './Dashboard'

const EMPTY_TEXT: Localized = { lv: '', en: '' }
const L = (lv: string, en: string): Localized => ({ lv, en })

/** Common skills a company can put on the passport (plus its own). */
const SKILL_SUGGESTIONS: Localized[] = [
  L('Datu tīrīšana', 'Data cleaning'),
  L('Datu vizualizācija', 'Data visualisation'),
  L('Datu analīze', 'Data analysis'),
  L('Sensoru datu apstrāde', 'Sensor data processing'),
  L('Kiberdrošības pamati', 'Cybersecurity basics'),
  L('Kvalitātes kontroles pamati', 'Quality control basics'),
  L('Ģeodatu analīze', 'Geodata analysis'),
  L('Digitālo rīku veidošana', 'Building digital tools'),
  L('Ražošanas procesu izpratne', 'Understanding production processes'),
  L('Komandas darbs', 'Teamwork'),
  L('Rezultātu prezentēšana', 'Presenting results'),
  L('Precizitāte', 'Accuracy'),
]

const SECTIONS = ['company', 'placement', 'requirements', 'logistics'] as const
type SectionId = (typeof SECTIONS)[number]
const SECTION_ICON = { company: Building2, placement: ClipboardList, requirements: ShieldCheck, logistics: Truck }
/** Which section each error key lives in (to jump there on publish). */
const ERROR_SECTION: Record<string, SectionId> = {
  companyName: 'company', address: 'company', industry: 'company', description: 'company', contactName: 'company', contactEmail: 'company', logo: 'company',
  title: 'placement', task: 'placement', deliverable: 'placement', passportSkills: 'placement',
  dates: 'logistics', spots: 'logistics', deadline: 'logistics', mentorName: 'logistics', mentorRole: 'logistics',
}

const blankCompany = (): Company => ({
  id: '', name: '', industry: EMPTY_TEXT, town: '', address: '', description: EMPTY_TEXT,
  contactName: '', contactEmail: '', isExample: false,
})

const blankPlacement = (companyId: string): Placement => ({
  id: '', companyId, title: EMPTY_TEXT, task: EMPTY_TEXT, field: 'sensors', tools: [],
  dayPlan: fitDayPlan([], 3, () => EMPTY_TEXT), deliverable: EMPTY_TEXT, passportSkills: [],
  prerequisites: EMPTY_TEXT, level: 'beginner', minAge: 15, languages: ['lv'], bring: EMPTY_TEXT,
  laptopNeeded: false, safety: EMPTY_TEXT, ppeProvided: true, safetyBriefing: true, dataNote: EMPTY_TEXT,
  dataKind: 'sample', nda: false, durationDays: 3, dates: [{ start: '', end: '' }], hours: '9:00–15:00',
  location: EMPTY_TEXT, transport: EMPTY_TEXT, lunch: false, stipend: 0, spots: 1, deadline: '',
  mentor: { name: '', role: EMPTY_TEXT }, status: 'draft', isExample: false, createdAt: '',
})

/**
 * Edit text in the current language. If both languages held the same text
 * (typed once), keep them in sync; otherwise only the current one changes.
 */
function setText(x: Localized, value: string, lang: Lang): Localized {
  const other: Lang = lang === 'lv' ? 'en' : 'lv'
  return x[other] === x[lang] || !x[other] ? { lv: value, en: value } : { ...x, [lang]: value }
}

const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** /company/new and /company/edit/:id — the placement builder with a live preview. */
export function Constructor() {
  const { id } = useParams()
  const { t, l, lang, role, company, companyId, placements, saveCompany, savePlacement, chooseRole, notify } = useApp()
  const navigate = useNavigate()
  const existing = id ? placements.find((p) => p.id === id && p.companyId === companyId) : undefined
  const [co, setCo] = useState<Company>(() => company ?? blankCompany())
  const [pl, setPl] = useState<Placement>(() => existing ?? blankPlacement(companyId ?? ''))
  const [tools, setTools] = useState(() => pl.tools.join(', '))
  const [customSkill, setCustomSkill] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [step, setStep] = useState(0)

  if (role !== 'company') return <NeedCompany />

  const err = (key: string): ErrorKey | undefined => errors[key]
  const setP = (patch: Partial<Placement>) => setPl((x) => ({ ...x, ...patch }))
  const setC = (patch: Partial<Company>) => setCo((x) => ({ ...x, ...patch }))
  const text = (x: Localized) => l(x)
  const parsedTools = tools.split(',').map((s) => s.trim()).filter(Boolean)
  const preview: Placement = { ...pl, tools: parsedTools, createdAt: pl.createdAt || new Date().toISOString() }

  const onLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 300 * 1024) {
      setErrors((x) => ({ ...x, logo: 'logo' }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setC({ logoDataUrl: String(reader.result) })
      setErrors((x) => ({ ...x, logo: undefined }))
    }
    reader.readAsDataURL(file)
  }

  const setDuration = (d: Duration) =>
    setP({
      durationDays: d,
      dayPlan: fitDayPlan(pl.dayPlan, d, () => EMPTY_TEXT),
      dates: pl.dates.map((r) => (r.start ? { start: r.start, end: addDays(r.start, d - 1) } : r)),
    })

  const toggleSkill = (s: Localized) =>
    setP({
      passportSkills: pl.passportSkills.some((x) => x.lv === s.lv)
        ? pl.passportSkills.filter((x) => x.lv !== s.lv)
        : pl.passportSkills.length < 5
          ? [...pl.passportSkills, s]
          : pl.passportSkills,
    })

  const save = (status: Placement['status']) => {
    const draft = { company: co, placement: { ...pl, tools: parsedTools } }
    const errs: Errors =
      status === 'published'
        ? validateDraft(draft)
        : { ...(co.name.trim() ? {} : { companyName: 'required' as const }), ...((pl.title.lv || pl.title.en).trim() ? {} : { title: 'required' as const }) }
    setErrors(errs)
    const first = Object.keys(errs).find((k) => errs[k])
    if (first) {
      notify(t.form.fixErrors)
      setStep(SECTIONS.indexOf(ERROR_SECTION[first] ?? 'company'))
      window.setTimeout(() => document.getElementById(`f-${first}`)?.focus(), 50)
      return
    }
    const cid = co.id || newId('co')
    saveCompany({ ...co, id: cid, town: co.town.trim() || co.address.split(',').pop()?.trim() || '' })
    if (cid !== companyId) chooseRole('company', cid)
    savePlacement({
      ...pl,
      id: pl.id || newId('pl'),
      companyId: cid,
      tools: parsedTools,
      dates: pl.dates.filter((d) => d.start && d.end),
      status,
      createdAt: pl.createdAt || new Date().toISOString(),
    })
    notify(status === 'published' ? t.form.published : t.form.savedDraft)
    navigate(ROUTES.company)
  }

  const section = (i: number) => cx('scroll-mt-24 space-y-4 p-5 sm:p-6', step !== i && 'max-lg:hidden')
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{existing ? t.form.editTitle : t.form.newTitle}</h1>
      <p className="mt-2 text-slate-600">{t.form.intro}</p>

      {/* Desktop: section index */}
      <nav aria-label={t.form.intro} className="sticky top-16 z-20 -mx-4 mt-5 hidden bg-slate-50/90 px-4 py-2 backdrop-blur lg:block">
        <ul className="flex gap-2">
          {SECTIONS.map((s, i) => {
            const Icon = SECTION_ICON[s]
            const bad = Object.entries(errors).some(([k, v]) => v && ERROR_SECTION[k] === s)
            return (
              <li key={s}>
                <a href={`#sec-${s}`} onClick={(e) => (e.preventDefault(), document.getElementById(`sec-${s}`)?.scrollIntoView({ behavior: 'smooth' }), setStep(i))} className={cx('inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold ring-1', bad ? 'bg-red-50 text-red-700 ring-red-400' : 'bg-card text-slate-700 ring-slate-300 hover:ring-slate-400')}>
                  <Icon className="size-4" /> {String.fromCharCode(65 + i)}. {t.form.sections[s]}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Phones: step dots */}
      <ol className="mt-5 flex gap-1.5 lg:hidden" aria-label={t.form.step(step + 1, SECTIONS.length)}>
        {SECTIONS.map((s, i) => (
          <li key={s} className={cx('h-1.5 flex-1 rounded-full', i <= step ? 'bg-brand-600' : 'bg-slate-200')} />
        ))}
      </ol>

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form noValidate onSubmit={(e) => e.preventDefault()} className="min-w-0 space-y-5">
          {/* A. Company */}
          <Card className={section(0)}>
            <div id="sec-company" className="scroll-mt-32" />
            <Title i={0} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <T errors={errors} k="companyName" label={t.form.companyName} required value={co.name} onChange={(name) => setC({ name })} className="sm:col-span-2" />
              <T errors={errors} k="industry" label={t.form.industry} required value={text(co.industry)} onChange={(v) => setC({ industry: setText(co.industry, v, lang) })} />
              <T errors={errors} k="regNumber" label={t.form.regNumber} value={co.regNumber ?? ''} onChange={(regNumber) => setC({ regNumber })} />
              <T errors={errors} k="address" label={t.form.address} required hint={t.form.addressHint} value={co.address} onChange={(address) => setC({ address })} />
              <T errors={errors} k="town" label={t.form.town} value={co.town} onChange={(town) => setC({ town })} />
              <T errors={errors} k="description" label={t.form.description} required area value={text(co.description)} onChange={(v) => setC({ description: setText(co.description, v.slice(0, 400), lang) })} hint={`${text(co.description).length}/400`} className="sm:col-span-2" />
              <T errors={errors} k="website" label={t.form.website} type="url" value={co.website ?? ''} onChange={(website) => setC({ website })} />
              <Field id="f-logo" label={t.form.logo} hint={t.form.logoHint} error={err('logo')}>
                <div className="flex items-center gap-3">
                  {co.logoDataUrl && <img src={co.logoDataUrl} alt="" className="size-10 rounded-lg bg-white object-contain p-1 ring-1 ring-slate-200" />}
                  <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50">
                    <Upload className="size-4" /> {t.form.logo}
                    <input id="f-logo" type="file" accept="image/png,image/jpeg" onChange={onLogo} className="sr-only" />
                  </label>
                  {co.logoDataUrl && (
                    <button type="button" onClick={() => setC({ logoDataUrl: undefined })} aria-label={t.form.logoRemove} className="cursor-pointer rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </Field>
              <T errors={errors} k="contactName" label={t.form.contactName} required value={co.contactName} onChange={(contactName) => setC({ contactName })} />
              <T errors={errors} k="contactEmail" label={t.form.contactEmail} required type="email" value={co.contactEmail} onChange={(contactEmail) => setC({ contactEmail })} />
              <T errors={errors} k="phone" label={t.form.phone} type="tel" value={co.phone ?? ''} onChange={(phone) => setC({ phone })} />
            </div>
          </Card>

          {/* B. Placement */}
          <Card className={section(1)}>
            <div id="sec-placement" className="scroll-mt-32" />
            <Title i={1} />
            <T errors={errors} k="title" label={t.form.title} required value={text(pl.title)} onChange={(v) => setP({ title: setText(pl.title, v, lang) })} />
            <T errors={errors} k="task" label={t.form.task} required area value={text(pl.task)} onChange={(v) => setP({ task: setText(pl.task, v, lang) })} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="f-field" label={t.form.field} required>
                <Select id="f-field" value={pl.field} onChange={(e) => setP({ field: e.target.value as TaskField })}>
                  {FIELDS.map((f) => (
                    <option key={f} value={f}>
                      {t.fields[f]}
                    </option>
                  ))}
                </Select>
              </Field>
              <T errors={errors} k="tools" label={t.form.tools} hint={t.form.toolsHint} value={tools} onChange={setTools} />
            </div>
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-slate-800">{t.form.dayPlan}</legend>
              <div className="space-y-2">
                {pl.dayPlan.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-20 shrink-0 text-sm font-semibold text-slate-600">{t.common.day(i + 1)}</span>
                    <TextInput aria-label={t.common.day(i + 1)} value={text(d)} onChange={(e) => setP({ dayPlan: pl.dayPlan.map((x, j) => (j === i ? setText(x, e.target.value, lang) : x)) })} />
                  </div>
                ))}
              </div>
            </fieldset>
            <T errors={errors} k="deliverable" label={t.form.deliverable} required area rows={2} value={text(pl.deliverable)} onChange={(v) => setP({ deliverable: setText(pl.deliverable, v, lang) })} />
            <Field id="f-passportSkills" label={`${t.form.passportSkills} · ${pl.passportSkills.length}/5`} required hint={t.form.passportSkillsHint} error={err('passportSkills')}>
              <div id="f-passportSkills" tabIndex={-1} className="flex flex-wrap gap-2 outline-none">
                {[...SKILL_SUGGESTIONS, ...pl.passportSkills.filter((s) => !SKILL_SUGGESTIONS.some((x) => x.lv === s.lv))].map((s) => {
                  const on = pl.passportSkills.some((x) => x.lv === s.lv)
                  return (
                    <button key={s.lv} type="button" aria-pressed={on} onClick={() => toggleSkill(s)} className={cx('inline-flex min-h-9 cursor-pointer items-center rounded-full px-3 text-sm font-medium ring-1 transition', on ? 'bg-brand-600 text-white ring-brand-600' : 'bg-card text-slate-700 ring-slate-300 hover:ring-brand-300')}>
                      {l(s)}
                    </button>
                  )
                })}
              </div>
              <div className="mt-2 flex gap-2">
                <TextInput aria-label={t.form.customSkill} placeholder={t.form.customSkill} value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} />
                <Button
                  variant="secondary"
                  disabled={!customSkill.trim() || pl.passportSkills.length >= 5}
                  onClick={() => {
                    toggleSkill({ lv: customSkill.trim(), en: customSkill.trim() })
                    setCustomSkill('')
                  }}
                >
                  <Plus className="size-4" /> {t.form.addSkill}
                </Button>
              </div>
            </Field>
          </Card>

          {/* C. Requirements */}
          <Card className={section(2)}>
            <div id="sec-requirements" className="scroll-mt-32" />
            <Title i={2} />
            <T errors={errors} k="prerequisites" label={t.form.prerequisites} area rows={2} value={text(pl.prerequisites)} onChange={(v) => setP({ prerequisites: setText(pl.prerequisites, v, lang) })} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="f-level" label={t.form.level} required>
                <Select id="f-level" value={pl.level} onChange={(e) => setP({ level: e.target.value as Level })}>
                  {(['beginner', 'some'] as Level[]).map((x) => (
                    <option key={x} value={x}>
                      {t.levels[x]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field id="f-minAge" label={t.form.minAge} required>
                <Select id="f-minAge" value={pl.minAge} onChange={(e) => setP({ minAge: Number(e.target.value) })}>
                  {Array.from({ length: 10 }, (_, i) => 15 + i).map((a) => (
                    <option key={a} value={a}>
                      {a}+
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-slate-800">{t.form.languages}</legend>
              <div className="flex flex-wrap gap-4">
                {(['lv', 'en', 'ru'] as WorkLang[]).map((x) => (
                  <Checkbox key={x} id={`f-lang-${x}`} checked={pl.languages.includes(x)} label={t.workLangs[x]} onChange={(on) => setP({ languages: on ? [...pl.languages, x] : pl.languages.filter((y) => y !== x) })} />
                ))}
              </div>
            </fieldset>
            <T errors={errors} k="bring" label={t.form.bring} value={text(pl.bring)} onChange={(v) => setP({ bring: setText(pl.bring, v, lang) })} />
            <Checkbox id="f-laptop" checked={!!pl.laptopNeeded} onChange={(laptopNeeded) => setP({ laptopNeeded })} label={t.form.laptop} />
            <SubTitle>{t.form.safety}</SubTitle>
            <Checkbox id="f-ppe" checked={!!pl.ppeProvided} onChange={(ppeProvided) => setP({ ppeProvided })} label={t.form.ppe} />
            <Checkbox id="f-briefing" checked={!!pl.safetyBriefing} onChange={(safetyBriefing) => setP({ safetyBriefing })} label={t.form.briefing} />
            <T errors={errors} k="safety" label={t.form.restricted} area rows={2} value={text(pl.safety)} onChange={(v) => setP({ safety: setText(pl.safety, v, lang) })} />
            <SubTitle>{t.detail.data}</SubTitle>
            <Field id="f-dataKind" label={t.form.dataKind}>
              <Select id="f-dataKind" value={pl.dataKind ?? 'sample'} onChange={(e) => setP({ dataKind: e.target.value as Placement['dataKind'] })}>
                {(['sample', 'anonymised', 'real'] as const).map((x) => (
                  <option key={x} value={x}>
                    {t.form.dataKinds[x]}
                  </option>
                ))}
              </Select>
            </Field>
            <Checkbox id="f-nda" checked={!!pl.nda} onChange={(nda) => setP({ nda })} label={t.form.nda} />
            <T errors={errors} k="dataNote" label={t.detail.data} area rows={2} value={text(pl.dataNote)} onChange={(v) => setP({ dataNote: setText(pl.dataNote, v, lang) })} />
          </Card>

          {/* D. Logistics */}
          <Card className={section(3)}>
            <div id="sec-logistics" className="scroll-mt-32" />
            <Title i={3} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="f-duration" label={t.form.duration} required>
                <Select id="f-duration" value={pl.durationDays} onChange={(e) => setDuration(Number(e.target.value) as Duration)}>
                  {([3, 4, 5] as Duration[]).map((d) => (
                    <option key={d} value={d}>
                      {t.common.days(d)}
                    </option>
                  ))}
                </Select>
              </Field>
              <T errors={errors} k="hours" label={t.form.hours} value={pl.hours} onChange={(hours) => setP({ hours })} />
            </div>
            <Field id="f-dates" label={t.form.dates} required error={err('dates')}>
              <div id="f-dates" tabIndex={-1} className="space-y-2 outline-none">
                {pl.dates.map((d, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <TextInput type="date" aria-label={t.form.from} value={d.start} className="w-auto flex-1" onChange={(e) => setP({ dates: pl.dates.map((x, j) => (j === i ? { start: e.target.value, end: !x.end || x.end < e.target.value ? addDays(e.target.value, pl.durationDays - 1) : x.end } : x)) })} />
                    <span className="text-slate-500">–</span>
                    <TextInput type="date" aria-label={t.form.to} value={d.end} className="w-auto flex-1" onChange={(e) => setP({ dates: pl.dates.map((x, j) => (j === i ? { ...x, end: e.target.value } : x)) })} />
                    {pl.dates.length > 1 && (
                      <button type="button" onClick={() => setP({ dates: pl.dates.filter((_, j) => j !== i) })} aria-label={t.form.removeDates} className="cursor-pointer rounded-md p-2 text-slate-500 hover:bg-slate-100">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" onClick={() => setP({ dates: [...pl.dates, { start: '', end: '' }] })}>
                  <Plus className="size-4" /> {t.form.addDates}
                </Button>
              </div>
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <T errors={errors} k="deadline" label={t.form.deadline} required type="date" value={pl.deadline} onChange={(deadline) => setP({ deadline })} />
              <T errors={errors} k="spots" label={t.form.spots} required type="number" value={String(pl.spots)} onChange={(v) => setP({ spots: Number(v) })} />
              <T errors={errors} k="location" label={t.form.location} value={text(pl.location)} onChange={(v) => setP({ location: setText(pl.location, v, lang) })} />
              <T errors={errors} k="transport" label={t.form.transport} value={text(pl.transport)} onChange={(v) => setP({ transport: setText(pl.transport, v, lang) })} />
              <T errors={errors} k="stipend" label={t.form.stipend} type="number" value={String(pl.stipend ?? 0)} onChange={(v) => setP({ stipend: Math.max(0, Number(v) || 0) })} />
              <div className="flex items-end pb-2">
                <Checkbox id="f-lunch" checked={pl.lunch} onChange={(lunch) => setP({ lunch })} label={t.form.lunch} />
              </div>
              <T errors={errors} k="mentorName" label={t.form.mentorName} required value={pl.mentor.name} onChange={(name) => setP({ mentor: { ...pl.mentor, name } })} />
              <T errors={errors} k="mentorRole" label={t.form.mentorRole} required value={text(pl.mentor.role)} onChange={(v) => setP({ mentor: { ...pl.mentor, role: setText(pl.mentor.role, v, lang) } })} />
              <T errors={errors} k="backupContact" label={t.form.backupContact} value={pl.backupContact ?? ''} onChange={(backupContact) => setP({ backupContact })} className="sm:col-span-2" />
            </div>
          </Card>

          {/* Actions: wizard buttons on phones, save/publish always available on desktop and on the last step */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <div className="flex gap-2 lg:hidden">
              {step > 0 && (
                <Button variant="secondary" onClick={() => setStep(step - 1)}>
                  {t.form.prev}
                </Button>
              )}
              {step < SECTIONS.length - 1 && <Button onClick={() => (setStep(step + 1), window.scrollTo({ top: 0 }))}>{t.form.next}</Button>}
            </div>
            <div className={cx('ml-auto flex flex-wrap gap-2', step < SECTIONS.length - 1 && 'max-lg:hidden')}>
              <Button variant="secondary" onClick={() => save('draft')}>
                <Save className="size-4" /> {t.form.saveDraft}
              </Button>
              <Button onClick={() => save('published')}>
                <Send className="size-4" /> {t.form.publish}
              </Button>
            </div>
          </div>
        </form>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-600">
            <Eye className="size-4" /> {t.form.preview}
          </p>
          <PlacementCard placement={preview} company={co.name ? co : undefined} preview />
          <p className="mt-2 text-xs text-slate-500">{t.form.previewHint}</p>
        </aside>
      </div>
    </>
  )
}

/** Section heading: icon tile, "A. Uzņēmums", and "Step 1 of 4" on phones. */
function Title({ i }: { i: number }) {
  const { t } = useApp()
  const Icon = SECTION_ICON[SECTIONS[i]]
  return (
    <h2 className="flex items-center gap-3 text-lg font-bold text-slate-900">
      <span className="flex size-9 items-center justify-center rounded-xl bg-accent-500 text-on-accent">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block text-xs font-semibold text-slate-500 lg:hidden">{t.form.step(i + 1, SECTIONS.length)}</span>
        {String.fromCharCode(65 + i)}. {t.form.sections[SECTIONS[i]]}
      </span>
    </h2>
  )
}

/** Labelled text input / textarea wired to the builder's error map. */
function T(props: {
  errors: Errors
  k: string
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  hint?: string
  type?: string
  className?: string
  area?: boolean
  rows?: number
}) {
  const id = `f-${props.k}`
  const error = props.errors[props.k]
  return (
    <Field id={id} label={props.label} required={props.required} hint={props.hint} error={error} className={props.className}>
      {props.area ? (
        <TextArea {...described(id, error, props.hint)} rows={props.rows ?? 3} value={props.value} onChange={(e) => props.onChange(e.target.value)} error={error} />
      ) : (
        <TextInput {...described(id, error, props.hint)} type={props.type ?? 'text'} value={props.value} onChange={(e) => props.onChange(e.target.value)} error={error} />
      )}
    </Field>
  )
}

function SubTitle({ children }: { children: ReactNode }) {
  return <h3 className="border-t border-slate-200 pt-4 text-sm font-bold text-slate-900">{children}</h3>
}
