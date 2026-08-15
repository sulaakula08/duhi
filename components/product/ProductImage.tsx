import Image from "next/image";
import { useId } from "react";
import type { BottleArt } from "@/lib/data/products";
import { cn } from "@/lib/utils";

/**
 * Product imagery.
 *
 * Eldea ships hand-drawn SVG bottles rather than stock photography: the shapes
 * and glass tints are authored per fragrance in `products.ts`, so the catalogue
 * is visually cohesive and nothing depends on a remote image host.
 *
 * To move to real photography, replace the body of this component with
 * `next/image` and add the host to `images.remotePatterns` in next.config.ts —
 * every call site already passes a `product.art` + `alt` pair and nothing else.
 */

export type BottleView = "bottle" | "angle" | "detail" | "still";

const BODY_PATHS: Record<BottleArt["shape"], string> = {
  // Tall, narrow, architectural.
  tall: "M148 176 h104 a8 8 0 0 1 8 8 v250 a10 10 0 0 1 -10 10 h-100 a10 10 0 0 1 -10 -10 v-250 a8 8 0 0 1 8 -8 z",
  // Wide with generous shoulders.
  rounded:
    "M200 172 c48 0 74 26 74 74 v134 c0 40 -26 64 -74 64 s-74 -24 -74 -64 v-134 c0 -48 26 -74 74 -74 z",
  // Cut-glass octagon.
  faceted: "M158 174 h84 l32 34 v198 l-32 38 h-84 l-32 -38 v-198 z",
  // Squat apothecary flask.
  flask:
    "M200 176 c58 0 86 40 86 96 v96 c0 48 -30 76 -86 76 s-86 -28 -86 -76 v-96 c0 -56 28 -96 86 -96 z",
};

const VIEW_TRANSFORM: Record<BottleView, string> = {
  bottle: "translate(0 0)",
  angle: "rotate(-7 200 320) translate(0 -4)",
  detail: "scale(1.85) translate(-92 -108)",
  still: "rotate(4 200 320) translate(0 6)",
};

export function ProductImage({
  art,
  alt,
  view = "bottle",
  className,
  showGround = true,
  photo,
  priority = false,
}: {
  art: BottleArt;
  alt: string;
  view?: BottleView;
  className?: string;
  showGround?: boolean;
  /**
   * Path to a real photograph, e.g. "/products/vesper-bloom-1.jpg".
   * Drop files into `public/products/` and list them on the product's `photos`
   * array — this component then uses them instead of the drawn bottle.
   */
  photo?: string;
  priority?: boolean;
}) {
  const uid = useId().replace(/:/g, "");

  if (photo) {
    return (
      /**
       * Подложка следует теме. Раньше здесь стоял постоянный светлый прямоугольник:
       * заливка при вырезании затекала внутрь прозрачного стекла, флакон
       * оставался пустым и на тёмном фоне выглядел чёрным. Теперь силуэт
       * заполняется целиком (scripts/cutout.mjs), стекло сохраняет свои светлые
       * пиксели и нормально читается на любом фоне.
       */
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <Image
          src={photo}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-contain p-[6%]"
        />
      </div>
    );
  }
  const glass = `glass-${uid}`;
  const sheen = `sheen-${uid}`;
  const capGrad = `cap-${uid}`;
  const halo = `halo-${uid}`;
  const clip = `clip-${uid}`;

  const body = BODY_PATHS[art.shape];

  return (
    <svg
      viewBox="0 0 400 520"
      /* An empty `alt` marks the bottle as decorative — used where a nearby
         label already names the product (thumbnails, cart lines). */
      {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={art.from} />
          <stop offset="55%" stopColor={art.to} />
          <stop offset="100%" stopColor={art.to} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={capGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={art.cap} stopOpacity="0.75" />
          <stop offset="42%" stopColor={art.cap} />
          <stop offset="100%" stopColor={art.cap} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={halo} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor={art.from} stopOpacity="0.5" />
          <stop offset="100%" stopColor={art.from} stopOpacity="0" />
        </radialGradient>
        <clipPath id={clip}>
          <path d={body} />
        </clipPath>
      </defs>

      {showGround && <rect width="400" height="520" fill={`url(#${halo})`} />}

      <g transform={VIEW_TRANSFORM[view]}>
        {/* Contact shadow */}
        <ellipse cx="200" cy="452" rx="92" ry="13" fill={art.cap} opacity="0.16" />

        {/* Neck and collar */}
        <rect x="184" y="118" width="32" height="66" fill={`url(#${glass})`} opacity="0.9" />
        <rect x="178" y="150" width="44" height="9" rx="2" fill={art.cap} opacity="0.55" />

        {/* Cap */}
        <rect x="172" y="74" width="56" height="52" rx="4" fill={`url(#${capGrad})`} />
        <rect x="172" y="74" width="56" height="7" rx="3" fill="#fff" opacity="0.22" />

        {/* Body */}
        <path d={body} fill={`url(#${glass})`} />

        {/* Liquid level — a slightly deeper tint in the lower two-thirds */}
        <g clipPath={`url(#${clip})`}>
          <rect x="100" y="268" width="200" height="200" fill={art.to} opacity="0.42" />
          <rect x="100" y="264" width="200" height="4" fill="#fff" opacity="0.18" />
          {/* Vertical highlight down the left face */}
          <rect x="128" y="150" width="46" height="320" fill={`url(#${sheen})`} />
        </g>

        {/* Glass edge */}
        <path d={body} fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.25" />

        {/* Label plate */}
        <rect
          x="164"
          y="330"
          width="72"
          height="26"
          rx="1"
          fill="#fff"
          opacity="0.14"
          stroke="#fff"
          strokeOpacity="0.22"
          strokeWidth="0.75"
        />
      </g>
    </svg>
  );
}
