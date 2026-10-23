/**
 * Cover photos for news items: free stock photos from Pexels (https://www.pexels.com/license/).
 * Files live in src/assets/news/<news id>.jpg (960×540); this maps each news id to its
 * Pexels photo id so every article can link back to the original photo.
 */
const FILES = import.meta.glob<string>('../assets/news/*.jpg', { eager: true, import: 'default' })

const PEXELS_IDS: Record<string, number> = {
  'ai-corner': 5324875,
  'ai-how-it-learns': 8294666,
  'ai-school-honest': 5905885,
  'ai-workshop-saldus': 8849295,
  'career-day': 4474047,
  'coding-club-record': 7742816,
  'cowork-saldus': 5186358,
  'ctf-night': 5935788,
  'cv-workshop': 5989941,
  'cyber-2fa': 69432,
  'cyber-phishing-signs': 5697256,
  'cyber-what-analyst-does': 5380664,
  'data-analyst-explained': 34069,
  'gaming-lan': 9072317,
  'girls-in-tech': 3861972,
  'hackathon': 7972325,
  'internet-villages': 27040519,
  'networks-course': 6466143,
  'phishing-wave': 7821766,
  'python-course': 34803985,
  'remote-trend': 6393342,
  'remote-worker-story': 4050290,
  'repair-cafe': 7639374,
  'saldus-tech-week': 8344905,
  'school-site': 36571389,
  'seniors-phones': 3768148,
  'student-app-win': 32074907,
  'summer-interns': 7639370,
  'support-slow-pc': 7236846,
  'web-first-site': 270366,
  'youth-survey': 18734744,
}

export interface NewsPhoto {
  src: string
  credit: string
  /** The photo's page on Pexels. */
  url: string
}

export function newsPhoto(newsId: string): NewsPhoto | undefined {
  const src = FILES[`../assets/news/${newsId}.jpg`]
  const pexelsId = PEXELS_IDS[newsId]
  if (!src || !pexelsId) return undefined
  return { src, credit: 'Pexels', url: `https://www.pexels.com/photo/${pexelsId}/` }
}
