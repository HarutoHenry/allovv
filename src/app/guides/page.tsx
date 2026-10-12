import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({ title: "AI導入・業務改善ガイド｜活用の進め方と支援の選び方", description: "AIで改善する業務の選び方、仕組み化の進め方、SI（Super Intelligence）の意味とFDE・DX・AXの違いを整理。自社のAI活用を考える担当者に、相談前の確認事項とAllovvの支援内容をご案内します。", path: "/guides" })

export default function GuidesPage() {
  return <>
    <JsonLd data={breadcrumbJsonLd([{ name: "TOP", path: "/" }, { name: "AI導入・業務改善ガイド", path: "/guides" }])} />
    <Navigation />
    <main id="main" className="bg-[#f5f9f8] min-h-screen text-[#1a2e35]">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 pt-36 pb-24 md:pb-32">
        <p className="font-display text-sm tracking-widest text-[#42665e]">ALLOVV GUIDES</p>
        <h1 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.35]">AI導入・業務改善ガイド</h1>
        <p className="mt-7 max-w-[42em] text-[16px] md:text-lg leading-[1.95] text-[#3f5b58]">AIを仕事で使うために、何を整理し、どんな支援を選ぶか。日々の業務を起点に、導入前の疑問を解きほぐします。</p>
        <div className="grid md:grid-cols-2 gap-6 mt-14">
          {[
            { href: "/guides/ai-workflow", label: "01 / 業務から考える", title: "AIで業務改善するには？", text: "業務の洗い出し、AIに任せる範囲、効果の測り方。見積書の作成を例に、仕組み化までの判断を整理します。" },
            { href: "/guides/fde-dx-ax-si", label: "02 / 支援を選ぶ", title: "SIとは？AIの新しい呼称", text: "AIからSIへの呼称変更の意味と範囲を解説。FDE・DX・AXとの違いも整理し、支援の内容を確認します。" },
          ].map(item => <Link key={item.href} href={item.href} className="block rounded-2xl bg-white border border-[#1a2e35]/10 p-7 md:p-10 hover:border-[#529e8e] transition-colors">
            <p className="text-xs tracking-wider text-[#42665e]">{item.label}</p>
            <h2 className="mt-8 text-2xl font-bold leading-relaxed">{item.title}</h2>
            <p className="mt-5 text-[15px] leading-[1.95] text-[#3f5b58]">{item.text}</p>
            <p className="mt-8 text-sm font-bold text-[#42665e]">ガイドを読む →</p>
          </Link>)}
        </div>
        <section className="mt-20 border-t border-[#1a2e35]/15 pt-12">
          <h2 className="text-2xl font-bold">目的に合う相談先を見つける</h2>
          <dl className="mt-8 divide-y divide-[#1a2e35]/15">
            {[
              ["業務を洗い出し、AIの仕組みを作りたい", "/services/ai-consulting", "AI導入コンサルの進め方・料金"],
              ["社員が仕事でAIを使えるようにしたい", "/services/ai-training", "AI研修の内容・費用"],
              ["費用や情報の扱い、導入後について知りたい", "/faq", "よくあるご質問"],
            ].map(([text, href, label]) => <div key={href} className="grid md:grid-cols-2 gap-4 py-6 text-[15px] leading-relaxed"><dt>{text}</dt><dd><Link href={href} className="text-[#42665e] underline underline-offset-4">{label} →</Link></dd></div>)}
          </dl>
        </section>
      </div>
    </main>
    <Footer seamless />
  </>
}
