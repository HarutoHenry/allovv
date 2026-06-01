import Link from "next/link"
import { notFound } from "next/navigation"
import { newsItems } from "@/lib/news-data"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return newsItems.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const item = newsItems.find((n) => n.slug === slug)
  if (!item) return {}
  return {
    title: `${item.title} | Allovv合同会社`,
    description: item.body.slice(0, 120).replace(/[#*\n]/g, ""),
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const item = newsItems.find((n) => n.slug === slug)
  if (!item) notFound()

  const paragraphs = item.body.split("\n\n")

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white pt-32 pb-24">
        <div className="max-w-[720px] mx-auto px-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-navy/40 mb-12">
            <Link href="/" className="hover:text-navy transition-colors">TOP</Link>
            <span>/</span>
            <Link href="/news" className="hover:text-navy transition-colors">お知らせ</Link>
            <span>/</span>
            <span className="text-navy/60">{item.category}</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-5">
              <span className="font-display text-sm text-navy/40">{item.date}</span>
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${item.categoryColor}`}>
                {item.category}
              </span>
            </div>
            <h1 className="text-navy text-xl md:text-2xl leading-relaxed">
              {item.title}
            </h1>
          </div>

          <div className="w-full h-px bg-navy/10 mb-12" />

          {/* Body */}
          <div className="prose-custom text-navy/80 text-sm leading-[2]">
            {paragraphs.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-navy text-base font-medium mt-12 mb-4">
                    {block.replace("## ", "")}
                  </h2>
                )
              }
              if (block.startsWith("- ")) {
                const items = block.split("\n").filter((l) => l.startsWith("- "))
                return (
                  <ul key={i} className="list-disc list-outside pl-5 mb-6 space-y-2">
                    {items.map((li, j) => (
                      <li key={j}>{li.replace(/^- /, "").replace(/\*\*/g, "")}</li>
                    ))}
                  </ul>
                )
              }
              const withBold = block.replace(/\*\*(.+?)\*\*/g, (_, t) => `<strong>${t}</strong>`)
              const withLinks = withBold.replace(
                /(https?:\/\/[^\s<]+)/g,
                `<a href="$1" target="_blank" rel="noopener noreferrer" class="text-accent-purple underline underline-offset-2 hover:opacity-70 break-all transition-opacity">$1</a>`
              )
              return (
                <p key={i} className="mb-6" dangerouslySetInnerHTML={{ __html: withLinks }} />
              )
            })}
          </div>

          <div className="w-full h-px bg-navy/10 mt-16 mb-10" />

          {/* Back */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            お知らせ一覧へ戻る
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
