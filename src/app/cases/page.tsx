import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { PhraseWrap } from "@/components/phrase-wrap"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "AI導入事例｜東京都内の不動産会社で10業務をAIで改善",
  description:
    "Allovvがご支援したAI導入の事例です。東京都内の不動産会社で10業務をAIで改善し、その一例として、案件の資料をAIが読み取り、決裁者の考え方や社内規定の基準をふまえて案件の良し悪しを判断する仕組みを構築しました。決裁者の負担軽減と、社員の方の判断力の向上につながっています。",
  path: "/cases",
})

// 事例の文面は 2026-09-26 にユーザーから受け取った内容を、丁寧な言い回しに整えただけのもの。
// 社名・期間・数値など、受け取っていない事実はここで足さない（足すときは先にユーザーに確認する）
const client = [
  { label: "業種", value: "不動産会社" },
  { label: "所在地", value: "東京都" },
  { label: "AIで改善した業務", value: "10業務" },
]

// 課題 → 取り組み → 変化 の順でしか読めない話なので、段階の名前を添える
const phases = [
  {
    label: "導入前の課題",
    title: "判断が、決裁者の方に集中していました",
    body: "案件の良し悪しを見極めるための知見や判断基準が、決裁者の方に集約されていました。そのため、社内で生じる判断の多くが決裁者の方に集まり、大きなご負担となっていました。",
  },
  {
    label: "導入した仕組み",
    title: "決裁者の考え方をふまえて、AIが案件を判断する",
    body: "案件の資料をAIが読み取り、決裁者の方の考え方や社内規定の基準をふまえて、幅広い知見と分析にもとづき案件の良し悪しを判断する仕組みを構築しました。",
  },
  {
    label: "導入後の変化",
    title: "決裁者の負担が軽くなり、社員の判断力も高まりました",
    body: "決裁者の方のご負担が軽減されました。また、AIの支援を受けながら案件を検討することで、社員の方の思考力・判断力の向上にもつながっています。",
  },
]

const jsonLd = [
  breadcrumbJsonLd([
    { name: "TOP", path: "/" },
    { name: "AI導入事例", path: "/cases" },
  ]),
]

export default function CasesPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Navigation />
      <main className="min-h-screen bg-[#0f1e24]">

        {/* Hero */}
        <div className="pt-36 pb-16 md:pb-20 text-center px-5">
          <Link
            href="/#business"
            className="inline-flex items-center gap-2 text-[#7dd8ca]/60 text-xs font-display tracking-[0.15em] uppercase hover:text-[#7dd8ca] transition-colors mb-8"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            SERVICES
          </Link>

          <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5">
            Case Study
          </p>

          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            AI導入事例
          </h1>

          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed text-pretty">
            Allovvがご支援した企業の事例をご紹介します。<br />
            社名は伏せて掲載しています。
          </p>
        </div>

        {/* 事例の概要。会社の情報は左の表、事例の題は右に置く。
            「10業務」は大きな数字で飾らず、表の一行として淡々と見せる */}
        <div className="max-w-[960px] mx-auto px-5 pb-24 md:pb-28">
          <div
            className="rounded-2xl grid grid-cols-1 md:grid-cols-12 overflow-hidden"
            style={{ background: "rgba(125, 216, 202, 0.05)", border: "1px solid rgba(125, 216, 202, 0.35)" }}
          >
            <dl className="md:col-span-5 px-8 md:px-10 py-4 md:py-6 border-b md:border-b-0 md:border-r border-[#7dd8ca]/20">
              {client.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[8.5rem_1fr] gap-4 py-5 ${i > 0 ? "border-t border-white/10" : ""}`}
                >
                  <dt className="text-white/55 text-sm pt-0.5">{row.label}</dt>
                  <dd className="text-white font-bold text-[15px] leading-snug tabular-nums">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center">
              <p className="text-[#7dd8ca] text-sm mb-3">東京都内の不動産会社</p>
              <h2 className="text-white text-xl md:text-2xl font-bold leading-snug mb-4 text-balance">
                <PhraseWrap text="案件の判断を、AIが支える仕組みづくり" />
              </h2>
              <p className="text-white/65 text-sm md:text-[15px] leading-[1.9] text-pretty">
                <PhraseWrap text="AIで改善した10業務のうち、本ページではその一例をご紹介します。" />
              </p>
            </div>
          </div>
        </div>

        {/* 課題・仕組み・変化 */}
        <section className="border-t border-white/5 py-20 md:py-28 px-5">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <h2 className="md:col-span-5 text-white text-2xl md:text-[2rem] font-bold leading-snug text-balance">
              <PhraseWrap text="導入前の課題と、導入後の変化" />
            </h2>
            <ol className="md:col-span-7">
              {phases.map((phase) => (
                <li key={phase.label} className="border-t border-white/10 py-7">
                  <p className="text-[#7dd8ca] text-sm mb-2.5">{phase.label}</p>
                  <h3 className="text-white text-lg font-bold leading-snug mb-3 text-balance">
                    <PhraseWrap text={phase.title} />
                  </h3>
                  <p className="text-white/70 text-sm md:text-[15px] leading-[1.9] text-pretty max-w-[62ch]">{phase.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 事例 → サービスへの導線 */}
        <section className="border-t border-white/5 py-20 md:py-28 px-5">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <h2 className="md:col-span-5 text-white text-2xl md:text-[2rem] font-bold leading-snug text-balance">
              <PhraseWrap text="貴社の業務でも、まずは洗い出しから" />
            </h2>
            <div className="md:col-span-7">
              <p className="text-white/70 text-[15px] md:text-base leading-[1.9] text-pretty max-w-[62ch] mb-8">
                AI導入コンサルティングでは、日々の業務の流れをお伺いし、AIで置き換えられるところと人が残すべきところを整理したうえで、効果の出やすい業務から仕組みにしていきます。料金は1業務あたり¥50,000〜（税別）です。
              </p>
              <Link
                href="/services/ai-consulting"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-colors hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                進め方と料金を見る
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <div className="border-t border-white/5 py-24 text-center px-5">
          <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5">
            CONTACT
          </p>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
            まずはご相談ください
          </h2>
          <p className="text-white/60 text-sm mb-10 max-w-md mx-auto leading-relaxed text-pretty">
            <PhraseWrap text="業務の流れをお伺いしたうえで、AIに任せられるところをご提案します。" />
          </p>
          <Link
            href="/#contact"
            className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5 active:scale-[0.96]"
            style={{ background: "linear-gradient(135deg, #c5f5e8 0%, #ffe4ef 100%)", color: "#1a2e35" }}
          >
            無料相談はこちら
          </Link>
          <p className="text-center text-xs mt-8">
            <Link href="/faq" className="text-[#7dd8ca]/70 hover:text-[#7dd8ca] transition-colors underline underline-offset-4">
              よくあるご質問はこちら
            </Link>
          </p>
        </div>

      </main>
      <Footer />
    </>
  )
}
