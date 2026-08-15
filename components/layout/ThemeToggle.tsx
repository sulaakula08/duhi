"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const THEME_STORAGE_KEY = "eldea-theme";

/**
 * Выполняется до первой отрисовки и проставляет `data-theme` на <html>,
 * чтобы тема не мигала. Сохранённый выбор важнее системной настройки.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', stored || system);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Режим инкогнито: переключатель всё равно работает в пределах сессии.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-300 hover:text-accent",
        className,
      )}
    >
      {/* Иконка появляется только после того, как клиент узнал тему, — иначе
          на первом кадре она противоречила бы странице. */}
      {theme === null ? (
        <span className="h-4 w-4" />
      ) : theme === "dark" ? (
        <Sun size={17} aria-hidden="true" />
      ) : (
        <Moon size={17} aria-hidden="true" />
      )}
    </button>
  );
}
