import { useId } from "react";

/** The "S" letter, drawn as one stroke so it looks the same everywhere (also in public/icon.svg). */
export const S_PATH =
  "M21 10.4C20.2 8.6 18.5 7.6 16.1 7.6C13.4 7.6 11.6 9 11.6 11.2C11.6 13.6 13.7 14.6 16.2 15.3C19.1 16.1 21.3 17.1 21.3 19.9C21.3 22.5 19.2 24.3 16.1 24.3C13.6 24.3 11.7 23.2 10.9 21.1";

/** SEER mark: rounded Saldus-blue tile with a white "S". public/icon.svg is a static copy. */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`seer-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f7fd0" />
          <stop offset="1" stopColor="#003a6d" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#seer-${id})`} />
      <path d={S_PATH} fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}
