import Link from "next/link";
import { forwardRef } from "react";

export type ButtonVariant = "primary" | "accent" | "secondary" | "quiet" | "danger" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary-fill text-white hover:bg-primary-hover",
  accent: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "border border-line bg-surface text-ink hover:border-ink/30 hover:bg-surface-muted",
  quiet: "text-primary hover:bg-primary-soft",
  danger: "border border-danger/30 bg-surface text-danger hover:bg-danger-soft",
  inverse: "border border-white/35 text-white hover:bg-white/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-[0.95rem]",
  lg: "h-12 px-6 text-base",
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
