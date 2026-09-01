"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const VISITOR_KEY = "allovv_v";
const SESSION_KEY = "allovv_s";

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** 保存できないブラウザ設定でも落ちないように、失敗したらその場限りのIDを返す */
function persistentId(storage: "local" | "session", key: string) {
  try {
    const box = storage === "local" ? window.localStorage : window.sessionStorage;
    const existing = box.getItem(key);
    if (existing) return { id: existing, isNew: false };
    const id = newId();
    box.setItem(key, id);
    return { id, isNew: true };
  } catch {
    return { id: newId(), isNew: true };
  }
}

/**
 * 閲覧を1件送るだけの部品。cookieは使わず、端末に保存するのはランダムな文字列2つ。
 * 個人を特定できる値は送らない
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    // React の開発時2重実行と、同じパスへの再描画で二重計上しないようにする
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    const visitor = persistentId("local", VISITOR_KEY);
    const session = persistentId("session", SESSION_KEY);

    void fetch("/api/track", {
      method: "POST",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        ref: document.referrer,
        visitor: visitor.id,
        session: session.id,
        entry: session.isNew,
      }),
    }).catch(() => {
      // 計測が届かなくてもサイトの動作には影響させない
    });
  }, [pathname]);

  return null;
}
