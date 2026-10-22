/**
 * SEER — shared data types
 * Mock data: typed constants that a real API can replace later.
 */
import type { LucideIcon } from 'lucide-react'

export type Lang = 'lv' | 'en'
export type Localized = Record<Lang, string>
export type { LucideIcon }
