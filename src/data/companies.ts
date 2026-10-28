/**
 * SEER — example companies. These are REAL companies in the Saldus region, but
 * none has agreed to take part yet: every card shows "PIEMĒRS" and
 * "partnership not yet confirmed". Only verified, non-sensitive facts are used;
 * no logos and no headcounts. Contact details are placeholders.
 *
 * Team TODO before publishing: confirm SC GRUPA's exact name and how to describe
 * Brimer Saldus (fibreglass composites vs plastic products).
 */
import type { Company } from './types'

export const COMPANIES: Company[] = [
  {
    id: 'pata',
    name: 'PATA Saldus',
    industry: { lv: 'Kokzāģētava un kokapstrāde', en: 'Sawmill and timber processing' },
    town: 'Saldus',
    address: 'Saldus',
    description: {
      lv: 'Kokzāģētava Saldū: zāģmateriāli un kokapstrāde ar automatizētām ražošanas līnijām un iekārtu datiem.',
      en: 'A sawmill in Saldus: sawn timber and wood processing with automated production lines and machine data.',
    },
    contactName: 'Personāla daļa',
    contactEmail: 'prakse@piemers.lv',
    isExample: true,
  },
  {
    id: 'jets',
    name: 'Jets Vacuum',
    industry: { lv: 'Vakuuma sistēmu ražošana', en: 'Vacuum systems manufacturing' },
    town: 'Saldus',
    address: 'Saldus',
    description: {
      lv: 'Saldus ražotne, kas ir daļa no Norvēģijas Jets grupas un ražo vakuuma sistēmas.',
      en: 'A Saldus plant that is part of the Norwegian Jets group and makes vacuum systems.',
    },
    contactName: 'IT nodaļa',
    contactEmail: 'prakse@piemers.lv',
    isExample: true,
  },
  {
    id: 'sc-grupa',
    name: 'SC GRUPA',
    industry: { lv: 'Ceļu un infrastruktūras būvniecība', en: 'Road and infrastructure construction' },
    town: 'Saldus',
    address: 'Saldus',
    description: {
      lv: 'Ceļu un infrastruktūras būvniecība Saldū ar lielu tehnikas parku un GPS datiem.',
      en: 'Road and infrastructure construction in Saldus with a large machine fleet and GPS data.',
    },
    contactName: 'Projektu vadība',
    contactEmail: 'prakse@piemers.lv',
    isExample: true,
  },
  {
    id: 'brimer',
    name: 'Brimer Saldus',
    industry: { lv: 'Kompozītmateriālu un plastmasas izstrādājumi', en: 'Composite and plastic products' },
    town: 'Saldus',
    address: 'Saldus pagasts',
    description: {
      lv: 'Ražotne Saldus pagastā, kas ir daļa no Norplast grupas. Kvalitātes kontrole ir ikdienas darba daļa.',
      en: 'A plant in Saldus parish, part of the Norplast group. Quality control is part of everyday work.',
    },
    contactName: 'Kvalitātes nodaļa',
    contactEmail: 'prakse@piemers.lv',
    isExample: true,
  },
  {
    id: 'tervete-food',
    name: 'Tērvete Food',
    industry: { lv: 'Pārtikas ražošana (saldējums)', en: 'Food production (ice cream)' },
    town: 'Saldus',
    address: 'Druva, Saldus pagasts',
    description: {
      lv: 'Druvā ražo saldējumu ar zīmolu “Druva”. Uzņēmums ir daļa no Latvijas Agrolats Grupas.',
      en: 'Makes ice cream under the “Druva” brand in Druva. Part of the Latvian Agrolats Grupa.',
    },
    contactName: 'Ražošanas vadība',
    contactEmail: 'prakse@piemers.lv',
    isExample: true,
  },
  {
    id: 'warmeston',
    name: 'Warmeston',
    industry: { lv: 'Koksnes granulas un bioenerģija', en: 'Wood pellets and bioenergy' },
    town: 'Brocēni',
    address: 'Brocēni',
    description: {
      lv: 'Koksnes granulu rūpnīca Brocēnos ar koģenerācijas staciju. Pieder Igaunijas Warmeston grupai.',
      en: 'A wood pellet factory in Brocēni with a cogeneration (CHP) plant. Owned by the Estonian Warmeston group.',
    },
    contactName: 'Uzturēšanas nodaļa',
    contactEmail: 'prakse@piemers.lv',
    isExample: true,
  },
  {
    id: 'schwenk',
    name: 'SCHWENK Latvija',
    industry: { lv: 'Cementa ražošana', en: 'Cement production' },
    town: 'Brocēni',
    address: 'Brocēni',
    description: {
      lv: 'Cementa rūpnīca Brocēnos. Rūpnīca izmanto arī saules elektroenerģiju.',
      en: 'A cement plant in Brocēni. The plant also uses solar electricity.',
    },
    contactName: 'Enerģētikas nodaļa',
    contactEmail: 'prakse@piemers.lv',
    isExample: true,
  },
]
