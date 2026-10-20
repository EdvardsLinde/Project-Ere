/**
 * ERE — skills test question bank (12 questions).
 *
 * Three kinds of questions:
 *   - interest:  "what would you rather do?" → points per track
 *   - rating:    self-rated ability, 1–5 → sets one skill's base level
 *   - scenario:  a small real-life situation; the best answer shows know-how → skill level
 *
 * Scoring lives in src/lib/skills.ts. Edit questions here freely: each option says
 * which tracks it points to (`tracks`) and/or which skill level it sets (`skills`).
 */
import type { TrackId } from './careers'
import type { SkillAreaId } from './skillAreas'
import type { Localized } from './types'

export type QuestionKind = 'interest' | 'rating' | 'scenario'

export interface TestOption {
  label: Localized
  /** Interest points per track (typically 1–3). */
  tracks?: Partial<Record<TrackId, number>>
  /** Skill level (0–100) this answer indicates. */
  skills?: Partial<Record<SkillAreaId, number>>
}

export interface TestQuestion {
  id: string
  kind: QuestionKind
  prompt: Localized
  /** Optional plain-language helper under the question. */
  help?: Localized
  options: TestOption[]
}

/**
 * Self-rating scale shared by all `rating` questions: 1 → 10 … 5 → 70.
 * Capped at 70 on purpose: self-ratings are easy to inflate, so going higher
 * requires proof — solved training tasks or completed courses.
 */
export const SELF_RATING_CAP = 70
const RATING_LEVELS = [10, 25, 40, 55, SELF_RATING_CAP]
const RATING_LABELS: Localized[] = [
  { lv: 'Vēl nemaz', en: 'Not yet' },
  { lv: 'Mazliet', en: 'A little' },
  { lv: 'Vidēji', en: 'Okay' },
  { lv: 'Labi', en: 'Well' },
  { lv: 'Ļoti labi', en: 'Very well' },
]

function rating(
  id: string,
  skill: SkillAreaId,
  prompt: Localized,
  help: Localized,
  tracks: Partial<Record<TrackId, number>>,
): TestQuestion {
  return {
    id,
    kind: 'rating',
    prompt,
    help,
    options: RATING_LEVELS.map((level, i) => ({
      label: RATING_LABELS[i],
      skills: { [skill]: level },
      // Higher self-rating also nudges the tracks that rely on this skill.
      tracks: Object.fromEntries(Object.entries(tracks).map(([k, v]) => [k, Math.round((v * i) / 4)])),
    })),
  }
}

export const TEST_QUESTIONS: TestQuestion[] = [
  {
    id: 'saturday',
    kind: 'interest',
    prompt: {
      lv: 'Brīva sestdienas pēcpusdiena. Ko tu labprātāk darītu?',
      en: 'A free Saturday afternoon. What would you rather do?',
    },
    options: [
      { label: { lv: 'Atrisinātu hakeru mīklu vai escape room', en: 'Solve a hacker puzzle or an escape room' }, tracks: { cyber: 3 } },
      { label: { lv: 'Izpētītu, kāpēc kāds video kļuva tik populārs', en: 'Figure out why a video went viral' }, tracks: { 'ai-data': 3 } },
      { label: { lv: 'Uztaisītu mājaslapu savam hobijam', en: 'Build a website for my hobby' }, tracks: { web: 3 } },
      { label: { lv: 'Salabotu drauga lēno datoru', en: 'Fix a friend’s slow computer' }, tracks: { 'it-support': 3 } },
    ],
  },
  {
    id: 'annoys',
    kind: 'interest',
    prompt: { lv: 'Kas tevi kaitina visvairāk?', en: 'What annoys you the most?' },
    options: [
      { label: { lv: 'Kad kādam uzlauž kontu', en: 'When someone’s account gets hacked' }, tracks: { cyber: 3 } },
      { label: { lv: 'Kad skaitļi un fakti nesakrīt', en: 'When numbers and facts don’t add up' }, tracks: { 'ai-data': 3 } },
      { label: { lv: 'Kad lapa vai lietotne izskatās šķība', en: 'When a site or app looks broken' }, tracks: { web: 3 } },
      { label: { lv: 'Kad kaut kas nestrādā un neviens nepalīdz', en: 'When something breaks and nobody helps' }, tracks: { 'it-support': 3 } },
    ],
  },
  {
    id: 'team-role',
    kind: 'interest',
    prompt: { lv: 'Skolas projektā tu parasti esi tas, kurš…', en: 'In a school project you’re usually the one who…' },
    options: [
      { label: { lv: 'atrod, kur plānā ir caurums', en: 'spots the hole in the plan' }, tracks: { cyber: 2, 'ai-data': 1 } },
      { label: { lv: 'saliek visu tabulā un izdara secinājumus', en: 'puts everything in a table and draws conclusions' }, tracks: { 'ai-data': 3 } },
      { label: { lv: 'uztaisa prezentāciju vai vizuālo daļu', en: 'makes the slides or the visual part' }, tracks: { web: 2 } },
      { label: { lv: 'palīdz citiem, kad viņi iestrēgst', en: 'helps others when they get stuck' }, tracks: { 'it-support': 2 } },
    ],
  },
  rating(
    'r-programming',
    'programming',
    { lv: 'Cik labi tu proti programmēt?', en: 'How well can you program?' },
    { lv: 'Scratch, Python, JavaScript — viss skaitās.', en: 'Scratch, Python, JavaScript — it all counts.' },
    { web: 2, 'ai-data': 2, cyber: 1 },
  ),
  rating(
    'r-math',
    'math',
    { lv: 'Cik labi tev padodas matemātika un loģikas uzdevumi?', en: 'How good are you at maths and logic puzzles?' },
    { lv: 'Ne tikai atzīmes — arī prāta mīklas un sudoku.', en: 'Not just grades — brain teasers and sudoku count too.' },
    { 'ai-data': 3 },
  ),
  rating(
    'r-networks',
    'networks',
    { lv: 'Cik labi tu saproti, kā strādā dators, Wi-Fi un internets?', en: 'How well do you understand how computers, Wi-Fi and the internet work?' },
    { lv: 'Piemēram, vai vari uzstādīt maršrutētāju vai programmu.', en: 'For example, could you set up a router or install software?' },
    { 'it-support': 2, cyber: 2 },
  ),
  rating(
    'r-web',
    'web',
    { lv: 'Vai esi veidojis mājaslapu (HTML, CSS vai rīkā kā Wix)?', en: 'Have you built a website (HTML, CSS or a tool like Wix)?' },
    { lv: 'Arī skolas projekts vai blogs skaitās.', en: 'A school project or a blog counts too.' },
    { web: 3 },
  ),
  rating(
    'r-design',
    'design',
    { lv: 'Cik labi tev padodas dizains — krāsas, izkārtojums, vizuāli?', en: 'How good are you at design — colours, layout, visuals?' },
    { lv: 'Plakāti, prezentācijas, Canva, zīmēšana.', en: 'Posters, slides, Canva, drawing.' },
    { web: 2 },
  ),
  rating(
    'r-communication',
    'communication',
    { lv: 'Cik viegli tev ir mierīgi izskaidrot kaut ko citam?', en: 'How easy is it for you to calmly explain something to someone?' },
    { lv: 'Piemēram, iemācīt vecvecākiem lietot telefonu.', en: 'For example, teaching your grandparents to use a phone.' },
    { 'it-support': 3 },
  ),
  rating(
    'r-english',
    'english',
    { lv: 'Cik labi tu runā un lasi angliski?', en: 'How well do you speak and read English?' },
    { lv: 'Svarīgi, ja gribi strādāt attālināti ārzemju uzņēmumam.', en: 'Important if you want to work remotely for a foreign company.' },
    { cyber: 1, 'ai-data': 1, web: 1, 'it-support': 1 },
  ),
  {
    id: 's-phishing',
    kind: 'scenario',
    prompt: {
      lv: 'Draugs saņem e-pastu: “Tavs konts tiks bloķēts! Spied šeit un ievadi paroli.” Ko tu ieteiktu?',
      en: 'A friend gets an email: “Your account will be blocked! Click here and enter your password.” What do you suggest?',
    },
    options: [
      { label: { lv: 'Ātri spiest saiti, lai konts netiek bloķēts', en: 'Click quickly so the account isn’t blocked' }, skills: { security: 10 } },
      { label: { lv: 'Vienkārši ignorēt', en: 'Just ignore it' }, skills: { security: 35 } },
      {
        label: { lv: 'Nespiest saiti, pārbaudīt sūtītāja adresi un ieiet kontā pašam caur oficiālo lapu', en: 'Don’t click, check the sender’s address and log in yourself via the official site' },
        skills: { security: 75 },
        tracks: { cyber: 2 },
      },
      { label: { lv: 'Nezinu', en: 'I don’t know' }, skills: { security: 10 } },
    ],
  },
  {
    id: 's-slow-pc',
    kind: 'scenario',
    prompt: {
      lv: 'Klases dators pēkšņi strādā ļoti lēni. Ko tu darītu vispirms?',
      en: 'The classroom computer suddenly runs very slowly. What would you do first?',
    },
    options: [
      { label: { lv: 'Ieteiktu nopirkt jaunu', en: 'Suggest buying a new one' }, skills: { troubleshooting: 10 } },
      { label: { lv: 'Restartētu un cerētu, ka palīdz', en: 'Restart it and hope it helps' }, skills: { troubleshooting: 35 } },
      {
        label: { lv: 'Paskatītos, kuras programmas tērē resursus, un pārbaudītu atjauninājumus', en: 'Check which programs use the most resources and look for updates' },
        skills: { troubleshooting: 75 },
        tracks: { 'it-support': 2 },
      },
      { label: { lv: 'Pasauktu kādu citu', en: 'Call someone else' }, skills: { troubleshooting: 15 } },
    ],
  },
]
