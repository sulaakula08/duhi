import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isCurrency } from "@/lib/data/currency";
import { getSettings, setCurrency } from "@/lib/data/store";

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нет доступа." }, { status: 401 });
  }

  const { currency } = (await request.json()) as { currency?: string };
  if (!currency || !isCurrency(currency)) {
    return NextResponse.json({ error: "Неизвестная валюта." }, { status: 400 });
  }

  const settings = await setCurrency(currency);
  // Валюта раздаётся из корневого layout, поэтому обновляем его целиком.
  revalidatePath("/", "layout");
  return NextResponse.json(settings);
}
