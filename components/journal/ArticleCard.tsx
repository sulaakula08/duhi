import Link from "next/link";
import type { Article } from "@/lib/data/journal";
import { formatArticleDate } from "@/lib/data/journal";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group">
      <Link href={`/journal/${article.slug}`} className="block">
        {/* Цветная плашка вместо фотографии: журнал держится на тексте. */}
        <div
          aria-hidden="true"
          className="relative aspect-[3/2] overflow-hidden rounded-sm bg-surface"
        >
          <div
            className="absolute inset-0 opacity-[0.18] transition-opacity duration-700 group-hover:opacity-30"
            style={{ backgroundColor: article.tint }}
          />
          <div className="absolute inset-0 flex items-end p-6">
            <span className="font-display text-6xl font-light leading-none text-ink/25 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
              {article.category}
            </span>
          </div>
        </div>

        <p className="label-xs mt-5 text-muted">
          {formatArticleDate(article.date)} · {article.readingMinutes} мин
        </p>
        <h3 className="mt-3 font-display text-2xl font-light leading-tight transition-colors duration-300 group-hover:text-accent">
          {article.title}
        </h3>
        <p className="mt-2 text-[0.92rem] text-muted">{article.excerpt}</p>
      </Link>
    </article>
  );
}
