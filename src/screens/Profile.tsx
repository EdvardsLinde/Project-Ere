import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { ArrowRight, Briefcase, Heart, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { EXPERIENCE_TYPES, INTERESTS, MOTIVATION_TAGS, SKILLS } from '../data'
import { toggle, useApp } from '../state'
import { ActionBar, Button, Card, Chip, Label, PageHeader, cx, inputClass } from '../components/ui'

function Section({
  index,
  icon,
  title,
  help,
  children,
}: {
  index: number
  icon: ReactNode
  title: string
  help: string
  children: ReactNode
}) {
  return (
    <Card className="p-5 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
          {icon}
        </span>
        <div>
          <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">0{index}</p>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{help}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </Card>
  )
}

export function Profile() {
  const { t, l, profile, update, next, editing } = useApp()
  const [customSkill, setCustomSkill] = useState('')
  const [expType, setExpType] = useState(EXPERIENCE_TYPES[0].id)
  const [expTitle, setExpTitle] = useState('')
  const [expDesc, setExpDesc] = useState('')

  const addSkill = (e: FormEvent) => {
    e.preventDefault()
    const s = customSkill.trim()
    if (s && !profile.customSkills.some((x) => x.toLowerCase() === s.toLowerCase())) {
      update({ customSkills: [...profile.customSkills, s] })
    }
    setCustomSkill('')
  }

  const addExperience = (e: FormEvent) => {
    e.preventDefault()
    if (!expTitle.trim()) return
    update({
      experiences: [
        ...profile.experiences,
        { id: Date.now(), type: expType, title: expTitle.trim(), description: expDesc.trim() },
      ],
    })
    setExpTitle('')
    setExpDesc('')
  }

  // Rough completeness score for the live preview — motivates filling in more.
  const checks = [
    profile.interests.length > 0,
    profile.skills.length + profile.customSkills.length > 0,
    profile.motivationText.trim().length > 0 || profile.motivationTags.length > 0,
    profile.experiences.length > 0,
  ]
  const completeness = Math.round(((1 + checks.filter(Boolean).length) / (1 + checks.length)) * 100)
  const skillLabels = [
    ...SKILLS.filter((s) => profile.skills.includes(s.id)).map((s) => l(s.label)),
    ...profile.customSkills,
  ]

  return (
    <>
      <PageHeader eyebrow={t.profile.eyebrow} title={t.profile.title} subtitle={t.profile.subtitle} />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="space-y-6">
          {/* 01 — Skills */}
          <Section index={1} icon={<Sparkles className="size-5" />} title={t.profile.skillsTitle} help={t.profile.skillsHelp}>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <Chip
                  key={s.id}
                  selected={profile.skills.includes(s.id)}
                  onClick={() => update({ skills: toggle(profile.skills, s.id) })}
                >
                  {l(s.label)}
                </Chip>
              ))}
              {profile.customSkills.map((s) => (
                <span
                  key={s}
                  className="inline-flex min-h-11 items-center gap-1 rounded-full bg-accent-500 py-1 pr-1.5 pl-4 text-sm font-medium text-white"
                >
                  {s}
                  <button
                    type="button"
                    aria-label={`${t.common.remove}: ${s}`}
                    onClick={() => update({ customSkills: profile.customSkills.filter((x) => x !== s) })}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full hover:bg-white/20"
                  >
                    <X className="size-4" />
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={addSkill} className="mt-4 flex gap-2">
              <input
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder={t.profile.addSkillPlaceholder}
                aria-label={t.profile.addSkillPlaceholder}
                className={inputClass}
              />
              <Button type="submit" variant="secondary" disabled={!customSkill.trim()} className="h-auto">
                <Plus className="size-4" /> <span className="hidden sm:inline">{t.profile.add}</span>
              </Button>
            </form>
          </Section>

          {/* 02 — Motivation */}
          <Section
            index={2}
            icon={<Heart className="size-5" />}
            title={t.profile.motivationTitle}
            help={t.profile.motivationQuestion}
          >
            <textarea
              id="motivation"
              aria-label={t.profile.motivationQuestion}
              rows={3}
              value={profile.motivationText}
              onChange={(e) => update({ motivationText: e.target.value })}
              placeholder={t.profile.motivationPlaceholder}
              className={cx(inputClass, 'resize-y')}
            />
            <p className="mt-5 mb-2.5 text-sm font-medium text-slate-800">{t.profile.motivationTagsLabel}</p>
            <div className="flex flex-wrap gap-2">
              {MOTIVATION_TAGS.map((m) => (
                <Chip
                  key={m.id}
                  selected={profile.motivationTags.includes(m.id)}
                  onClick={() => update({ motivationTags: toggle(profile.motivationTags, m.id) })}
                >
                  {l(m.label)}
                </Chip>
              ))}
            </div>
          </Section>

          {/* 03 — Experience */}
          <Section
            index={3}
            icon={<Briefcase className="size-5" />}
            title={t.profile.experienceTitle}
            help={t.profile.experienceHelp}
          >
            {profile.experiences.length > 0 ? (
              <ul className="mb-6 space-y-3">
                {profile.experiences.map((x) => {
                  const type = EXPERIENCE_TYPES.find((e) => e.id === x.type)
                  return (
                    <li
                      key={x.id}
                      className="animate-fade-up flex items-start gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
                    >
                      <div className="min-w-0 flex-1">
                        {type && (
                          <span className="mb-1.5 inline-block rounded-md bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-700 ring-1 ring-accent-200">
                            {l(type.label)}
                          </span>
                        )}
                        <p className="font-semibold text-slate-900">{x.title}</p>
                        {x.description && <p className="mt-0.5 text-sm text-slate-600">{x.description}</p>}
                      </div>
                      <button
                        type="button"
                        aria-label={`${t.common.remove}: ${x.title}`}
                        onClick={() => update({ experiences: profile.experiences.filter((e) => e.id !== x.id) })}
                        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="mb-6 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                {t.profile.noExperience}
              </p>
            )}

            <form onSubmit={addExperience} className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-800">{t.profile.expType}</p>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_TYPES.map((e) => (
                    <Chip key={e.id} selected={expType === e.id} onClick={() => setExpType(e.id)}>
                      {l(e.label)}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="exp-title">{t.profile.expTitleLabel}</Label>
                <input
                  id="exp-title"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  placeholder={t.profile.expTitlePlaceholder}
                  className={inputClass}
                />
              </div>
              <div>
                <Label htmlFor="exp-desc" optional={t.common.optional}>
                  {t.profile.expDescLabel}
                </Label>
                <textarea
                  id="exp-desc"
                  rows={2}
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder={t.profile.expDescPlaceholder}
                  className={cx(inputClass, 'resize-y')}
                />
              </div>
              <Button type="submit" variant="secondary" disabled={!expTitle.trim()}>
                <Plus className="size-4" /> {t.profile.addExperience}
              </Button>
            </form>
          </Section>
        </div>

        {/* Live profile preview — sticky sidebar on desktop */}
        <aside className="lg:sticky lg:top-24">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-brand-600 to-accent-500 p-5 text-white">
              <p className="text-xs font-semibold tracking-wide text-white/75 uppercase">{t.profile.previewTitle}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold ring-2 ring-white/40">
                  {profile.name.charAt(0).toUpperCase() || '?'}
                </span>
                <p className="text-lg font-bold">{profile.name || '—'}</p>
              </div>
            </div>
            <div className="space-y-5 p-5">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{t.profile.completeness}</span>
                  <span className="font-bold text-brand-700">{completeness}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 transition-all duration-500"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>
              <PreviewRow label={t.profile.previewInterests} empty={t.profile.previewEmpty}>
                {INTERESTS.filter((i) => profile.interests.includes(i.id)).map((i) => l(i.label))}
              </PreviewRow>
              <PreviewRow label={t.profile.previewSkills} empty={t.profile.previewEmpty}>
                {skillLabels}
              </PreviewRow>
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{t.profile.previewExperience}</p>
                <p className="mt-1.5 text-sm text-slate-700">
                  {profile.experiences.length ? t.profile.entries(profile.experiences.length) : t.profile.previewEmpty}
                </p>
              </div>
            </div>
          </Card>
        </aside>
      </div>

      <ActionBar>
        <Button size="lg" onClick={() => next()}>
          {editing ? t.common.save : t.common.next} <ArrowRight className="size-5" />
        </Button>
      </ActionBar>
    </>
  )
}

function PreviewRow({ label, empty, children }: { label: string; empty: string; children: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{label}</p>
      {children.length ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {children.map((c) => (
            <span key={c} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
              {c}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1.5 text-sm text-slate-400">{empty}</p>
      )}
    </div>
  )
}
