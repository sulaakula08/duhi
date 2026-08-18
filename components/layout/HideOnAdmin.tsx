"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Прячет витринную обвязку (шапку, подвал, корзину) в админке.
 *
 * Отдельный корневой layout потребовал бы разносить весь сайт по route-группам,
 * а здесь достаточно одной проверки пути. Серверные компоненты можно передавать
 * сюда как children — они не становятся клиентскими.
 */
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
