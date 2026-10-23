/**
 * Cover photos for news items. Files live in src/assets/news/<news id>.jpg (960×540).
 * - News stories show Saldus or other Latvian places (PLACES says where, for the caption):
 *   two Saldus photos supplied by the team (SALDUS_TEAM) and Latvian photos from Pexels.
 * - Events, courses and explainers show the activity itself: Pexels stock photos.
 * Pexels photos are free to use (https://www.pexels.com/license/); each links back to its page.
 */
const FILES = import.meta.glob<string>('../assets/news/*.jpg', { eager: true, import: 'default' })

/** Pexels photo id for every Pexels cover. */
const PEXELS_IDS: Record<string, number> = {
  'ai-corner': 29383059,
  'ai-how-it-learns': 8294666,
  'ai-school-honest': 5905885,
  'ai-workshop-saldus': 8849295,
  'career-day': 4474047,
  'coding-club-record': 4866782,
  'ctf-night': 5935788,
  'cv-workshop': 5989941,
  'cyber-2fa': 69432,
  'cyber-phishing-signs': 5697256,
  'cyber-what-analyst-does': 5380664,
  'data-analyst-explained': 34069,
  'gaming-lan': 9072317,
  'girls-in-tech': 3861972,
  'hackathon': 7972325,
  'internet-villages': 773583,
  'networks-course': 6466143,
  'phishing-wave': 18355513,
  'python-course': 34803985,
  'remote-trend': 14038289,
  'remote-worker-story': 4050290,
  'repair-cafe': 7639374,
  'school-site': 36571389,
  'seniors-phones': 3768148,
  'student-app-win': 18290253,
  'summer-interns': 16661972,
  'support-slow-pc': 7236846,
  'web-first-site': 270366,
  'youth-survey': 17175561,
}

/** Where a place photo was taken (it does not show the story's actual event). */
const PLACES: Record<string, string> = {
  'ai-corner': 'Rīga',
  'coding-club-record': 'Rīga',
  'cowork-saldus': 'Saldus',
  'internet-villages': 'Ikšķile',
  'phishing-wave': 'Rīga',
  'remote-trend': 'Rīga',
  'saldus-tech-week': 'Saldus',
  'student-app-win': 'Liepāja',
  'summer-interns': 'Liepāja, Karosta',
  'youth-survey': 'Rīga',
}

/** Saldus photos supplied by the SEER team. TODO: add the photographer / source. */
const SALDUS_TEAM = new Set(['saldus-tech-week', 'cowork-saldus'])

export interface NewsPhoto {
  src: string
  /** Who or where the photo comes from, e.g. "Pexels". Empty while unknown. */
  credit: string
  /** Link to the original, when there is one. */
  url?: string
  /** Where the photo was taken, for place photos. */
  place?: string
}

export function newsPhoto(newsId: string): NewsPhoto | undefined {
  const src = FILES[`../assets/news/${newsId}.jpg`]
  if (!src) return undefined
  const place = PLACES[newsId]
  if (SALDUS_TEAM.has(newsId)) return { src, credit: '', place }
  const pexelsId = PEXELS_IDS[newsId]
  if (!pexelsId) return undefined
  return { src, credit: 'Pexels', url: `https://www.pexels.com/photo/${pexelsId}/`, place }
}
