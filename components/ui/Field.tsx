import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full min-h-12 rounded-none border-0 border-b border-line bg-transparent px-0 py-3 " +
  "text-[0.98rem] text-ink placeholder:text-muted/60 " +
  "transition-colors duration-300 focus:border-accent focus:outline-none " +
  "aria-[invalid=true]:border-feminine";

export function Field({
  label,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="label-xs text-muted">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error ? (
        <span role="alert" className="mt-2 block text-[0.78rem] text-feminine">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-2 block text-[0.78rem] text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({ className, ...rest }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...rest} />;
}

export function Textarea({ className, ...rest }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-32 resize-y", className)} {...rest} />;
}
