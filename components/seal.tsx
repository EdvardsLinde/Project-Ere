import { useId } from "react";

/**
 * Round certificate seal: ring text, the logo's factory roofline in the middle
 * and two orange ribbon tails. Purely decorative (aria-hidden).
 */
export function Seal({ text, year, className = "size-28", ribbons = true }: { text: string; year?: string | number; className?: string; ribbons?: boolean }) {
  const id = useId().replace(/:/g, "");
  const ring = `${text} · `;
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      {ribbons && (
        <g fill="var(--color-accent)">
          <path d="M38 92 L26 136 L40 128 L48 138 L56 98 Z" />
          <path d="M82 92 L94 136 L80 128 L72 138 L64 98 Z" />
        </g>
      )}
      <circle cx="60" cy="60" r="56" fill="var(--color-primary)" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="60" cy="60" r="34" fill="#fff" />
      <defs>
        <path id={`ring-${id}`} d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
      </defs>
      <text fill="#fff" fontSize="7.4" fontWeight="800" letterSpacing="1" style={{ fontFamily: "var(--font-sans)" }}>
        <textPath href={`#ring-${id}`} textLength="263" lengthAdjust="spacing">
          {ring.toUpperCase()}
        </textPath>
      </text>
      <path d="M41 70V58l6 4v-4l6 4v-4l6 4V48h8v22z" fill="var(--color-primary)" />
      <circle cx="73" cy="46" r="4" fill="var(--color-accent)" />
      {year !== undefined && (
        <text x="60" y="84" textAnchor="middle" fontSize="8" fontWeight="800" fill="var(--color-primary)" style={{ fontFamily: "var(--font-sans)" }}>
          {year}
        </text>
      )}
    </svg>
  );
}
