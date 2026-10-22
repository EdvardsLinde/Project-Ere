/**
 * SEER — onboarding & profile options (interests, skill tags, motivation, experience types)
 * Mock data: typed constants that a real API can replace later.
 */
import { Brain, ChartColumn, CodeXml, Gamepad2, Palette, Puzzle, ShieldCheck, Sigma } from 'lucide-react'
import type { Localized, LucideIcon } from './types'

/* -------------------------------------------------------------------------- */
/*  1. INTERESTS — screen "Kas tevi interesē?" (multi-select tags)             */
/* -------------------------------------------------------------------------- */
export interface Interest {
  id: string
  icon: LucideIcon
  label: Localized
}

export const INTERESTS: Interest[] = [
  { id: 'games', icon: Gamepad2, label: { lv: 'Datori un spēles', en: 'Computers & games' } },
  { id: 'problems', icon: Puzzle, label: { lv: 'Problēmu risināšana', en: 'Problem solving' } },
  { id: 'design', icon: Palette, label: { lv: 'Dizains', en: 'Design' } },
  { id: 'security', icon: ShieldCheck, label: { lv: 'Drošība', en: 'Security' } },
  { id: 'ai', icon: Brain, label: { lv: 'Mākslīgais intelekts', en: 'Artificial intelligence' } },
  { id: 'math', icon: Sigma, label: { lv: 'Matemātika', en: 'Maths' } },
  { id: 'coding', icon: CodeXml, label: { lv: 'Programmēšana', en: 'Programming' } },
  { id: 'data', icon: ChartColumn, label: { lv: 'Dati', en: 'Data' } },
]

/* -------------------------------------------------------------------------- */
/*  2. SKILLS — profile section "Prasmes" (multi-select + add your own)        */
/* -------------------------------------------------------------------------- */
export interface Skill {
  id: string
  label: Localized
}

export const SKILLS: Skill[] = [
  { id: 'programming', label: { lv: 'Programmēšana', en: 'Programming' } },
  { id: 'math', label: { lv: 'Matemātika', en: 'Maths' } },
  { id: 'communication', label: { lv: 'Komunikācija', en: 'Communication' } },
  { id: 'teamwork', label: { lv: 'Komandas darbs', en: 'Teamwork' } },
  { id: 'design', label: { lv: 'Dizains', en: 'Design' } },
  { id: 'languages', label: { lv: 'Valodas', en: 'Languages' } },
  { id: 'problem-solving', label: { lv: 'Problēmu risināšana', en: 'Problem solving' } },
]

/* -------------------------------------------------------------------------- */
/*  3. MOTIVATION TAGS — profile section "Motivācija" (optional tags)          */
/* -------------------------------------------------------------------------- */
export const MOTIVATION_TAGS: Skill[] = [
  { id: 'salary', label: { lv: 'Gribu labu algu', en: 'I want a good salary' } },
  { id: 'tech', label: { lv: 'Interesē tehnoloģijas', en: "I'm into technology" } },
  { id: 'remote', label: { lv: 'Gribu strādāt attālināti', en: 'I want to work remotely' } },
  { id: 'saldus', label: { lv: 'Gribu palikt Saldū', en: 'I want to stay in Saldus' } },
]

/* -------------------------------------------------------------------------- */
/*  4. EXPERIENCE TYPES — profile section "Pieredze"                           */
/*     Shown as chips so teens see that more than paid work counts.            */
/* -------------------------------------------------------------------------- */
export const EXPERIENCE_TYPES: Skill[] = [
  { id: 'school', label: { lv: 'Skolas projekts', en: 'School project' } },
  { id: 'hobby', label: { lv: 'Hobijs', en: 'Hobby' } },
  { id: 'course', label: { lv: 'Kurss', en: 'Course' } },
  { id: 'volunteer', label: { lv: 'Brīvprātīgais darbs', en: 'Volunteering' } },
  { id: 'job', label: { lv: 'Darbs', en: 'Job' } },
]
