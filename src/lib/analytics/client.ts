import type { EventKind } from "./types"

function persistentId(storage: "local" | "session", key: string) {
  try {
    const box = storage === "local" ? window.localStorage : window.sessionStorage
    const existing = box.getItem(key)
    if (existing) return { id: existing, isNew: false }
    const id = crypto.randomUUID().replace(/-/g, "")
    box.setItem(key, id)
    return { id, isNew: true }
  } catch {
    return { id: Math.random().toString(36).slice(2) + Date.now().toString(36), isNew: true }
  }
}

/** 入力値・リンク文言・URLのクエリやハッシュは送らない。 */
export function trackEvent(kind: EventKind, path?: string) {
  if (typeof window === "undefined" || !["www.allovv.com", "allovv.com"].includes(window.location.hostname)) return
  const currentPath = path ?? window.location.pathname
  if (currentPath.startsWith("/admin")) return
  let ref = ""
  try { ref = document.referrer ? new URL(document.referrer).origin : "" } catch { /* 不正な参照元は送らない */ }
  const visitor = persistentId("local", "allovv_v")
  const session = persistentId("session", "allovv_s")
  void fetch("/api/track", {
    method: "POST", keepalive: true, headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind, path: currentPath.split(/[?#]/)[0], ref,
      visitor: visitor.id, session: session.id, entry: kind === "page_view" && session.isNew }),
  }).catch(() => { /* 計測の失敗でフォームや画面の動作を止めない */ })
}
