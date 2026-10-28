import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CircleCheck, Lock, Trash2 } from 'lucide-react'
import { ROUTES, useApp } from '../../lib/state'
import { Button, Card, PageHeader } from '../../components/ui'

/** What is stored, and "delete everything" with an in-page confirmation. */
export function Privacy() {
  const { t, resetAll, notify } = useApp()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  return (
    <>
      <PageHeader icon={Lock} eyebrow={t.nav.privacy} title={t.privacy.title} subtitle={t.privacy.intro} />
      <div className="mx-auto max-w-2xl space-y-6">
        <ul className="space-y-3">
          {t.privacy.items.map((x) => (
            <li key={x} className="flex gap-3 text-slate-700">
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-accent-600" /> {x}
            </li>
          ))}
        </ul>
        <Card className="p-5 sm:p-6">
          <h2 className="font-bold text-slate-900">{t.privacy.deleteTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">{t.privacy.deleteText}</p>
          {confirming ? (
            <div className="mt-4 rounded-xl bg-red-50 p-4 ring-1 ring-red-400/40">
              <p className="font-semibold text-slate-900">{t.privacy.confirm}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-red-700 px-3.5 text-sm font-semibold text-white hover:bg-red-600"
                  onClick={() => {
                    resetAll()
                    setConfirming(false)
                    notify(t.privacy.deleted)
                    navigate(ROUTES.landing)
                  }}
                >
                  <Trash2 className="size-4" /> {t.privacy.confirmYes}
                </button>
                <Button variant="secondary" onClick={() => setConfirming(false)}>
                  {t.common.cancel}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="secondary" className="mt-4" onClick={() => setConfirming(true)}>
              <Trash2 className="size-4" /> {t.privacy.deleteButton}
            </Button>
          )}
        </Card>
        <p className="text-sm text-slate-500">{t.privacy.prototype}</p>
      </div>
    </>
  )
}
