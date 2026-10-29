import { siteConfig } from "@/config/site";

const vars = (tokens: Record<string, string>) =>
  Object.entries(tokens)
    .map(([k, v]) => `--c-${k}:${v};`)
    .join("");

/**
 * CSS variables for both themes. Shared by the Next.js layout and the
 * single-file preview build — keep this file free of "use client".
 *
 * - `:root` light, `html.dark` dark (SEER's default, set by the toggle);
 * - `.paper` always light: certificates look like paper in either theme;
 * - printing is always light.
 */
export function themeCss(): string {
  const { light, dark } = siteConfig.theme;
  return [
    `:root{${vars(light)}color-scheme:light}`,
    `html.dark{${vars(dark)}color-scheme:dark}`,
    `.paper{${vars(light)}color:var(--c-ink);color-scheme:light}`,
    `@media print{:root,html.dark{${vars(light)}color-scheme:light}}`,
  ].join("\n");
}
