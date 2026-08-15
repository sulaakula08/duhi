import { cn } from "@/lib/utils";

/**
 * The Eldea wordmark.
 *
 * Hand-authored SVG — the letterforms are live text set in the house display
 * serif so they stay crisp at any size and inherit `currentColor`, which is what
 * lets the logo invert with the theme. There is no raster asset anywhere in the
 * brand system. To lock the wordmark against font substitution, convert this
 * `<text>` to outlines in a vector editor and paste the paths in its place; the
 * component's API does not change.
 */
export function Wordmark({
  className,
  title = "Eldea",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 300 48"
      role="img"
      aria-label={title}
      className={cn("h-[1.15em] w-auto overflow-visible", className)}
      fill="currentColor"
    >
      <text
        x="150"
        y="34"
        textAnchor="middle"
        fontFamily="var(--font-display-family), Georgia, serif"
        fontSize="34"
        fontWeight="300"
        letterSpacing="9.5"
        /* The tracking adds trailing space after the final letter; nudge the
           whole string left by half of it so the mark reads optically centred. */
        transform="translate(-4.75 0)"
      >
        ELDEA
      </text>
    </svg>
  );
}
