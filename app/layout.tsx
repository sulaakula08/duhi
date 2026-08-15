import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { themeInitScript } from "@/components/layout/ThemeToggle";
import "@/styles/globals.css";

// Кириллица подключается явно — иначе заголовки уедут в системный шрифт.
const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-display-family",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans-family",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eldea.example"),
  title: {
    default: "Eldea — магазин парфюмерии",
    template: "%s — Eldea",
  },
  description:
    "Парфюмерия для женщин и мужчин: четырнадцать ароматов в объёмах 30, 50 и 100 мл. Доставка от €120 бесплатно, два пробника к каждому заказу.",
  openGraph: {
    type: "website",
    siteName: "Eldea",
    locale: "ru_RU",
    title: "Eldea — магазин парфюмерии",
    description:
      "Четырнадцать ароматов для женщин и мужчин. Объёмы 30, 50 и 100 мл, доставка от €120 бесплатно.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* Выполняется до первой отрисовки, чтобы тема не мигала. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-200 focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-[0.8rem] focus:text-accent-contrast"
        >
          К основному содержанию
        </a>

        <SmoothScroll />
        <Header />

        <main id="main">{children}</main>

        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
