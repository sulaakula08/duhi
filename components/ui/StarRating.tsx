import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  reviewCount,
  className,
}: {
  rating: number;
  reviewCount?: number;
  className?: string;
}) {
  const rounded = Math.round(rating);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={13}
            className={i <= rounded ? "fill-accent text-accent" : "text-line"}
          />
        ))}
      </span>
      {/* The numeric value carries the meaning; the stars are decoration, so the
          rating is never communicated by colour alone. */}
      <span className="text-[0.8rem] text-muted">
        {rating.toFixed(1)}
        {reviewCount !== undefined && (
          <span className="sr-only"> out of 5, from {reviewCount} reviews</span>
        )}
        {reviewCount !== undefined && (
          <span aria-hidden="true"> · {reviewCount} reviews</span>
        )}
      </span>
    </div>
  );
}
