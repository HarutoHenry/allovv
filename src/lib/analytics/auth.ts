import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "allovv_admin";

/** 合言葉。未設定なら管理画面は開かない（本番で誤って公開しないため） */
function password() {
  return process.env.ANALYTICS_PASSWORD ?? "";
}

export function isConfigured() {
  return password().length > 0;
}

/** 合言葉そのものではなく、それを鍵にした固定文字列のHMACをcookieに入れる */
function token() {
  return createHmac("sha256", password()).update("allovv-analytics-v1").digest("hex");
}

function sameToken(candidate: string) {
  const expected = Buffer.from(token());
  const given = Buffer.from(candidate);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function verifyPassword(input: string) {
  const expected = Buffer.from(password());
  const given = Buffer.from(input);
  return (
    isConfigured() && expected.length === given.length && timingSafeEqual(expected, given)
  );
}

export function sessionValue() {
  return token();
}

export async function isSignedIn() {
  if (!isConfigured()) return false;
  const value = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  return value.length > 0 && sameToken(value);
}
