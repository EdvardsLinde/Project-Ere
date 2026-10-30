import { photoSrc } from "@/lib/photos";

/**
 * The whole site sits on a real wheat-field photo (Saldus farming country) under
 * an 88% veil of the page colour, so every text colour keeps at least 4.5:1 even
 * over the brightest part of the photo (checked per pixel, both themes).
 * Fixed behind everything; cards and panels stay solid. Hidden when printing.
 */
export function SiteBackground() {
  return (
    <div aria-hidden="true" className="no-print pointer-events-none fixed inset-0 -z-10">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative background; next/image is not available in the single-file preview */}
      <img src={photoSrc.bgField} alt="" className="size-full select-none object-cover object-bottom" />
      <div className="absolute inset-0 bg-bg/[0.88]" />
    </div>
  );
}
