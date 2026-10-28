/** Passport mark: a green card with a saw-tooth factory roofline and an orange stamp. */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="2" y="2" width="36" height="36" rx="8" fill="var(--color-primary)" />
      <path d="M8 28V18l6 4v-4l6 4v-4l6 4V12h6v16z" fill="#fff" />
      <circle cx="31" cy="9" r="4.5" fill="var(--color-accent)" />
    </svg>
  );
}
