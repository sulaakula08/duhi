import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[0.06em] uppercase " +
  "transition-[background-color,color,border-color,transform,opacity] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45 select-none";

const variants: Record<Variant, string> = {
  solid: "bg-accent text-accent-contrast hover:bg-ink",
  ghost: "border border-line text-ink hover:border-accent hover:text-accent",
  quiet: "text-muted hover:text-accent",
};

// Minimum 44px touch target on every size.
const sizes: Record<Size, string> = {
  sm: "min-h-11 px-4 text-[0.7rem]",
  md: "min-h-11 px-6 text-[0.74rem]",
  lg: "min-h-[3.25rem] px-8 text-[0.78rem]",
};

function classes(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function Button({
  variant = "solid",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function ButtonLink({
  variant = "solid",
  size = "md",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={classes(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
