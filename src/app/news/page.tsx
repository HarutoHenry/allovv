import Link from "next/link"
import { newsItems } from "@/lib/news-data"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "お知らせ | Allovv合同会社",
  description: "Allovv合同会社からの最新のお知らせ・プレスリリースです。",
}

export default function NewsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white pt-32 pb-24">
        <div className="max-w-[900px] mx-auto px-5">
          <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-accent-purple mb-6">
            NEWS
          </p>
          <h1 className="text-navy text-2xl md:text-3xl mb-16">
            最新のお知らせ
          </h1>

          <div className="divide-y divide-navy/10">
            {newsItems.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="flex flex-col sm:flex-row sm:items-center gap-3 py-7 group hover:bg-navy/[0.02] -mx-4 px-4 rounded-lg transition-colors"
              >
                <span className="font-display text-sm text-navy/40 shrink-0 w-28">
                  {item.date}
                </span>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full shrink-0 ${item.categoryColor}`}>
                  {item.category}
                </span>
                <span className="text-navy text-sm leading-relaxed group-hover:text-accent-purple transition-colors">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
