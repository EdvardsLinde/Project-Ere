import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, CalendarDays, Check, Clock, Info, MapPin, Newspaper, Star } from 'lucide-react'
import { NEWS } from '../../data'
import { toggle, useApp } from '../../lib/state'
import { Button } from '../../components/ui'
import { ExampleBadge } from '../../components/cards'
import { Cover, Kicker, LatestList, MostRead, NewsCard, SectionTitle, isDated, mostRead, published, sectionOf, sectionPath } from './NewsItem'

/** One news story / event as a full article page (/news/:id). */
export function Article() {
  const { t, l, lang, articleId, profile, update } = useApp()
  const item = NEWS.find((n) => n.id === articleId)

  if (!item)
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-slate-600">{t.news.notFound}</p>
        <Link to="/news" className="mt-4 inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline">
          <ArrowLeft className="size-4" /> {t.news.backToNews}
        </Link>
      </div>
    )

  const section = sectionOf(item)
  const dated = isDated(item)
  const saved = profile.savedNews.includes(item.id)
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang === 'lv' ? 'lv-LV' : 'en-GB', o).format(new Date(item.date))
  const author = item.author ?? t.news.editors
  const body = item.body ?? (item.details ? [item.details] : [])
  const related = NEWS.filter((n) => n.id !== item.id && sectionOf(n) === section)
    .concat(published().filter((n) => n.id !== item.id && sectionOf(n) !== section))
    .slice(0, 3)
  const interest = (
    <Button
      variant={saved ? 'secondary' : 'primary'}
      aria-pressed={saved}
      onClick={() => update({ savedNews: toggle(profile.savedNews, item.id) })}
    >
      {saved ? <Check className="size-4" strokeWidth={2.5} /> : <Star className="size-4" />}
      {saved ? t.news.interestedDone : t.news.interested}
    </Button>
  )

  return (
    <>
      <nav aria-label={t.common.breadcrumb} className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        <Link to="/news" className="font-semibold text-slate-700 hover:text-brand-700 hover:underline">
          {t.news.masthead}
        </Link>
        <span aria-hidden>›</span>
        <Link to={sectionPath(section)} className="hover:text-brand-700 hover:underline">
          {section === 'all' ? t.news.kinds[item.kind] : t.news.sections[section]}
        </Link>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <article className="min-w-0 lg:col-span-8">
          <Kicker item={item} />
          <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight text-balance text-slate-900 sm:text-[2.75rem]">
            {l(item.title)}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 sm:text-xl">{l(item.summary)}</p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 py-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-800">
                {author.charAt(0)}
              </span>
              <div className="text-sm">
                <p className="font-semibold text-slate-900">
                  {t.news.by}: {author}
                </p>
                <p className="text-slate-500">
                  {dated ? t.news.kinds[item.kind] : fmt({ day: 'numeric', month: 'long', year: 'numeric' })}
                  {!dated && item.at && `, ${item.at}`}
                  {item.readMin && ` · ${t.news.readMin(item.readMin)}`}
                </p>
              </div>
            </div>
            <ExampleBadge />
          </div>

          <figure className="mt-6">
            <Cover item={item} scale="xl" className="aspect-[16/9] w-full rounded-2xl" />
            <figcaption className="mt-2 text-xs text-slate-500">
              {item.photo ? (
                <>
                  {t.news.photo}:{' '}
                  <a href={item.photo.url} target="_blank" rel="noreferrer" className="underline hover:text-brand-700">
                    {item.photo.credit}
                  </a>{' '}
                  · {t.news.photoNote}
                </>
              ) : (
                `${t.news.illustration} · ${t.example.badge}`
              )}
            </figcaption>
          </figure>

          {dated && (
            <aside className="mt-6 rounded-2xl bg-card p-5 ring-1 ring-slate-200">
              <h2 className="text-sm font-bold tracking-wide text-slate-500 uppercase">{t.news.eventInfo}</h2>
              <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Fact icon={<CalendarDays className="size-4" />} label={t.news.when}>
                  {fmt({ weekday: 'long', day: 'numeric', month: 'long' })}
                </Fact>
                {item.time && (
                  <Fact icon={<Clock className="size-4" />} label={t.news.time}>
                    {item.time}
                  </Fact>
                )}
                <Fact icon={<MapPin className="size-4" />} label={t.news.where}>
                  {l(item.place)}
                </Fact>
              </dl>
              {item.info && item.info.length > 0 && (
                <>
                  <h3 className="mt-5 flex items-center gap-1.5 text-sm font-bold text-slate-900">
                    <Info className="size-4 text-accent-600" /> {t.news.goodToKnow}
                  </h3>
                  <ul className="mt-2 space-y-1 pl-5">
                    {item.info.map((x) => (
                      <li key={x.lv} className="list-disc text-sm text-slate-700 marker:text-accent-500">
                        {l(x)}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="mt-5">{interest}</div>
            </aside>
          )}

          <div className="mt-8 max-w-[68ch] space-y-5 text-[17px] leading-8 text-slate-800">
            {body.map((p) => (
              <p key={p.lv}>{l(p)}</p>
            ))}
          </div>

          <p className="mt-10 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-amber-200">
            <Info className="mt-px size-3.5 shrink-0 text-amber-600" />
            {t.news.fictional}
          </p>

          <Link to="/news" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
            <ArrowLeft className="size-4" /> {t.news.backToNews}
          </Link>
        </article>

        <aside className="space-y-8 lg:col-span-4">
          <LatestList items={published().filter((n) => n.id !== item.id).slice(0, 6)} />
          <MostRead items={mostRead().filter((n) => n.id !== item.id).slice(0, 4)} />
        </aside>
      </div>

      <section className="mt-14">
        <SectionTitle icon={Newspaper} title={t.news.related} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {related.map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </div>
      </section>
    </>
  )
}

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-accent-600">{icon}</span>
      <div>
        <dt className="text-xs font-semibold text-slate-500">{label}</dt>
        <dd className="font-medium text-slate-900 first-letter:uppercase">{children}</dd>
      </div>
    </div>
  )
}
