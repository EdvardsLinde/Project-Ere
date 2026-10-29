/** The "S" letter, drawn as one stroke so it looks the same everywhere (also in public/icon.svg). */
export const S_PATH =
  "M21 10.4C20.2 8.6 18.5 7.6 16.1 7.6C13.4 7.6 11.6 9 11.6 11.2C11.6 13.6 13.7 14.6 16.2 15.3C19.1 16.1 21.3 17.1 21.3 19.9C21.3 22.5 19.2 24.3 16.1 24.3C13.6 24.3 11.7 23.2 10.9 21.1";

/**
 * SEER mark: an electric-blue rounded tile with a white "S" and a yellow dot,
 * the "eye" that sees where a career can go. public/icon.svg is a static copy.
 */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="10" fill="var(--color-primary-fill)" />
      <path d={S_PATH} fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="25.2" cy="6.8" r="3.6" fill="var(--color-accent)" />
    </svg>
  );
}
