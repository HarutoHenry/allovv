import type { MetadataRoute } from "next"
import { newsItems } from "@/lib/news-data"
import { SITE_URL } from "@/lib/seo"

// 検索エンジンに「このサイトにはこのページがある」と伝える一覧。ページを足したらここにも足す。
// 更新日（lastModified）は確かな日付があるお知らせだけに付ける。ビルドのたびに今日の日付を
// 入れると、Google は更新日を当てにしなくなる
export default function sitemap(): MetadataRoute.Sitemap {
  const date = (d: string) => new Date(`${d.replace(/\./g, "-")}T00:00:00+09:00`)
  const latestNews = newsItems.map((n) => n.date).sort().at(-1)

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/services/ai-consulting` },
    { url: `${SITE_URL}/services/ai-training` },
    { url: `${SITE_URL}/services/web` },
    { url: `${SITE_URL}/cases` },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/faq` },
    { url: `${SITE_URL}/news`, ...(latestNews && { lastModified: date(latestNews) }) },
    ...newsItems.map((n) => ({
      url: `${SITE_URL}/news/${n.slug}`,
      lastModified: date(n.date),
    })),
    { url: `${SITE_URL}/privacy` },
    { url: `${SITE_URL}/legal` },
  ]
}
