"use client";

import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Кнопка входа в админку.
 *
 * В покое — только иконка, чтобы не спорить с корзиной и переключателем темы.
 * При наведении и с клавиатуры раскрывается подпись: анимируется max-width,
 * потому что width: auto перехода не даёт.
 */
export function AdminLink({ className }: { className?: string }) {
  return (
    <Link
      href="/admin"
      title="Панель управления"
      className={cn(
        "group/admin inline-flex h-11 items-center rounded-full border border-transparent px-3",
        "text-ink transition-[background-color,border-color,color] duration-500",
        "hover:border-line hover:text-accent focus-visible:border-line focus-visible:text-accent",
        className,
      )}
    >
      <SlidersHorizontal size={17} aria-hidden="true" className="shrink-0" />
      <span
        className={cn(
          "label-xs max-w-0 overflow-hidden whitespace-nowrap opacity-0",
          "transition-[max-width,opacity,margin] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "group-hover/admin:ml-2 group-hover/admin:max-w-24 group-hover/admin:opacity-100",
          "group-focus-visible/admin:ml-2 group-focus-visible/admin:max-w-24 group-focus-visible/admin:opacity-100",
        )}
      >
        Админка
      </span>
    </Link>
  );
}
