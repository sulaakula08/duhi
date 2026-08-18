/**
 * Простая защита админки паролем.
 *
 * Пароль берётся из переменной окружения ADMIN_PASSWORD. Cookie ставится
 * httpOnly, поэтому из JavaScript её не прочитать.
 *
 * Честно про уровень защиты: это один общий пароль, без учётных записей, без
 * ограничения числа попыток и без двухфакторности. Для витрины, которая крутится
 * локально или на своём сервере за VPN, этого достаточно. Прежде чем выставлять
 * админку в открытый интернет, поставьте нормальную аутентификацию.
 */

import { cookies } from "next/headers";

export const ADMIN_COOKIE = "eldea_admin";

function secret(): string {
  return process.env.ADMIN_PASSWORD || "eldea";
}

/** Сравнение за постоянное время: не даём подобрать пароль по задержке ответа. */
function sameSecret(candidate: string): boolean {
  const a = candidate;
  const b = secret();
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isValidPassword(candidate: string): boolean {
  return sameSecret(candidate);
}

/** Значение, которое кладём в cookie. Сам пароль туда не попадает. */
export function sessionValue(): string {
  return Buffer.from(`ok:${secret()}`).toString("base64");
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === sessionValue();
}
