/** SEER — date formatting in the current language. */
import type { DateRange, Lang } from '../data'

const locale = (lang: Lang) => (lang === 'lv' ? 'lv-LV' : 'en-GB')
/** Dates are plain ISO days; parse at noon UTC so no time zone shifts the day. */
const parse = (iso: string) => new Date(`${iso}T12:00:00Z`)

export function formatDate(iso: string, lang: Lang, long = false): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat(locale(lang), {
    day: 'numeric',
    month: long ? 'long' : 'short',
    year: long ? 'numeric' : undefined,
    timeZone: 'UTC',
  }).format(parse(iso))
}

export function formatRange(range: DateRange, lang: Lang): string {
  if (!range.start) return ''
  const fmt = new Intl.DateTimeFormat(locale(lang), { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
  return fmt.formatRange(parse(range.start), parse(range.end || range.start))
}
