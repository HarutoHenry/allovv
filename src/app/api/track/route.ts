import { NextResponse } from "next/server";
import { store } from "@/lib/analytics/store";
import type { ViewEvent } from "@/lib/analytics/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT = /bot|crawler|spider|crawling|slurp|headless|preview|monitor|lighthouse|curl|wget|python-requests|axios|node-fetch|facebookexternalhit|embedly|vercel-screenshot/i;

/** クエリ・ハッシュ・末尾スラッシュを落として、同じページが別行にならないようにする */
function normalizePath(raw: string) {
  const path = raw.split("?")[0].split("#")[0].trim();
  if (!path.startsWith("/")) return "/";
  const trimmed = path.length > 1 ? path.replace(/\/+$/, "") : "/";
  return trimmed.slice(0, 300) || "/";
}

/** 流入元はホスト名だけ残す。自サイト内の移動は "direct" 扱い */
function normalizeRef(raw: string, host: string) {
  if (!raw) return "direct";
  try {
    const url = new URL(raw);
    if (url.hostname === host || url.hostname === `www.${host}` || `www.${url.hostname}` === host) {
      return "direct";
    }
    return url.hostname.replace(/^www\./, "").slice(0, 120);
  } catch {
    return "direct";
  }
}

function deviceFrom(ua: string): ViewEvent["device"] {
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "tablet";
  if (/mobi|iphone|android.*mobile|phone/i.test(ua)) return "mobile";
  return "desktop";
}

/** 端末側で作ったIDが想定外に長い・変な文字を含む場合に備えて丸める */
function safeId(raw: unknown) {
  return String(raw ?? "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64);
}

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || BOT.test(ua)) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const visitor = safeId(body.visitor);
  const session = safeId(body.session);
  if (!visitor || !session) return new NextResponse(null, { status: 204 });

  const host = new URL(request.url).hostname.replace(/^www\./, "");
  const event: ViewEvent = {
    ts: new Date().toISOString(),
    path: normalizePath(String(body.path ?? "/")),
    ref: normalizeRef(String(body.ref ?? ""), host),
    visitor,
    session,
    entry: body.entry === true,
    device: deviceFrom(ua),
    country: (request.headers.get("x-vercel-ip-country") ?? "").slice(0, 4),
  };

  // 管理画面の自分の閲覧は数えない
  if (event.path.startsWith("/admin")) return new NextResponse(null, { status: 204 });

  try {
    await store.record(event);
  } catch (error) {
    // 記録に失敗しても訪問者の画面は壊さない
    console.error("[analytics] record failed", error);
  }
  return new NextResponse(null, { status: 204 });
}
