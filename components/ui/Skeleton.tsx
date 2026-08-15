import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-sm bg-surface-2", className)}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
