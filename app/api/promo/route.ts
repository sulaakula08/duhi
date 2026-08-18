import { NextResponse } from "next/server";
import { z } from "zod";
import { checkPromo } from "@/lib/data/store";

const schema = z.object({
  code: z.string().trim().min(1),
  subtotal: z.coerce.number().min(0),
});

/** Публичная проверка промокода на оформлении заказа. */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Введите код." }, { status: 400 });
  }

  const result = await checkPromo(parsed.data.code, parsed.data.subtotal);
  return NextResponse.json(result, { status: result.ok ? 200 : 404 });
}
