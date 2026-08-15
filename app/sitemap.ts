import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/data/journal";
import { GENDERS, getProducts } from "@/lib/data/products";

const BASE = "https://eldea.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/collections", "/journal", "/contact"].map(
    (path) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const genderRoutes = GENDERS.map((gender) => ({
    url: `${BASE}/collections/${gender}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const productRoutes = getProducts().map((product) => ({
    url: `${BASE}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articleRoutes = getArticles().map((article) => ({
    url: `${BASE}/journal/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...genderRoutes, ...productRoutes, ...articleRoutes];
}
