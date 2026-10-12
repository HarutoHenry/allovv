import type { EventKind } from "./types"

/** 既存クライアントはkindを送らない。未知の操作は閲覧数にも混ぜない。 */
export function parseEventKind(raw: unknown): EventKind | null {
  if (raw === undefined) return "page_view"
  return raw === "page_view" || raw === "contact_click" || raw === "contact_start" || raw === "contact_success" ? raw : null
}
