import { siteConfig } from "@/config/site";

const vars = (tokens: Record<string, string>) =>
  Object.entries(tokens)
    .map(([k, v]) => `--c-${k}:${v};`)
    .join("");

/**
 * CSS variables for both themes. Shared by the Next.js layout and the
 * single-file preview build — keep this file free of "use client".
 *
 * - `:root` light (the default), `html.dark` dark (set by the header toggle);
 * - printing is always light.
 */
export function themeCss(): string {
  const { light, dark } = siteConfig.theme;
  return [
    `:root{${vars(light)}color-scheme:light}`,
    `html.dark{${vars(dark)}color-scheme:dark}`,
    `@media print{:root,html.dark{${vars(light)}color-scheme:light}}`,
  ].join("\n");
}
