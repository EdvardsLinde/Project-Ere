/**
 * The Saldus photo behind the News hero (original file, not re-encoded, so it stays
 * sharp at full screen width). Most free photos, e.g. from Wikimedia Commons, require
 * a credit: put the author and licence in `credit`. Set HERO_PHOTO to null for a plain band.
 */
import square from '../assets/saldus/square.webp'

export interface HeroPhoto {
  src: string
  /** What the photo shows, for the caption. */
  caption: string
  /** "Author, licence", e.g. "Jane Doe, CC BY-SA 4.0". Empty while unknown. */
  credit: string
}

// Supplied by the SEER team. TODO: add the photographer / source to `credit`.
export const HERO_PHOTO: HeroPhoto | null = { src: square, caption: 'Saldus centrs', credit: '' }
