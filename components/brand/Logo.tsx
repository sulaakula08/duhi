import { cn } from "@/lib/utils";
import { Wordmark } from "./Wordmark";

/**
 * The house mark: a thin ring bisected by a vertical rule — a bottle neck read
 * from above. Drawn by hand in SVG primitives, stroked in `currentColor`.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-[1.05em] w-[1.05em]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <circle cx="12" cy="12" r="9.25" />
      <line x1="12" y1="1.5" x2="12" y2="22.5" />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Logo({
  className,
  showMark = true,
}: {
  className?: string;
  showMark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
      {showMark && <Mark className="text-accent" />}
      <Wordmark className="h-[0.95em]" />
    </span>
  );
}
