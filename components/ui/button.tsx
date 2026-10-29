import Link from "next/link";
import { forwardRef } from "react";

export type ButtonVariant = "primary" | "accent" | "secondary" | "quiet" | "danger" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 select-none";

/** Filled and outlined buttons are "stickers": a 2px edge plus a hard shadow that presses in on click. */
const sticker =
  "border-2 border-edge shadow-card hover:-translate-x-px hover:-translate-y-px hover:shadow-pop active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

const variants: Record<ButtonVariant, string> = {
  primary: `${sticker} bg-primary-fill text-white hover:bg-primary-hover`,
  accent: `${sticker} bg-accent text-on-accent hover:bg-accent-hover`,
  secondary: `${sticker} bg-surface text-ink hover:bg-surface-muted`,
  quiet: "text-primary hover:bg-primary-soft",
  danger: "border-2 border-danger/40 bg-surface text-danger hover:border-danger hover:bg-danger-soft",
  inverse: "border-2 border-white/70 text-white hover:border-white hover:bg-white/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
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
