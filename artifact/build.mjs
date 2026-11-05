// Builds the whole app into one self-contained HTML file for previewing
// (e.g. as a claude.ai artifact): `npm run build:artifact -- <out.html>`.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { build } from "esbuild";

const out = resolve(process.argv[2] ?? "artifact/dist/index.html");
mkdirSync(dirname(out), { recursive: true });
const cssFile = `${out}.css`;

execFileSync("npx", ["@tailwindcss/cli", "-i", "app/globals.css", "-o", cssFile, "--minify"], { stdio: "inherit" });

const result = await build({
  entryPoints: ["artifact/entry.tsx"],
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  write: false,
  jsx: "automatic",
  legalComments: "none",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  alias: {
    "next/link": "./artifact/shims/next-link.tsx",
    "next/navigation": "./artifact/shims/next-navigation.ts",
  },
  logLevel: "warning",
});

const js = result.outputFiles[0].text
  .replace(/<\/script/gi, "<\\/script")
  .replace(/<!--/g, "<\\!--");
const css = readFileSync(cssFile, "utf8");

const html = `<title>SEER Expo — Saldus inovāciju izstāde</title>
<meta name="description" content="SEER Expo: trīs dienu lauksaimniecības, mežsaimniecības un loģistikas inovāciju izstāde Saldū. Demo versija.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400..800&display=swap">
<style>${css}
/* Preview host: keep the sticky header and bottom bars clear of phone system bars. */
header.sticky{top:env(safe-area-inset-top,0px)}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:41;background:var(--color-surface)}
.fixed.bottom-0{padding-bottom:calc(.75rem + env(safe-area-inset-bottom,0px))}
</style>
<div id="root"></div>
<script>${js}</script>
`;
writeFileSync(out, html);
console.log(`Wrote ${out} (${(html.length / 1024).toFixed(0)} KB)`);
