import Link from "next/link";
import { forwardRef } from "react";

export type ButtonVariant = "primary" | "accent" | "secondary" | "quiet" | "danger" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-mono font-semibold uppercase tracking-[0.03em] transition duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 select-none";

/** Square block buttons with a thin border in the grid-line colour, monospace capitals. They press in slightly on click. */
const press = "active:translate-y-px";

const variants: Record<ButtonVariant, string> = {
  primary: `${press} border border-rule bg-primary-fill text-white hover:bg-primary-hover`,
  accent: `${press} border border-rule bg-accent text-on-accent hover:bg-accent-hover`,
  secondary: `${press} border border-rule bg-transparent text-ink hover:bg-surface`,
  quiet: "text-primary hover:bg-primary-soft",
  danger: "border border-danger/50 bg-surface text-danger hover:border-danger hover:bg-danger-soft",
  inverse: "border border-white/70 text-white hover:border-white hover:bg-white/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[0.75rem]",
  md: "h-11 px-5 text-[0.8rem]",
  lg: "h-13 px-6 text-[0.86rem]",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = "") {
  const wrap = extra.includes("whitespace-normal") ? "" : "whitespace-nowrap";
  return `${base} ${wrap} ${variants[variant]} ${sizes[size]} ${extra}`;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props} />;
});

type LinkButtonProps = React.ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize };

export function LinkButton({ variant = "primary", size = "md", className = "", ...props }: LinkButtonProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
