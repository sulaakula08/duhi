"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { spring, transition } from "@/lib/motion";
import { cartCount, useCartStore, useHydratedCart } from "@/lib/store/cart";
import { cn } from "@/lib/utils";
import { AdminLink } from "./AdminLink";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { primaryNav } from "./nav";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const openCart = useCartStore((s) => s.open);
  const { lines, hydrated } = useHydratedCart();
  const count = cartCount(lines);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-90 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-line bg-bg/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-x flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label="Eldea — главная" className="shrink-0">
            <Logo className="text-lg" />
          </Link>

          <nav aria-label="Основная навигация" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {primaryNav.map((link) => {
                const active =
                  link.href === "/collections"
                    ? pathname === "/collections"
                    : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className="group relative block py-2 text-[0.82rem] text-ink transition-colors duration-300 hover:text-accent"
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            {/* На узком экране не помещается — там вход через меню. */}
            <AdminLink className="hidden sm:inline-flex" />
            <ThemeToggle />

            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-300 hover:text-accent"
              aria-label={
                hydrated && count > 0 ? `Открыть корзину, товаров: ${count}` : "Открыть корзину, пусто"
              }
            >
              <ShoppingBag size={18} aria-hidden="true" />
              <AnimatePresence>
                {hydrated && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={spring}
                    className="absolute -right-0.5 -top-0.5 flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full bg-accent px-1 text-[0.62rem] font-medium tabular-nums text-accent-contrast"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Открыть меню"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-300 hover:text-accent lg:hidden"
            >
              <Menu size={19} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Волосяная линия, которая прочерчивается, когда страница уходит вверх. */}
        <motion.div
          aria-hidden="true"
          className="h-px origin-left bg-accent/30"
          initial={false}
          animate={{ scaleX: scrolled ? 1 : 0 }}
          transition={transition.expressive}
        />
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
