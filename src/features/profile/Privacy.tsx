import { useState } from 'react'
import { Eye, HardDrive, MessageSquareOff, ShieldCheck, Trash2, UserRound } from 'lucide-react'
import { useApp } from '../../lib/state'
import { Button, Card, PageHeader } from '../../components/ui'

const ICONS = [UserRound, HardDrive, Eye, MessageSquareOff]

/** Plain-language privacy page with a "delete my data" button. */
export function Privacy() {
  const { t, restart } = useApp()
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader icon={ShieldCheck} eyebrow={t.privacy.eyebrow} title={t.privacy.title} subtitle={t.privacy.intro} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {t.privacy.items.map((item, i) => {
          const Icon = ICONS[i]
          return (
            <Card key={item.title} className="flex gap-3 p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block font-semibold text-slate-900">{item.title}</span>
                <span className="mt-0.5 block text-sm text-slate-600">{item.text}</span>
              </span>
            </Card>
          )
        })}
      </div>

      <Card className="mt-5 p-4 ring-red-200">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <Trash2 className="size-5 text-red-600" /> {t.privacy.deleteTitle}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{t.privacy.deleteText}</p>
        {confirming ? (
          <div className="mt-4 rounded-xl bg-red-50 p-3 ring-1 ring-red-200">
            <p className="text-sm font-semibold text-red-700">{t.privacy.confirm}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button className="bg-red-600 hover:bg-red-700 active:bg-red-700" onClick={restart}>
                {t.privacy.confirmYes}
              </Button>
              <Button variant="secondary" onClick={() => setConfirming(false)}>
                {t.privacy.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" className="mt-4" onClick={() => setConfirming(true)}>
            <Trash2 className="size-4" /> {t.privacy.deleteButton}
          </Button>
        )}
      </Card>
      <p className="mt-4 text-xs text-slate-500">{t.privacy.prototypeNote}</p>
    </div>
  )
}
