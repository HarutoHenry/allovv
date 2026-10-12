"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { trackEvent } from "@/lib/analytics/client";

/**
 * ページ閲覧と相談リンクのクリックを記録する部品。cookieは使わず、端末に保存するのはランダムな文字列2つ。
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

    trackEvent("page_view", pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor) return;
      const target = new URL(anchor.getAttribute("href") ?? "", window.location.href);
      if (target.origin === window.location.origin && target.pathname === "/" && target.hash === "#contact") {
        trackEvent("contact_click");
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  return null;
}
