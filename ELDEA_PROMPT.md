# Project: **Eldea** — Modern Perfume E-Commerce Website

> Build prompt. Paste into a fresh agent session.

Build a complete, production-quality marketing + e-commerce front end for a fictional luxury-but-approachable fragrance house called **Eldea**. Eldea sells its own line of perfumes for **women, men, and unisex**. The site must feel like a design-award submission: editorial, tactile, and quietly expensive — not a generic Shopify template.

## 1. Tech stack (non-negotiable)

- **Next.js 15** (App Router, TypeScript, strict mode), React 19, Server Components by default; `"use client"` only where interaction/motion requires it.
- **Tailwind CSS v4** with a custom theme layer (CSS variables for the full palette, spacing, radii, easing curves). No inline hex values in components — everything through design tokens.
- **Motion** (`motion/react`, the successor to Framer Motion) for animation. Prefer `transform`/`opacity` so animation stays off the main thread.
- **Lenis** for smooth scrolling, wired so it does not fight native focus/anchor behavior.
- **Zustand** for the cart store, persisted to `localStorage` with hydration-safe mounting (no SSR mismatch flashes).
- **next/image** for every image; **next/font** with `display: swap` for fonts.
- **Zod** for form validation. **Vitest + React Testing Library** for unit tests, **Playwright** for two smoke E2E flows.
- No CMS and no real payment provider. Product data lives in a typed local module (`lib/data/products.ts`) shaped so it could later be swapped for a CMS/API without touching components. Checkout is a realistic simulated flow ending on a confirmation screen.

## 2. Brand identity — read this carefully

**Name:** Eldea. **Tagline:** *"Scent, remembered."*
**Positioning:** modern minimalism with a warm, dusk-lit soul — a quiet gallery at golden hour, not a duty-free counter.

### HARD CONSTRAINT — no AI-generated logo, no AI-generated icons

- The **logo** must be a hand-authored SVG **wordmark**: the letters "ELDEA" set in a serif or high-contrast display typeface, converted to clean paths or rendered as live text with tight, deliberate letter-spacing (`0.28em`). Optionally add one minimal geometric mark — a single stroked circle, an ellipse, or a thin vertical rule — drawn by hand in SVG primitives. It must be a real, editable `<svg>` component (`components/brand/Logo.tsx`) using `currentColor` so it inverts with the theme. **Do not generate, embed, or reference a raster image of a logo. Do not invent a decorative emblem or mascot.**
- **Icons** come from an established open-source set — **Lucide React** (preferred) or Phosphor Icons. Import individual icons; never a full-bundle import. Do not draw improvised icon paths, and do not use emoji as icons anywhere in the UI.
- **Product and editorial imagery:** use placeholder sources with fixed seeds and correct aspect ratios, wrapped in a single `<ProductImage>` component so swapping in real photography is a one-file change. Every image needs meaningful `alt` text. Configure `next.config.ts` `images.remotePatterns` accordingly.

### Color palette (CSS variables, light + dark)

| Token | Light | Role |
|---|---|---|
| `--bg` | `#FAF8F5` warm bone | page ground |
| `--surface` | `#F2EDE6` | cards, panels |
| `--ink` | `#171310` | primary text |
| `--muted` | `#6B615A` | secondary text |
| `--accent` | `#8B6F47` antique gold | CTAs, underlines, focus |
| `--accent-soft` | `#C9B896` | hovers, dividers |
| `--feminine` | `#C48B8B` dusty rose | women's collection accent |
| `--masculine` | `#4A5C5A` deep pine | men's collection accent |

Dark theme inverts to a near-black `#0E0C0B` ground with the same gold accent. The theme toggle persists and respects `prefers-color-scheme`.

### Typography

A display serif for headings (Cormorant Garamond, Playfair Display, or Fraunces) at generous sizes with tight tracking; a clean geometric sans for UI and body (Inter, Satoshi, or Geist). Body copy at `1.0625rem`/`1.7`. Fluid type via `clamp()`. Uppercase micro-labels at `0.72rem` with `0.18em` tracking.

## 3. Pages and routes

```
/                        Home
/collections             All fragrances (filterable grid)
/collections/women       Women's — dusty rose accent
/collections/men         Men's — deep pine accent
/collections/unisex      Unisex
/products/[slug]         Product detail
/about                   The house / story
/journal                 Editorial notes (3–4 static articles)
/journal/[slug]          Article
/cart                    Cart
/checkout                Simulated multi-step checkout
/checkout/confirmation   Order confirmation
/contact                 Contact form
```

Plus `not-found.tsx`, `error.tsx`, and `loading.tsx` for each route segment, and `sitemap.ts` + `robots.ts`.

## 4. Page-by-page requirements

### Home

1. **Hero** — full-viewport. Large display-serif headline animating in by masked line reveal (each line clipped by an `overflow-hidden` wrapper, translating up with a `[0.16, 1, 0.3, 1]` ease, 80ms stagger). A single hero bottle image with slow scroll parallax (max 12% travel). Two CTAs: "Explore the collection" (solid) and "Discover your scent" (ghost). A subtle animated scroll cue at the bottom.
2. **Featured trio** — three signature fragrances in a staggered, non-uniform grid; cards lift `-6px` and their image scales `1.04` on hover over 500ms ease-out.
3. **Olfactory notes strip** — horizontal-scroll section pinned on desktop, revealing top / heart / base notes as the user scrolls. Falls back to a stacked layout under 768px and under `prefers-reduced-motion`.
4. **The two houses** — a split 50/50 panel, Women's left, Men's right. Hovering one expands it to 60% while the other recedes, with a slow background crossfade. Tap-to-navigate on mobile; no hover dependency.
5. **Editorial band** — a full-bleed brand statement with a text-mask reveal tied to scroll progress (words fade from `--muted` to `--ink` sequentially).
6. **Journal preview** — three latest articles.
7. **Newsletter** — validated email capture with an inline success state (checkmark morph, no alert dialogs).

### Collections

Responsive grid (1 / 2 / 3 / 4 columns). Filters for gender, olfactory family (floral, woody, oriental, fresh, gourmand), price range, and size. Sorting by featured / price / newest. Filters live in the URL as searchParams so state is shareable and back-button-safe. Grid items animate in and out with `AnimatePresence` and `layout` when filters change — never a hard re-render flash. Empty state with a "clear filters" action. Skeleton loaders on the initial paint.

### Product detail

- Sticky image gallery on the left (thumbnails, click to swap with a crossfade, zoom-on-hover on desktop); scrollable detail column on the right.
- Name, subtitle, price, star rating, short poetic description.
- **Size selector** (30ml / 50ml / 100ml) updating the price with an animated number transition.
- **Notes pyramid** — an interactive, custom-drawn SVG or CSS diagram of top / heart / base notes; hovering a tier reveals its ingredients. Draw this yourself with real SVG geometry (it is a diagram, not an icon — allowed and encouraged).
- **Intensity meters** — animated bars for longevity, sillage, and warmth that fill when scrolled into view.
- Add to cart with a satisfying micro-interaction: the button label morphs to a checkmark, and the cart badge count springs.
- Accordions for ingredients, shipping, and returns (height-animated, accessible `<button aria-expanded>`).
- "You may also like" — four related fragrances sharing an olfactory family.

### Cart & checkout

Slide-over cart drawer (from the right, backdrop blur, spring transition) plus a full `/cart` page. Quantity steppers with animated totals; removal with a layout-animated exit. Checkout is three steps (contact → shipping → payment) in a single route with an animated step indicator and directional slide transitions. Validate with Zod + react-hook-form.

**The payment step is clearly a simulation** — a labeled demo form that accepts only obvious test values (e.g. `4242 4242 4242 4242`), with visible copy stating that no real payment is processed and no real card details should be entered.

## 5. Motion specification

Define a shared motion vocabulary in `lib/motion.ts` and use it everywhere — no ad-hoc durations scattered through components.

- **Easing:** `easeOut = [0.16, 1, 0.3, 1]`, `easeInOut = [0.65, 0, 0.35, 1]`, spring for physical elements `{ type: "spring", stiffness: 300, damping: 30 }`.
- **Durations:** micro 150ms, standard 400ms, expressive 700ms, ambient 1200ms. Nothing over 1.2s.
- **Page transitions:** a `template.tsx` wrapper doing fade + 12px rise on route change; exit faster than enter (200ms out, 400ms in).
- **Scroll reveals:** a reusable `<Reveal>` component using `whileInView` with `{ once: true, margin: "-80px" }`. Never animate more than ~8 elements at once.
- **Stagger:** 60–90ms between siblings, capped so long lists don't crawl.
- **Hover:** transform and opacity only. Never animate `width`, `height`, `top`, or `left` outside of `layout` animations.
- **Cursor:** an optional custom cursor on `pointer: fine` devices only, scaling up over interactive elements. Disabled on touch and under reduced motion.
- **`prefers-reduced-motion`:** a first-class path, not an afterthought. Transforms collapse to instant or simple opacity, Lenis is disabled, pinned sections become static stacks. Ship a `useReducedMotion` guard in the shared motion helpers so this is enforced in one place.

## 6. Data model

```ts
type Product = {
  id: string; slug: string; name: string; subtitle: string;
  gender: "women" | "men" | "unisex";
  family: "floral" | "woody" | "oriental" | "fresh" | "gourmand";
  description: string; story: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  intensity: { longevity: number; sillage: number; warmth: number }; // 0–100
  sizes: { ml: 30 | 50 | 100; price: number; sku: string }[];
  images: { src: string; alt: string }[];
  rating: number; reviewCount: number;
  featured: boolean; isNew: boolean; inStock: boolean;
};
```

Author **12–16 products** with genuinely distinct, evocative names and copy (e.g. *Vesper Bloom*, *Cendre*, *Île Blanche*, *Noir Vétiver*) — spread across all three genders and all five families, with realistic prices (€85–€240) and hand-written note lists. No lorem ipsum anywhere on the site.

## 7. Quality bar

- **Accessibility:** semantic landmarks, a skip link, visible `--accent` focus rings on every interactive element, full keyboard operability (drawer traps focus and closes on Escape), correct ARIA on accordions/tabs/dialogs, ≥4.5:1 contrast for body text in both themes, and no information conveyed by color alone.
- **Performance:** Lighthouse ≥95 on performance and accessibility. LCP image priority-loaded, everything else lazy. No layout shift (explicit image dimensions). Route-level code splitting; motion-heavy client components dynamically imported.
- **Responsive:** designed at 375 / 768 / 1280 / 1920. Real mobile navigation (full-screen overlay menu with staggered link reveal), 44px minimum touch targets, no hover-only functionality.
- **SEO:** per-route `metadata`, Open Graph images via `opengraph-image.tsx`, JSON-LD `Product` schema on product pages.
- **Code:** small focused components, no file over ~200 lines, no `any`, colocated types, and a `README.md` explaining the token system, the motion vocabulary, and how to swap the product data source.

## 8. Suggested structure

```
app/                     routes, layouts, templates, metadata
components/
  brand/                 Logo.tsx, Wordmark.tsx
  layout/                Header, Footer, MobileMenu, CartDrawer
  product/               ProductCard, Gallery, NotesPyramid, IntensityMeter, SizeSelector
  sections/              Hero, FeaturedTrio, TwoHouses, NotesStrip, Newsletter
  ui/                    Button, Input, Accordion, Badge, Skeleton, Reveal
lib/
  data/products.ts       store/cart.ts       motion.ts       utils.ts
styles/globals.css       tokens + Tailwind theme
```

## 9. Deliver in order

1. Scaffold, tokens, fonts, theme toggle, `Logo.tsx`.
2. Layout shell — header, footer, mobile menu, Lenis, page transitions.
3. Product data + `ProductCard` + collections grid with URL filters.
4. Product detail page with the notes pyramid and intensity meters.
5. Cart store, drawer, cart page, checkout flow.
6. Home page sections with full motion.
7. About, journal, contact.
8. Accessibility + reduced-motion pass, Lighthouse pass, tests, README.

Run the dev server and verify each stage visually before moving to the next. Report anything you deliberately simplified.
