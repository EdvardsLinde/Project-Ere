import { lv } from './lv'
import { en } from './en'
import type { Dict } from './lv'

export type { Dict }
export const translations: Record<'lv' | 'en', Dict> = { lv, en }
