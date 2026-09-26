import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { PhraseWrap } from "@/components/phrase-wrap"
import { ORG_ID, PERSON_ID, SITE_URL, breadcrumbJsonLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "代表プロフィール｜三沼 春斗",
  description:
    "Allovv代表・三沼春斗のプロフィールとメッセージです。1999年生まれ、San Diego, CaliforniaでComputer Scienceを専攻。論理的思考力と創造力を強みに、業務の本質をとらえたAIの仕組みづくりを通じて、日本の企業のポテンシャルを引き出すことを目指しています。",
  path: "/about",
})

// 書いてよいのは 2026-09-26 にユーザーから受け取った事実だけ。
// 経歴は「1999年生まれ、San Diego, California で Computer Science を専攻」まで（大学名・卒業は書かない）。
// 経歴・強み・事業開始は表にせず、メッセージの本文に入れる（2026-09-26「右の本文の文章にさらっといれるだけでいい」）

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE_URL}/about`,
    mainEntity: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "三沼 春斗",
      alternateName: "Haruto Minuma",
      jobTitle: "代表",
      worksFor: { "@id": ORG_ID },
      image: `${SITE_URL}/images/profile/representative.webp`,
    },
  },
  breadcrumbJsonLd([
    { name: "TOP", path: "/" },
    { name: "代表プロフィール", path: "/about" },
  ]),
]

export default function AboutPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Navigation />
      <main className="min-h-screen bg-[#0f1e24]">

        {/* Hero */}
        <div className="pt-36 pb-16 md:pb-20 text-center px-5">
          <Link
            href="/#about"
            className="inline-flex items-center gap-2 text-[#7dd8ca]/60 text-xs font-display tracking-[0.15em] uppercase hover:text-[#7dd8ca] transition-colors mb-8"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ABOUT
          </Link>

          <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5">
            Profile
          </p>

          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight text-balance">
            代表プロフィール
          </h1>
        </div>

        {/* 左に写真と名前、右に代表メッセージ。
            2026-09-26「上の右側にこの文章いれて」で、下にあったメッセージ欄を見出しごとここへ移した。
            本文のほうが長いので、右を広く取り、左の写真は列の中で上下中央に置く */}
        <div className="max-w-[960px] mx-auto px-5 pb-24 md:pb-28">
          <div
            className="rounded-2xl grid grid-cols-1 md:grid-cols-12 overflow-hidden"
            style={{ background: "rgba(125, 216, 202, 0.05)", border: "1px solid rgba(125, 216, 202, 0.35)" }}
          >
            <div className="md:col-span-4 p-8 md:p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#7dd8ca]/20">
              <div className="flex items-center gap-6 md:flex-col md:items-start md:gap-7">
                <Image
                  src="/images/profile/representative.webp"
                  alt="Allovv 代表 三沼 春斗"
                  width={400}
                  height={500}
                  sizes="(min-width: 768px) 152px, 104px"
                  className="w-[104px] md:w-[152px] h-auto rounded-xl outline outline-1 -outline-offset-1 outline-white/10 shrink-0"
                />
                <div>
                  <p className="text-white/55 text-sm mb-2">Allovv 代表</p>
                  <p className="text-white text-2xl md:text-[1.75rem] font-bold leading-tight tracking-[0.04em]">
                    三沼 春斗
                  </p>
                  <p className="font-display font-light text-white/55 text-sm tracking-[0.08em] mt-2">
                    Haruto Minuma
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 p-8 md:p-10 lg:p-12">
              <h2 className="text-white text-xl md:text-[1.375rem] lg:text-[1.75rem] font-bold leading-[1.5] text-balance mb-6 md:mb-8">
                <PhraseWrap text="日本の企業のポテンシャルを、もっと引き出したい。" />
              </h2>
              <div className="space-y-5 text-white/70 text-[15px] md:text-base leading-[1.9] text-pretty">
                <p>
                  AIは、いまや誰もが手軽に使えるものになりました。ツールそのものでは差がつきにくくなった今、成果を分けるのは、業務の本質をとらえて仕組みを組み立てる力と、それを自社の仕事に応用していく力だと考えています。
                </p>
                <p>
                  私は1999年に生まれ、San Diego, CaliforniaでComputer Scienceを専攻しました。強みは、物事を筋道立てて整理する論理的思考力と、そこから新しいかたちを生み出す創造力です。
                </p>
                <p>
                  この二つを掛け合わせ、一社一社の業務に合ったAIの仕組みを設計することで、日本の企業が本来持っている力をもっと引き出していきたい。その思いから、2025年6月にAllovvを立ち上げました。
                </p>
              </div>
              {/* 署名は右寄せにして、手紙の体裁にする */}
              <p className="mt-8 md:mt-10 text-right text-white/85 text-[15px]">
                Allovv 代表　三沼 春斗
              </p>
            </div>
          </div>
        </div>

        {/* プロフィール → 事例・サービスへの導線 */}
        <section className="border-t border-white/5 py-20 md:py-28 px-5">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <h2 className="md:col-span-5 text-white text-2xl md:text-[2rem] font-bold leading-snug text-balance">
              <PhraseWrap text="Allovvのご支援について" />
            </h2>
            <div className="md:col-span-7">
              <p className="text-white/70 text-[15px] md:text-base leading-[1.9] text-pretty max-w-[62ch] mb-8">
                業務を洗い出し、AIで置き換えられるところから仕組みにしていくAI導入コンサルティングを中心に、社員向けのAI活用研修やAIクリエイティブ制作も承っています。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/cases"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-colors hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  導入事例を見る
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
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
        </div>

      </main>
      <Footer />
    </>
  )
}
