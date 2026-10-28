import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Check, Copy } from 'lucide-react'
import { ROUTES, useApp } from '../../lib/state'
import { Button } from '../../components/ui'
import { ExampleBadge } from '../../components/cards'
import { PassportCard, usePassport } from './PassportCard'

/** /passport/:id — read-only certificate anyone with the link can open. */
export function PassportPage() {
  const { id = '' } = useParams()
  const { t, role, notify } = useApp()
  const data = usePassport(id)
  const [fallback, setFallback] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!data)
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-slate-600">{t.passport.notFound}</p>
        <Link to={ROUTES.landing} className="mt-4 inline-flex font-semibold text-brand-700 hover:underline">
          ← {t.nav.idea}
        </Link>
      </div>
    )

  const link = window.location.href
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      notify(t.passport.copied)
    } catch {
      setFallback(true)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link to={role === 'student' ? ROUTES.myPassport : role === 'company' ? ROUTES.allApplications : ROUTES.landing} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
          <ArrowLeft className="size-4" /> {t.common.back}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {data.passport.isExample && <ExampleBadge withNote />}
          <Button variant="secondary" onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {t.passport.copyLink}
          </Button>
        </div>
      </div>
      {fallback && (
        <div className="mb-4 rounded-xl bg-card p-3 ring-1 ring-slate-200 print:hidden">
          <label htmlFor="passport-link" className="text-sm font-medium text-slate-700">
            {t.passport.copyFallback}
          </label>
          <input id="passport-link" readOnly value={link} onFocus={(e) => e.currentTarget.select()} autoFocus className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 ring-1 ring-slate-300" />
        </div>
      )}
      <PassportCard data={data} />
    </div>
  )
}
