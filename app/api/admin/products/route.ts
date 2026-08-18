import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/admin/auth";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  resetProduct,
  restoreProduct,
  updateProduct,
} from "@/lib/data/store";

const draftSchema = z.object({
  name: z.string().trim().min(2, "Укажите название."),
  subtitle: z.string().trim().min(2, "Укажите короткое описание."),
  description: z.string().trim().min(10, "Опишите аромат подробнее."),
  gender: z.enum(["women", "men", "unisex"]),
  family: z.enum(["floral", "woody", "oriental", "fresh", "gourmand"]),
  price30: z.coerce.number().min(1).max(100000),
  price50: z.coerce.number().min(1).max(100000),
  price100: z.coerce.number().min(1).max(100000),
  notesTop: z.string().trim().default(""),
  notesHeart: z.string().trim().default(""),
  notesBase: z.string().trim().default(""),
  story: z.string().trim().default(""),
  photo: z.string().trim().optional(),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(true),
});

/** Обновляем страницы, которые читают каталог, иначе они останутся из кеша. */
function revalidateCatalogue() {
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/collections/[gender]", "page");
  revalidatePath("/products/[slug]", "page");
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нет доступа." }, { status: 401 });
  }
  return NextResponse.json({ products: await getAdminProducts() });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нет доступа." }, { status: 401 });
  }

  const parsed = draftSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Проверьте поля." },
      { status: 400 },
    );
  }

  const product = await createProduct(parsed.data);
  revalidateCatalogue();
  return NextResponse.json({ product }, { status: 201 });
}

/** Правка существующего товара, снятие скрытия и сброс правок. */
export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нет доступа." }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const action = url.searchParams.get("action");
  if (!id) return NextResponse.json({ error: "Не указан id." }, { status: 400 });

  if (action === "restore") {
    const ok = await restoreProduct(id);
    if (!ok) return NextResponse.json({ error: "Товар не скрыт." }, { status: 404 });
    revalidateCatalogue();
    return NextResponse.json({ ok: true });
  }

  if (action === "reset") {
    const ok = await resetProduct(id);
    if (!ok) return NextResponse.json({ error: "Правок нет." }, { status: 404 });
    revalidateCatalogue();
    return NextResponse.json({ ok: true });
  }

  const parsed = draftSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Проверьте поля." },
      { status: 400 },
    );
  }

  const ok = await updateProduct(id, parsed.data);
  if (!ok) return NextResponse.json({ error: "Товар не найден." }, { status: 404 });

  revalidateCatalogue();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нет доступа." }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Не указан id." }, { status: 400 });

  const removed = await deleteProduct(id);
  if (!removed) return NextResponse.json({ error: "Товар не найден." }, { status: 404 });

  revalidateCatalogue();
  return NextResponse.json({ ok: true });
}
