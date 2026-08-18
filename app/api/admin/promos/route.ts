import { NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/admin/auth";
import { createPromo, deletePromo, getPromos, togglePromo } from "@/lib/data/store";

const promoSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Код от трёх символов.")
    .max(24)
    .regex(/^[A-Za-z0-9_-]+$/, "Только латиница, цифры, дефис и подчёркивание."),
  percent: z.coerce.number().min(1, "От 1%.").max(90, "Не больше 90%."),
  minTotal: z.coerce.number().min(0).max(100000).default(0),
});

async function guard() {
  if (await isAuthenticated()) return null;
  return NextResponse.json({ error: "Нет доступа." }, { status: 401 });
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  return NextResponse.json({ promos: await getPromos() });
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const parsed = promoSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Проверьте поля." },
      { status: 400 },
    );
  }

  const promo = await createPromo(parsed.data);
  if (!promo) {
    return NextResponse.json({ error: "Такой код уже есть." }, { status: 409 });
  }
  return NextResponse.json({ promo }, { status: 201 });
}

export async function PATCH(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const code = new URL(request.url).searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Не указан код." }, { status: 400 });

  const promo = await togglePromo(code);
  if (!promo) return NextResponse.json({ error: "Код не найден." }, { status: 404 });
  return NextResponse.json({ promo });
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const code = new URL(request.url).searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Не указан код." }, { status: 400 });

  const removed = await deletePromo(code);
  if (!removed) return NextResponse.json({ error: "Код не найден." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
