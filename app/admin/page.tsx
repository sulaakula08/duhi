import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { isAuthenticated } from "@/lib/admin/auth";
import { getAdminProducts, getPromos } from "@/lib/data/store";

export const metadata: Metadata = {
  title: "Админка",
  robots: { index: false, follow: false },
};

// Страница зависит от cookie и от файлов на диске — кешировать нечего.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) return <AdminLogin />;

  const [products, promos] = await Promise.all([getAdminProducts(), getPromos()]);

  return <AdminDashboard products={products} promos={promos} />;
}
