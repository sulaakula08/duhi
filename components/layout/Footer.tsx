import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Newsletter } from "@/components/sections/Newsletter";
import { footerNav } from "./nav";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line bg-surface">
      <Newsletter />

      <div className="container-x grid gap-12 border-t border-line py-16 md:grid-cols-[1.4fr_1fr_1fr] md:gap-16">
        <div>
          <Logo className="text-xl" />
          <p className="mt-5 max-w-xs text-[0.92rem] text-muted">
            Магазин парфюмерии. Четырнадцать ароматов для женщин и мужчин,
            в объёмах 30, 50 и 100 мл.
          </p>
        </div>

        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="label-xs text-muted">{group.title}</h2>
            <ul className="mt-5 space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.92rem] text-ink underline-offset-4 transition-colors duration-300 hover:text-accent hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container-x flex flex-col gap-3 border-t border-line py-7 text-[0.78rem] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Eldea</p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            Демонстрационный магазин: заказы не собираются, оплата не проводится.
          </span>
          {/* Неприметная, но не спрятанная: страница всё равно под паролем. */}
          <Link
            href="/admin"
            className="underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            Админка
          </Link>
        </p>
      </div>
    </footer>
  );
}
