import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { eventConfig } from "@/config/event";
import { siteConfig } from "@/config/site";
import { buildLandscape } from "@/lib/key-visual";
import { landscapeMarkup, type LandscapePalette } from "@/lib/key-visual-svg";

/**
 * Link preview (LinkedIn, Facebook, WhatsApp, Slack…): the event name and the
 * hero's key visual, generated at build time from the same code as the hero.
 */
export const alt = `${eventConfig.name}: ${eventConfig.subtitle.lv} / ${eventConfig.subtitle.en}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const c = siteConfig.theme.light;
const palette: LandscapePalette = {
  bg: c.bg,
  crop: c["land-crop"],
  row: c["land-row"],
  forest: c["land-forest"],
  crown: c["primary-fill"],
  moss: c["land-moss"],
  meadow: c["land-meadow"],
  wheat: c["land-wheat"],
  straw: c["land-straw"],
  road: c.accent,
  casing: c.night,
  light: c["on-night"],
};

/** Static Bricolage files (the image renderer reads .woff, not the site's .woff2). */
const font = (file: string) => readFile(join(process.cwd(), "node_modules/@fontsource/bricolage-grotesque/files", file));

const VISUAL = { width: 480, height: 630 };

export default async function OpengraphImage() {
  const landscape = buildLandscape({ ...VISUAL, seed: 1, cols: 4, rows: 4, nodes: 3 });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${VISUAL.width}" height="${VISUAL.height}" viewBox="0 0 ${VISUAL.width} ${VISUAL.height}">${landscapeMarkup(
    landscape,
    palette,
    "og",
    { radius: 0, animate: false },
  )}</svg>`;
  const [bold, boldExt, semi, semiExt] = await Promise.all([
    font("bricolage-grotesque-latin-800-normal.woff"),
    font("bricolage-grotesque-latin-ext-800-normal.woff"),
    font("bricolage-grotesque-latin-600-normal.woff"),
    font("bricolage-grotesque-latin-ext-600-normal.woff"),
  ]);
  const [first, ...rest] = eventConfig.name.split(" ");

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: c.bg, color: c.ink, fontFamily: "Bricolage" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 720, padding: "60px 52px 56px 72px" }}>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: c.primary }}>
            {`Saldus · ${eventConfig.days.length} dienas / days`}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 104, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2 }}>
              <span>{first}</span>
              <span style={{ color: c.primary, marginLeft: 26 }}>{rest.join(" ")}</span>
              <span style={{ color: c.accent }}>.</span>
            </div>
            <div style={{ display: "flex", marginTop: 30, fontSize: 32, fontWeight: 600, lineHeight: 1.2 }}>{eventConfig.subtitle.lv}</div>
            <div style={{ display: "flex", maxWidth: 500, marginTop: 12, fontSize: 24, fontWeight: 600, lineHeight: 1.25, color: c["ink-muted"] }}>
              {eventConfig.subtitle.en}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 21, fontWeight: 600, lineHeight: 1.35, color: c["ink-muted"] }}>
            <span>{eventConfig.datesVenue.lv}</span>
            <span>{eventConfig.datesVenue.en}</span>
          </div>
        </div>
        <img alt="" width={VISUAL.width} height={VISUAL.height} src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: bold, weight: 800, style: "normal" },
        { name: "Bricolage", data: boldExt, weight: 800, style: "normal" },
        { name: "Bricolage", data: semi, weight: 600, style: "normal" },
        { name: "Bricolage", data: semiExt, weight: 600, style: "normal" },
      ],
    },
  );
}
