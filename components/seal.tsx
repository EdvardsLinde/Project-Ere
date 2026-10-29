import { useId } from "react";
import { S_PATH } from "@/components/logo";

/**
 * Round certificate seal: text along the top and bottom of the ring, the SEER "S"
 * in the middle and two orange ribbon tails. Decorative (aria-hidden).
 */
export function Seal({
  top,
  bottom,
  year,
  className = "size-28",
  ribbons = true,
}: {
  top: string;
  bottom: string;
  year?: string | number;
  className?: string;
  ribbons?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const font = { fontFamily: "var(--font-sans)" };
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      {ribbons && (
        <g fill="var(--color-accent)">
          <path d="M38 92 L26 136 L40 128 L48 138 L56 98 Z" />
          <path d="M82 92 L94 136 L80 128 L72 138 L64 98 Z" />
        </g>
      )}
      <circle cx="60" cy="60" r="56" fill="var(--color-primary-fill)" />
      <circle cx="60" cy="60" r="51" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="0.8" />
      <circle cx="60" cy="60" r="34" fill="#fff" />
      <defs>
        {/* Top arc runs left→right over the top; bottom arc left→right under the bottom so both read upright. */}
        <path id={`top-${id}`} d="M17,60 a43,43 0 0,1 86,0" />
        <path id={`bottom-${id}`} d="M13,60 a47,47 0 0,0 94,0" />
      </defs>
      <text fill="#fff" fontSize="8" fontWeight="800" letterSpacing="1.4" style={font}>
        <textPath href={`#top-${id}`} startOffset="50%" textAnchor="middle">
          {top.toUpperCase()}
        </textPath>
      </text>
      <text fill="#fff" fontSize="8" fontWeight="800" letterSpacing="1.4" style={font}>
        <textPath href={`#bottom-${id}`} startOffset="50%" textAnchor="middle">
          {bottom.toUpperCase()}
        </textPath>
      </text>
      <circle cx="13" cy="60" r="1.6" fill="var(--color-accent)" />
      <circle cx="107" cy="60" r="1.6" fill="var(--color-accent)" />
      <g transform="translate(43 40) scale(1.06)">
        <path d={S_PATH} fill="none" stroke="var(--color-primary-fill)" strokeWidth="3.6" strokeLinecap="round" />
      </g>
      {year !== undefined && (
        <text x="60" y="84" textAnchor="middle" fontSize="8" fontWeight="800" fill="var(--color-accent-ink)" style={font}>
          {year}
        </text>
      )}
    </svg>
  );
}
