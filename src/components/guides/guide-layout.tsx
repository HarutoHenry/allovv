import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { ORG_ID, SITE_URL, breadcrumbJsonLd } from "@/lib/seo"
import type { ReactNode } from "react"

export function GuideLayout({ title, description, path, sections, children }: {
  title: string
  description: string
  path: string
  sections: { id: string; label: string }[]
  children: ReactNode
}) {
  return <>
    <JsonLd data={[
      { "@context": "https://schema.org", "@type": "Article", headline: title, description,
        mainEntityOfPage: `${SITE_URL}${path}`, url: `${SITE_URL}${path}`, inLanguage: "ja",
        author: { "@id": ORG_ID }, publisher: { "@id": ORG_ID }, dateModified: "2026-10-12T00:00:00+09:00" },
      breadcrumbJsonLd([{ name: "TOP", path: "/" }, { name: "AI導入・業務改善ガイド", path: "/guides" }, { name: title, path }]),
    ]} />
    <Navigation />
    <main id="main" className="bg-[#f5f9f8] text-[#1a2e35] min-h-screen">
      <article className="max-w-[900px] mx-auto px-5 md:px-10 pt-32 md:pt-40 pb-24">
        <nav aria-label="パンくず" className="text-xs text-[#42665e] flex flex-wrap gap-2">
          <Link href="/">TOP</Link><span aria-hidden> / </span><Link href="/guides">AI導入・業務改善ガイド</Link>
        </nav>
        <header className="mt-12">
          <p className="font-display text-sm tracking-widest text-[#42665e]">ALLOVV GUIDE</p>
          <h1 className="mt-5 text-[clamp(1.9rem,4.7vw,3.25rem)] font-bold leading-[1.45] text-balance">{title}</h1>
          <p className="mt-7 text-[16px] md:text-lg leading-[1.95] text-[#3f5b58]">{description}</p>
          <p className="mt-6 text-xs text-[#526965]">編集：Allovv · 更新・情報確認日：<time dateTime="2026-10-12">2026年10月12日</time></p>
        </header>
        <nav aria-label="目次" className="mt-10 border-y border-[#1a2e35]/15 py-7">
          <p className="font-bold text-sm mb-4">このガイドで分かること</p>
          <ol className="space-y-3 text-sm list-decimal pl-5">
            {sections.map(({ id, label }) => <li key={id}><Link href={`#${id}`} className="underline underline-offset-4 hover:text-[#327d70]">{label}</Link></li>)}
          </ol>
        </nav>
        <div className="guide-copy">{children}</div>
        <aside className="mt-16 bg-[#dff2ec] rounded-2xl p-7 md:p-10">
          <h2 className="text-xl md:text-2xl font-bold leading-relaxed">自社の業務に当てはめて、相談する</h2>
          <p className="mt-4 text-[15px] leading-[1.9]">「誰が、何を使って、何を作っているか」からお聞かせください。Allovvは業務の洗い出しから、AIの実装・使い方の標準化まで支援します。</p>
          <div className="mt-7 flex flex-wrap gap-5 text-sm font-bold">
            <Link href="/services/ai-consulting" className="underline underline-offset-4">AI導入コンサルの内容・料金</Link>
            <Link href="/services/ai-training" className="underline underline-offset-4">社員向けAI研修</Link>
            <Link href="/#contact" className="underline underline-offset-4">無料相談へ →</Link>
          </div>
        </aside>
      </article>
    </main>
    <Footer seamless />
  </>
}
