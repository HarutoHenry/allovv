import type { CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { Cormorant_Garamond, Shippori_Mincho } from "next/font/google"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { PhraseWrap } from "@/components/phrase-wrap"
import { ORG_ID, PERSON_ID, SITE_URL, breadcrumbJsonLd, pageMetadata } from "@/lib/seo"
import styles from "./profile.module.css"

/* このページだけで使う書体。明朝は日本語なので layout と同じく先読みを切り、出ている文字の分だけ取りに行かせる */
const mincho = Shippori_Mincho({
  variable: "--font-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
})

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
})

export const metadata = pageMetadata({
  title: "代表プロフィール｜三沼 春斗",
  description:
    "Allovv代表・三沼春斗のプロフィールとメッセージです。1999年生まれ、San Diego, CaliforniaでComputer Scienceを専攻。論理的思考力と創造力を強みに、業務の本質をとらえたAIの仕組みづくりを通じて、日本の企業のポテンシャルを引き出すことを目指しています。",
  path: "/about",
})

// 書いてよいのは 2026-09-26 にユーザーから受け取った事実だけ。
// 経歴は「1999年生まれ、San Diego, California で Computer Science を専攻」まで（大学名・卒業は書かない）。
// 経歴・強み・事業開始は表にせず、メッセージの本文に入れる（2026-09-26「右の本文の文章にさらっといれるだけでいい」）。
// 経歴は本文の一行目、強みは最後の段落の流れの中に（同日「これをさいしょにいれて／強みの文章を自然にいれて」）
// 事業開始の年月（2025年6月）は本文から外した（2026-10-06「２０２５年６月けして」）
// 構成・標語・英字の添え書きは 2026-10-05 にユーザーから受け取った参考画像のとおり（「これと全く同じ構成で」）

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
      image: `${SITE_URL}/images/profile/haruto-minuma.webp`,
    },
  },
  breadcrumbJsonLd([
    { name: "TOP", path: "/" },
    { name: "代表プロフィール", path: "/about" },
  ]),
]

// 開いた時に順に出てくる要素の遅れ（profile.module.css の .rise が使う）
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties

export default function AboutPage() {
  const s = styles
  return (
    <>
      <JsonLd data={jsonLd} />
      <Navigation />
      <main className={`${s.page} ${mincho.variable} ${serif.variable} min-h-screen`}>
        {/* 1024px からは参考画像と同じ舞台。左に紺の面・写真・名前・東京、右に手紙・富士山。
            位置は profile.module.css にまとめてある（参考画像の座標そのまま）。
            一番上にページの題（2026-10-05「一番上も代表挨拶みたいなタイトルほしい」）、その下の .board が参考画像の範囲 */}
        <section className={s.hero}>
          <div className={s.stage}>
            <span aria-hidden className={`${s.at} ${s.caps} ${s.verticalUp} ${s.founder}`}>Founder</span>

            <header className={`${s.head} ${s.rise}`} style={delay(100)}>
              <h1 className={`${s.mincho} ${s.title}`}>代表挨拶</h1>
              <p lang="en" className={`${s.serif} ${s.titleEn}`}>
                Message from the Founder
              </p>
              <span aria-hidden className={s.titleRule} />
            </header>

            <div className={s.board}>
              <div className={`${s.at} ${s.panel} ${s.unveil}`}>
                <span aria-hidden className={s.panelFill} />
                <p className={`${s.mincho} ${s.tagline} ${s.rise}`} style={delay(350)}>
                  技術で、
                  <br />
                  日本の可能性を
                  <br />
                  解き放つ。
                </p>
                <p aria-hidden className={`${s.caps} ${s.tech} ${s.rise}`} style={delay(450)}>
                  Technology
                  <br />
                  For a brighter
                  <br />
                  Japan
                </p>
              </div>

              <figure className={`${s.at} ${s.photo} ${s.settle} ${s.rise} overflow-hidden`} style={delay(150)}>
                <Image
                  src="/images/profile/founder-portrait.webp"
                  alt="Allovv 代表 三沼 春斗"
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 570px) 330px, 58vw"
                  preload
                  className="object-cover"
                />
              </figure>

              <p className={`${s.at} ${s.name} ${s.rise}`} style={delay(400)}>
                <span lang="en" className={`${s.serif} ${s.nameEn}`}>
                  Haruto
                  <span className={s.nameEn2}>Minuma</span>
                </span>
                <span className={`${s.mincho} ${s.nameJa}`}>三沼 春斗</span>
              </p>
              <p className={`${s.at} ${s.role} ${s.rise}`} style={delay(500)}>
                Allovv 代表
              </p>
              <span aria-hidden className={`${s.at} ${s.dash} ${s.roleDash}`} />

              <article className={s.letter}>
                <p aria-hidden className={`${s.caps} ${s.label} ${s.rise}`} style={delay(300)}>
                  Founder&apos;s Message
                </p>
                <h2 className={`${s.mincho} ${s.say} ${s.rise}`} style={delay(400)}>
                  {/* スマホ幅で「ポ／テンシャル」と割れないよう、語の塊ごとに折り返す */}
                  <span className="inline-block">日本の企業の</span>
                  <span className="inline-block">ポテンシャルを、</span>
                  <span className="inline-block">もっと引き出したい。</span>
                </h2>
                <div className={`${s.body} ${s.rise}`} style={delay(550)}>
                  <p>1999年生まれ、San Diego, CaliforniaでComputer Scienceを専攻。</p>
                  <p>
                    AIは、いまや誰もが手軽に使えるものになりました。ツールそのものでは差がつきにくくなった今、成果を分けるのは、業務の本質をとらえて仕組みを組み立てる力と、それを自社の仕事に応用していく力だと考えています。
                  </p>
                  <p>
                    その土台になるのが、物事を筋道立てて整理する論理的思考力と、そこから新しいかたちを生み出す創造力です。私はこの二つを強みに、一社一社の業務に合ったAIの仕組みを設計し、日本の企業が本来持っている力をもっと引き出していきたい。その思いから、Allovvを立ち上げました。
                  </p>
                </div>
                <p className={`${s.sign} ${s.rise}`} style={delay(650)}>
                  Allovv 代表　三沼 春斗
                </p>
              </article>

              <span aria-hidden className={`${s.at} ${s.sideRule}`} />
              <span aria-hidden className={`${s.at} ${s.caps} ${s.vertical} ${s.side}`}>AI for a stronger Japan</span>

              {/* 下端の飾り。東京と紺の円、富士山の帯（右端の紺の柱は 2026-10-06「右下のこれいらないね」で外した）。
                  東京・富士山・霧の円は下へ向けて背景に溶かす（2026-10-05「パッキリわけるんじゃなくて、グラデーションで」） */}
              <div aria-hidden className={`${s.at} ${s.skyline}`}>
                <Image
                  src="/images/profile/founder-skyline.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, 72vw"
                  className="object-cover object-left-bottom"
                />
              </div>
              <p aria-hidden className={`${s.at} ${s.caps} ${s.people}`}>
                People
                <br />
                Ideas
                <br />
                Japan
                <br />
                And AI
              </p>
              <span aria-hidden className={`${s.at} ${s.dash} ${s.peopleDash}`} />

              <span aria-hidden className={`${s.at} ${s.mist}`} />
              <div aria-hidden className={`${s.at} ${s.fuji}`}>
                <Image
                  src="/images/profile/founder-fuji.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 53vw, 100vw"
                  className="object-cover object-[60%_100%]"
                />
              </div>
              <p aria-hidden className={`${s.at} ${s.caps} ${s.fujiText}`}>
                New potential
                <span className={s.fujiLine} />
                <br />
                For a brighter tomorrow
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
          {/* 結び。左にサービスへの導線、右に相談の入口。
              768px 前後は右の列が細いので、見出しを一段小さくして「ご相談」の途中で折り返さないようにする */}
          <section className="pt-20 pb-24 md:pt-28 md:pb-32 grid gap-y-14 md:grid-cols-12 md:gap-x-10 lg:gap-x-16">
            <div className="md:col-span-6">
              <h2 className="text-xl lg:text-2xl font-bold leading-snug tracking-[0.02em]">
                <PhraseWrap text="Allovvのご支援について" />
              </h2>
              <p className="svc-jp mt-5 max-w-[34em] text-[15px] leading-[1.95] text-navy/75 text-pretty">
                業務を洗い出し、AIで置き換えられるところから仕組みにしていくAI導入コンサルティングを中心に、社員向けのAI活用研修やAIクリエイティブ制作も承っています。
              </p>
              <Link
                href="/services/ai-consulting"
                className="group mt-7 inline-flex items-center gap-2 pb-1 border-b border-navy/30 hover:border-navy text-[15px] font-semibold transition-colors"
              >
                進め方と料金を見る
                <svg className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="md:col-span-5 md:col-start-8 md:border-l md:border-navy/15 md:pl-10 lg:pl-14">
              <h2 className="text-xl lg:text-2xl font-bold leading-snug tracking-[0.02em]">
                <span className="inline-block">まずは</span>
                <span className="inline-block">ご相談ください</span>
              </h2>
              <p className="mt-5 text-[15px] leading-[1.95] text-navy/75 text-pretty">
                <span className="inline-block">業務の流れをお伺いしたうえで、</span>
                <span className="inline-block">AIに任せられるところを</span>
                <span className="inline-block">ご提案します。</span>
              </p>
              <Link
                href="/#contact"
                className="gradient-btn mt-7 inline-block px-8 py-3.5 rounded-full font-semibold text-sm"
              >
                無料相談はこちら
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer seamless />
    </>
  )
}
