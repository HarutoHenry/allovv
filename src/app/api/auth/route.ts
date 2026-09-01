import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  isConfigured,
  sessionValue,
  verifyPassword,
} from "@/lib/analytics/auth";

export const runtime = "nodejs";

/** 管理画面の出入り。フォームから POST で来る（out=1 のときは退出） */
export async function POST(request: Request) {
  const form = await request.formData();

  if (form.get("out")) {
    const out = NextResponse.redirect(new URL("/admin/login", request.url), 303);
    out.cookies.delete(SESSION_COOKIE);
    return out;
  }

  if (!isConfigured()) {
    return NextResponse.redirect(new URL("/admin/login?error=setup", request.url), 303);
  }

  if (!verifyPassword(String(form.get("password") ?? ""))) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/admin/analytics", request.url), 303);
  response.cookies.set(SESSION_COOKIE, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
