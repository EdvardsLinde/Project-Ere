/**
 * Real nature photos for Saldus (forestry and farming), from Wikimedia Commons.
 * Files live in public/photos; the single-file preview build swaps these paths
 * for data URLs (see artifact/build.mjs). All were cropped or cut out and
 * colour-graded towards the palette; the cut-outs got a white die-cut border.
 */

export type PhotoKey = "pine" | "field" | "leafGreen" | "leafOrange" | "wheat";

export const photoSrc: Record<PhotoKey, string> = {
  pine: "/photos/pine.webp",
  field: "/photos/field.webp",
  leafGreen: "/photos/leafgreen.webp",
  leafOrange: "/photos/leaforange.webp",
  wheat: "/photos/wheat.webp",
};

/** Where the photos come from (a proper name, the same in every language). */
export const photoHost = "Wikimedia Commons";

/** Attribution required by the CC BY-SA licences; shown in the footer. */
export const photoCredits = [
  {
    subject: "Pinus sylvestris",
    author: "George Chernilevsky",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Pinus_sylvestris_2020_G2.jpg",
  },
  {
    subject: "Vehnäpelto",
    author: "kallerna",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Vehn%C3%A4pelto_7.jpg",
  },
  {
    subject: "Quercus robur",
    author: "Dmitry Makeev",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:2020_year._Herbarium._Oak._img-013.jpg",
  },
  {
    subject: "Quercus robur",
    author: "Dmitry Makeev",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:2020_year._Herbarium._Oak._img-001.jpg",
  },
  {
    subject: "Triticum aestivum",
    author: "Roger Culos",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Triticum_aestivum_subsp._aestivum_MHNT.BOT.2015.2.31.jpg",
  },
] as const;
