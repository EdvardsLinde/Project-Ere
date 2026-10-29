import { Loader2 } from "lucide-react";

export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Card({
  className = "",
  as: As = "div",
  children,
}: {
  className?: string;
  as?: "div" | "section" | "article" | "li";
  children: React.ReactNode;
}) {
  return <As className={`rounded-lg border-2 border-edge bg-surface shadow-card ${className}`}>{children}</As>;
}

export type BadgeTone = "neutral" | "primary" | "accent" | "success" | "warning" | "danger" | "ink";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-muted text-ink-muted",
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent-ink",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  ink: "bg-ink text-bg",
};

export function Badge({
  tone = "neutral",
  className = "",
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border-2 border-edge bg-surface px-3 py-1 text-sm font-semibold text-ink ${className}`}>
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-on-accent ${className}`}>
      {children}
    </p>
  );
}

export function PageHeader({
  title,
  lead,
  actions,
  eyebrow,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b-2 border-edge pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        <h1 className="text-[2rem] font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">{title}</h1>
        {lead && <p className="mt-2 text-lg text-ink-muted">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Loading({ label }: { label: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center gap-3 text-ink-muted" role="status">
      <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function Notice({
  tone = "warning",
  icon,
  children,
  className = "",
}: {
  tone?: "warning" | "primary" | "danger" | "success" | "neutral";
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const map = {
    warning: "border-warning/25 bg-warning-soft text-ink",
    primary: "border-primary/20 bg-primary-soft text-ink",
    danger: "border-danger/25 bg-danger-soft text-ink",
    success: "border-success/25 bg-success-soft text-ink",
    neutral: "border-line bg-surface-muted text-ink",
  } as const;
  return (
    <div className={`flex items-start gap-3 rounded-md border-2 px-4 py-3 text-[0.95rem] ${map[tone]} ${className}`}>
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  text?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-edge/40 bg-surface px-6 py-12 text-center">
      {icon && <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-accent text-on-accent">{icon}</div>}
      <p className="font-display text-xl font-extrabold text-ink">{title}</p>
      {text && <p className="mt-1 max-w-md text-ink-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ExternalLink({
  href,
  children,
  className = "",
  newTabLabel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  newTabLabel: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`font-semibold text-primary underline-offset-2 hover:underline ${className}`}>
      {children}
      <span className="sr-only"> {newTabLabel}</span>
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}
