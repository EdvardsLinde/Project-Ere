/**
 * Turns a `Landscape` into SVG markup. Shared by the hero (colours as theme CSS
 * variables) and the link preview image (literal colours, rendered without a browser).
 */
import { PATTERN_ANGLES, polygonPoints, type Landscape } from "./key-visual";

export interface LandscapePalette {
  /** Field boundaries and the picture's background. */
  bg: string;
  crop: string;
  row: string;
  forest: string;
  crown: string;
  moss: string;
  meadow: string;
  wheat: string;
  straw: string;
  road: string;
  /** Dark outline around the road and the innovation points. */
  casing: string;
  /** Light fill of points and links. */
  light: string;
}

/** Hero colours: theme tokens, so the picture follows light and dark mode. */
export const themePalette: LandscapePalette = {
  bg: "var(--color-bg)",
  crop: "var(--color-land-crop)",
  row: "var(--color-land-row)",
  forest: "var(--color-land-forest)",
  crown: "var(--color-primary-fill)",
  moss: "var(--color-land-moss)",
  meadow: "var(--color-land-meadow)",
  wheat: "var(--color-land-wheat)",
  straw: "var(--color-land-straw)",
  road: "var(--color-accent)",
  casing: "var(--color-night)",
  light: "var(--color-on-night)",
};

/** Inner markup (defs + drawing) for an <svg> whose viewBox is the landscape's size. */
export function landscapeMarkup(l: Landscape, c: LandscapePalette, id: string, { radius = 24, animate = true } = {}): string {
  const out: string[] = ["<defs>"];
  const pattern = (name: string, w: number, h: number, angle: number, bg: string, body: string) =>
    out.push(
      `<pattern id="${id}-${name}" width="${w}" height="${h}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">` +
        `<rect width="${w}" height="${h}" fill="${bg}"/>${body}</pattern>`,
    );
  PATTERN_ANGLES.crop.forEach((a, i) => pattern(`crop${i}`, 10, 10, a, c.crop, `<rect x="0" y="3.5" width="10" height="3" fill="${c.row}"/>`));
  PATTERN_ANGLES.forest.forEach((a, i) =>
    pattern(
      `forest${i}`,
      18,
      16,
      a,
      c.forest,
      `<circle cx="4.5" cy="4.5" r="5" fill="${c.crown}"/><circle cx="13.5" cy="12" r="5" fill="${c.crown}"/>` +
        `<circle cx="3.5" cy="3.4" r="1.6" fill="${c.moss}"/><circle cx="12.5" cy="10.9" r="1.6" fill="${c.moss}"/>`,
    ),
  );
  PATTERN_ANGLES.wheat.forEach((a, i) => pattern(`wheat${i}`, 12, 9, a, c.wheat, `<rect x="1" y="3.5" width="5" height="2" rx="1" fill="${c.straw}"/>`));
  out.push(`<clipPath id="${id}-clip"><rect x="0" y="0" width="${l.width}" height="${l.height}" rx="${radius}"/></clipPath>`, "</defs>");

  out.push(`<g clip-path="url(#${id}-clip)">`, `<rect width="${l.width}" height="${l.height}" fill="${c.bg}"/>`);
  for (const p of l.parcels) {
    const fill = p.kind === "meadow" ? c.meadow : `url(#${id}-${p.kind}${p.variant})`;
    out.push(`<polygon points="${polygonPoints(p.points)}" fill="${fill}" stroke="${c.bg}" stroke-width="7" stroke-linejoin="round"/>`);
  }

  const road = `d="${l.road}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  out.push(
    `<path ${road} stroke="${c.casing}" stroke-width="13"/>`,
    `<path ${road} stroke="${c.road}" stroke-width="8"/>`,
    `<path ${road} stroke="${c.light}" stroke-width="1.6" stroke-dasharray="8 6" opacity="0.9"${animate ? ' class="kv-flow"' : ""}/>`,
  );

  for (const { from, to } of l.links) {
    out.push(
      `<path d="M${from.x} ${from.y}L${to.x} ${to.y}" stroke="${c.light}" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/>`,
      `<circle cx="${to.x}" cy="${to.y}" r="4.5" fill="${c.light}" stroke="${c.casing}" stroke-width="2"/>`,
    );
  }
  l.nodes.forEach((n, i) => {
    if (animate && i === 1) out.push(`<circle cx="${n.x}" cy="${n.y}" r="11" fill="none" stroke="${c.road}" stroke-width="3" class="kv-pulse"/>`);
    out.push(
      `<circle cx="${n.x}" cy="${n.y}" r="11" fill="${c.light}" stroke="${c.casing}" stroke-width="2.5"/>`,
      `<circle cx="${n.x}" cy="${n.y}" r="4.5" fill="${c.road}"/>`,
    );
  });
  out.push("</g>");
  return out.join("");
}
