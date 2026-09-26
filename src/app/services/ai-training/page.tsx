import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { PhraseWrap } from "@/components/phrase-wrap"
import { ORG_ID, SITE_URL, breadcrumbJsonLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "社員向けAI研修（AI活用研修）の内容と料金",
  description:
    "Allovvの社員向けAI活用研修です。生成AIの基礎とやってはいけないこと、指示文（プロンプト）の書き方と社内の型づくりを、貴社の実際の業務・書類を教材に学びます。全10〜12時間・1社5名まで・¥150,000〜（税別）。オンライン・訪問どちらにも対応し、受講後に社内マニュアルをお渡しします。",
  path: "/services/ai-training",
})

// このページに書くのは、料金ページの研修カードと FAQ にある事実だけ（2026-09-26 ユーザー指示
// 「今の記載だけで作る」）。受講者の声・実績・カリキュラムの細目は、確認が取れるまで足さない
const specs = [
  { label: "時間", value: "全10〜12時間", note: "半日×3回など、日程はご相談" },
  { label: "人数", value: "1社5名まで", note: "人数の追加はご相談ください" },
  { label: "形式", value: "オンライン・貴社への訪問", note: "どちらにも対応します" },
  { label: "受講後", value: "社内マニュアル", note: "受講後に見返せる形でお渡しします" },
]

const topics = [
  {
    title: "生成AIの基礎と、やってはいけないこと",
    body: "仕事で使い始める前に押さえておきたい生成AIの基礎と、やってはいけない使い方を扱います。",
  },
  {
    title: "指示文（プロンプト）の書き方と、社内の型づくり",
    body: "AIへの指示文の書き方を練習し、社内で繰り返し使える指示の型をつくります。",
  },
]

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI活用研修",
    serviceType: "AI研修",
    description:
      "生成AIの基礎とやってはいけないこと、指示文（プロンプト）の書き方と社内の型づくりを、貴社の実際の業務・書類を教材に学ぶ社員向け研修です。全10〜12時間、1社5名まで。受講後に社内マニュアルをお渡しします。",
    url: `${SITE_URL}/services/ai-training`,
    provider: { "@id": ORG_ID },
    areaServed: "JP",
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: 150000,
        priceCurrency: "JPY",
        valueAddedTaxIncluded: false,
      },
    },
  },
  breadcrumbJsonLd([
    { name: "TOP", path: "/" },
    { name: "AI活用研修", path: "/services/ai-training" },
  ]),
]

export default function AiTrainingPage() {
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
            Training
          </p>

          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            AI活用研修
          </h1>

          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed text-pretty">
            貴社の実際の業務と書類を教材に、<br className="md:hidden" />
            生成AIの使い方を学ぶ社員向けの研修です。<br />
            研修のみのご依頼も承ります。
          </p>
        </div>

        {/* 料金と概要。金額は左、条件は右の表にして、料金ページのカードより一段くわしく見せる。
            枠線と大きな影は重ねない（枠線だけで区切る） */}
        <div className="max-w-[960px] mx-auto px-5 pb-24 md:pb-28">
          <div
            className="rounded-2xl grid grid-cols-1 md:grid-cols-12 overflow-hidden"
            style={{ background: "rgba(125, 216, 202, 0.05)", border: "1px solid rgba(125, 216, 202, 0.35)" }}
          >
            <div className="md:col-span-5 p-8 md:p-10 flex flex-col justify-between gap-10 border-b md:border-b-0 md:border-r border-[#7dd8ca]/20">
              <div>
                <p className="text-white/60 text-sm mb-3">研修費用</p>
                <p className="text-[#7dd8ca] text-4xl md:text-5xl font-bold tabular-nums tracking-[-0.01em]">
                  ¥150,000〜
                </p>
                <p className="text-white/55 text-xs mt-3">税別 / 1社5名まで</p>
              </div>
              <Link
                href="/#contact"
                className="block text-center py-3.5 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5 active:scale-[0.96]"
                style={{ background: "linear-gradient(135deg, #c5f5e8 0%, #ffe4ef 100%)", color: "#1a2e35" }}
              >
                研修について相談する
              </Link>
            </div>

            <dl className="md:col-span-7 px-8 md:px-10 py-4 md:py-6">
              {specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`grid grid-cols-[4.5rem_1fr] gap-4 py-5 ${i > 0 ? "border-t border-white/10" : ""}`}
                >
                  <dt className="text-white/55 text-sm pt-0.5">{spec.label}</dt>
                  <dd>
                    <p className="text-white font-bold text-[15px] leading-snug">{spec.value}</p>
                    <p className="text-white/60 text-sm leading-relaxed mt-1">{spec.note}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* 研修で扱うこと */}
        <section className="border-t border-white/5 py-20 md:py-28 px-5">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <h2 className="md:col-span-5 text-white text-2xl md:text-[2rem] font-bold leading-snug text-balance">
              研修で扱うこと
            </h2>
            <div className="md:col-span-7">
              {topics.map((topic) => (
                <div key={topic.title} className="border-t border-white/10 py-6">
                  <h3 className="text-white text-lg font-bold leading-snug mb-2.5 text-balance"><PhraseWrap text={topic.title} /></h3>
                  <p className="text-white/65 text-sm md:text-[15px] leading-[1.9] text-pretty max-w-[62ch]">{topic.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* このページでいちばん伝えたいこと。一文を大きく置いて、読む速度をここで落とす */}
        <section className="border-t border-white/5 py-20 md:py-32 px-5">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-8 md:gap-y-10">
            <h2 className="md:col-span-12 text-white text-2xl md:text-4xl font-bold leading-[1.5] md:leading-[1.45] text-balance">
              <PhraseWrap text="教材は、貴社の実際の業務と書類です。" />
            </h2>
            <div className="md:col-start-6 md:col-span-7 space-y-5 text-white/70 text-[15px] md:text-base leading-[1.9] text-pretty max-w-[62ch]">
              <p>
                研修では、普段お使いの書類や日々の業務をそのまま教材にします。練習した内容を、そのまま日々の仕事に持ち帰れます。
              </p>
              <p>
                受講後には、見返せる社内マニュアルをお渡しします。
              </p>
            </div>
          </div>
        </section>

        {/* 研修のあと → AI仕組み化への導線 */}
        <section className="border-t border-white/5 py-20 md:py-28 px-5">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <h2 className="md:col-span-5 text-white text-2xl md:text-[2rem] font-bold leading-snug text-balance">
              <PhraseWrap text="業務そのものを、AIに任せたいときは" />
            </h2>
            <div className="md:col-span-7">
              <p className="text-white/70 text-[15px] md:text-base leading-[1.9] text-pretty max-w-[62ch] mb-8">
                研修は、社員の方がAIを使いこなすためのものです。見積書の作成や議事録のように、決まった業務をAIが下書きまで用意する仕組みにしたい場合は、AI導入コンサルティング（AI仕組み化）で承ります。1業務あたり¥50,000〜（税別）です。
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
            <PhraseWrap text="日程や人数をお伺いしたうえで、研修の内容と金額をご提示します。" />
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
