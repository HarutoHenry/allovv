import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

// 管理画面と API は検索に出す必要がないので巡回させない（管理画面は各ページでも noindex 済み）
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
