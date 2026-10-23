/**
 * Saldus photos behind the News hero. Put the image files in src/assets/saldus/
 * and list them here with their author and licence (most free photos, e.g. from
 * Wikimedia Commons, require a credit). While the list is empty the hero is a plain band.
 */
import square from '../assets/saldus/square.jpg'
import sign from '../assets/saldus/sign.jpg'

export interface HeroPhoto {
  /** Imported image URL, e.g. `import church from '../assets/saldus/church.jpg'`. */
  src: string
  /** What the photo shows, for the credit line. */
  caption: string
  /** "Author, licence", e.g. "Jane Doe, CC BY-SA 4.0". Empty while unknown. */
  credit: string
}

// Supplied by the SEER team. TODO: add the photographer / source to `credit`.
export const HERO_PHOTOS: HeroPhoto[] = [
  { src: square, caption: 'Saldus centrs', credit: '' },
  { src: sign, caption: 'Saldus', credit: '' },
]
