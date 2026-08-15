import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "muted";
  className?: string;
}) {
  const tones = {
    neutral: "border-line text-ink",
    accent: "border-accent text-accent",
    muted: "border-line text-muted",
  } as const;

  return (
    <span
      className={cn(
        "label-xs inline-flex items-center rounded-full border px-2.5 py-1.5",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
