import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root — a stray lockfile above this directory would
  // otherwise make Turbopack infer the user's home directory. Dev and build
  // both run from the project root, so cwd is the correct anchor.
  turbopack: { root: process.cwd() },
  // Product imagery is hand-authored SVG today (components/product/ProductImage.tsx).
  // Add photography hosts here when swapping in real assets.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
