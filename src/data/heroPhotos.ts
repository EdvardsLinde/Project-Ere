/**
 * Saldus photos behind the News hero. Put the image files in src/assets/saldus/
 * and list them here with their author and licence (most free photos, e.g. from
 * Wikimedia Commons, require a credit). While the list is empty the hero shows
 * a plain grid pattern instead.
 */
export interface HeroPhoto {
  /** Imported image URL, e.g. `import church from '../assets/saldus/church.jpg'`. */
  src: string
  /** What the photo shows, for the credit line. */
  caption: string
  /** "Author, licence", e.g. "Jane Doe, CC BY-SA 4.0". */
  credit: string
}

export const HERO_PHOTOS: HeroPhoto[] = []
