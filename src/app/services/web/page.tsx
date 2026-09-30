import { Fragment } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { PlanRow } from "@/components/services/plan-row"
import { ReflowCanvas } from "@/components/services/reflow-canvas"
import { FrameMark } from "@/components/services/frame-mark"
import { PhraseWrap } from "@/components/phrase-wrap"
import { ORG_ID, SITE_URL, breadcrumbJsonLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "ホームページ制作（¥50,000〜・最短5営業日）",
  description:
    "Allovvのホームページ制作サービスです。¥50,000〜（税別）、最短5営業日から。スマートフォン表示は標準対応、オンライン打ち合わせに対応しています。公開後の運用はAI仕組み化でそのままお任せいただけます。",
  path: "/services/web",
})

// 本文の改行の目印。\n＝768px 以上で改行、| ＝制作の流れが横4列になる 1280px 以上だけで改行（スマホは幅なりに流す）、^＝どの幅でも改行、{ }＝途中で折り返さない語句
const included = [
  {
    title: "スマートフォン表示",
    body: "標準で対応します。追加料金はいただきません。パソコン・スマホ・タブレットの\n{どれで見ても}崩れない作りにします。",
  },
  {
    title: "オンライン打ち合わせ",
    body: "遠方でもご対応いただけます。{ご希望があれば}対面でもお伺いします。",
  },
  {
    title: "最短5営業日から",
    body: "内容によって変わりますが、シンプルな{構成であれば}1週間ほどで\n公開まで進められます。",
  },
  {
    title: "公開までまとめてお任せ",
    body: "文章の構成、写真の配置、{ドメインやサーバーまわりの}設定まで含めて\nご相談いただけます。",
  },
]

const flow = [
  {
    step: "01",
    title: "ヒアリング",
    body: "どんな会社で、どんなお客様に、|{何を伝えたいのか。}\nページ数や{必要な機能も}|{ここで整理します。}\n{オンラインで30分ほどです。}",
  },
  {
    step: "02",
    title: "お見積り・ご契約",
    body: "内容が固まった段階で、|{金額と期間をお出しします。}\nここまでは{費用をいただきません。}",
  },
  {
    step: "03",
    title: "制作",
    body: "{たたき台をお見せしながら進めます。}\n{文章や写真は、}{お持ちのものを}^{お預かりして}{整えることもできます。}",
  },
  {
    step: "04",
    title: "公開・お引き渡し",
    body: "公開して終わりにはしません。\n{ご自身で更新される場合は、}|{操作のご説明までいたします。}",
  },
]

// 「パソコン・スマホ・タブレット」「個人・フリーランス」のように「・」でつないだ語は、途中で折り返さない
const JOINED = /([\p{Script=Katakana}\p{Script=Han}ー]+(?:・[\p{Script=Katakana}\p{Script=Han}ー]+)+)/u
function keepJoined(text: string) {
  return text.split(JOINED).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

// 改行の目印（\n と | と ^）の付いた本文を描く。^ はどの幅でも改行。{ } で囲んだ語句は途中で折り返さない（スマホで「構成で／あれば」のように割れるのを防ぐ）
function Lines({ text }: { text: string }) {
  return text.split(/(\n|\||\^|\{[^}]*\})/).map((part, i) => {
    if (part === "\n") return <br key={i} className="hidden md:block" />
    if (part === "|") return <br key={i} className="hidden xl:block" />
    if (part === "^") return <br key={i} />
    if (part.startsWith("{"))
      return (
        <span key={i} className="whitespace-nowrap">
          {part.slice(1, -1)}
        </span>
      )
    return <Fragment key={i}>{keepJoined(part)}</Fragment>
  })
}

const targets = [
  "ホームページを持っていない、{名刺と電話だけで}営業している",
  "何年も前に作ったまま、{スマホで見ると崩れている}",
  "更新を頼むたびに{費用がかかるので、}放置してしまっている",
  "作りたいが、{何から決めればいいのか}分からない",
]

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 shrink-0 mt-[0.3em] ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

// 「標準で含まれるもの」の印。明るい面の上なので紺の線で描く（絵文字の代わり）
const INK = "#1a2e35"
const PANEL = "#e0f7f4"
function IncludedGlyph({ kind }: { kind: number }) {
  const common = { width: 48, height: 36, viewBox: "0 0 48 36", "aria-hidden": true, className: "shrink-0" } as const
  // パソコンの画面の手前にスマホ。どちらでも崩れない
  if (kind === 0) {
    return (
      <svg {...common} fill="none" stroke={INK} strokeWidth="1.4">
        <rect x="2.7" y="4.7" width="30" height="21" rx="2" />
        <path d="M12.5 31h10" strokeLinecap="round" />
        <rect x="31.7" y="12.7" width="13.6" height="21.6" rx="2.6" fill={INK} />
        <rect x="35.5" y="16.2" width="6" height="1.3" fill={PANEL} stroke="none" />
      </svg>
    )
  }
  // 画面を2つに分けた打ち合わせ
  if (kind === 1) {
    return (
      <svg {...common} fill="none" stroke={INK} strokeWidth="1.4">
        <rect x="2.7" y="4.7" width="42.6" height="26.6" rx="2.5" />
        <path d="M24 4.7v26.6" />
        <circle cx="13.4" cy="14.6" r="3.2" />
        <path d="M7.6 26.6c0-3.4 2.6-5.4 5.8-5.4s5.8 2 5.8 5.4" strokeLinecap="round" />
        <circle cx="34.6" cy="14.6" r="3.2" fill={INK} />
        <path d="M28.8 26.6c0-3.4 2.6-5.4 5.8-5.4s5.8 2 5.8 5.4" fill={INK} strokeLinecap="round" />
      </svg>
    )
  }
  // 5日分のます。1日ずつ埋まっていく
  if (kind === 2) {
    return (
      <svg {...common}>
        {[0.14, 0.3, 0.5, 0.75, 1].map((o, i) => (
          <rect key={i} x={2.5 + i * 9} y="11" width="7" height="14" rx="1.6" fill={INK} fillOpacity={o} />
        ))}
      </svg>
    )
  }
  // 文章・写真・ドメインまわりを重ねてまとめる
  return (
    <svg {...common} fill="none" stroke={INK} strokeWidth="1.4">
      <rect x="2.7" y="14.7" width="26" height="18" rx="2" />
      <rect x="10.7" y="9.7" width="26" height="18" rx="2" fill={PANEL} />
      <rect x="18.7" y="4.7" width="26" height="18" rx="2" fill={INK} />
    </svg>
  )
}

// 制作の流れの図。ヒーローの帯と同じ枠のページが、空の枠 → 下書きの線 → 中身が入る → 公開、と出来上がっていく
const MINT = "#7dd8ca"
const blocks = [
  { x: 9, y: 15, w: 22, h: 3.2, rx: 0.8 },
  { x: 9, y: 21, w: 15, h: 2.2, rx: 0.6 },
  { x: 9, y: 27.5, w: 10, h: 4.5, rx: 2.25 },
  { x: 36, y: 15, w: 19, h: 17, rx: 1.6 },
]
function FlowGlyph({ step }: { step: number }) {
  if (step === 0) {
    return (
      <svg width="64" height="40" viewBox="0 0 64 40" aria-hidden="true" fill="none">
        <rect x="4.6" y="4.6" width="54.8" height="31.8" rx="3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeDasharray="3 3" />
      </svg>
    )
  }
  const done = step === 3
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" aria-hidden="true">
      <rect x="4.6" y="4.6" width="54.8" height="31.8" rx="3" fill={done ? MINT : "none"} stroke={MINT} strokeWidth="1.2" />
      <rect x="4.6" y="9.4" width="54.8" height="1" fill={done ? "#0f1e24" : MINT} opacity={done ? 0.6 : 0.7} />
      {blocks.map((b, i) => {
        // 制作の段では、文字の線だけ先に入り、写真とボタンはまだ枠のまま
        const filled = done || (step === 2 && i < 2)
        return (
          <rect
            key={i}
            x={b.x + 0.6}
            y={b.y + 0.6}
            width={b.w - 1.2}
            height={b.h - 1.2}
            rx={b.rx}
            fill={done ? "#0f1e24" : filled ? MINT : "none"}
            fillOpacity={done ? (i === 3 ? 0.35 : 0.6) : 1}
            stroke={done ? "none" : MINT}
            strokeWidth="1.2"
            strokeOpacity={0.7}
          />
        )
      })}
    </svg>
  )
}

// 問い合わせ欄の下を流れる小さなページの列。ヒーローの帯で最後に出来上がった枠と同じ形
const marchTile = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="36" viewBox="0 0 56 36">' +
    '<rect x="12" y="6" width="32" height="24" rx="3" fill="#7dd8ca"/>' +
    '<rect x="12" y="11" width="32" height="1.2" fill="#0f1e24" fill-opacity=".6"/>' +
    '<rect x="16" y="16" width="12" height="2" fill="#0f1e24" fill-opacity=".6"/>' +
    '<rect x="16" y="21" width="8" height="2" fill="#0f1e24" fill-opacity=".6"/>' +
    '<rect x="31.5" y="16" width="8.5" height="9" rx="1" fill="#0f1e24" fill-opacity=".35"/>' +
    "</svg>",
)}")`

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "ホームページ制作",
    serviceType: "ホームページ制作",
    description:
      "伝えたいことが伝わる、シンプルで見やすいホームページを制作します。スマートフォン表示は標準対応。公開後の運用まで含めてご相談いただけます。",
    url: `${SITE_URL}/services/web`,
    provider: { "@id": ORG_ID },
    areaServed: "JP",
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: 50000,
        priceCurrency: "JPY",
        valueAddedTaxIncluded: false,
      },
    },
  },
  breadcrumbJsonLd([
    { name: "TOP", path: "/" },
    { name: "ホームページ制作", path: "/services/web" },
  ]),
]

export default function WebProductionPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Navigation />
      <main id="main" className="min-h-screen bg-[#0f1e24] overflow-x-clip">

        {/* Hero。見出しを1行で大きく置き、説明はその下に添える。下の帯で「同じページが、端末の幅に合わせて組み替わる」様子を見せる */}
        <header className="pt-32 md:pt-40">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10">
            <Link
              href="/#business"
              className="inline-flex items-center gap-2 text-white/60 text-[13px] font-display tracking-[0.08em] hover:text-white transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              SERVICES
            </Link>

            <div className="mt-10 md:mt-14">
              <p className="svc-kicker svc-enter">
                <FrameMark />
                Web Production
              </p>
              <h1 className="svc-h1 svc-h1--long text-white mt-4">
                <span>ホームページ制作</span>
              </h1>
              <p
                className="svc-jp svc-enter mt-6 md:mt-8 max-w-[36em] text-white/75 text-[15px] md:text-[17px] leading-[1.9] text-pretty"
                style={{ "--d": "380ms" } as React.CSSProperties}
              >
                伝えたいことが伝わる、シンプルで見やすいホームページを。<br className="hidden sm:block" />
                公開したあとの<span className="whitespace-nowrap">運用まで含めて</span>ご相談いただけます。
              </p>
            </div>

            <div className="mt-12 md:mt-16 svc-enter-fade" style={{ "--d": "520ms" } as React.CSSProperties}>
              <ReflowCanvas />
            </div>
          </div>
        </header>

        {/* 料金。AI仕組み化のページの料金の行と同じく、カーソルを乗せると色が付く */}
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-20 md:pt-28">
          <ul className="svc-plan-solo">
            <PlanRow featured={false}>
              <div className="grid lg:grid-cols-12 gap-x-10 gap-y-10 py-12 md:py-16">
                <div className="lg:col-span-5">
                  <h2 className="text-[1.625rem] md:text-[2rem] font-bold leading-[1.3]">制作費用</h2>
                  <p className="mt-8 md:mt-10 font-num font-bold text-[clamp(3rem,6.4vw,5rem)] leading-none tracking-[-0.02em]">
                    ¥50,000
                    <span className="text-[0.5em] font-medium ml-0.5">〜</span>
                  </p>
                  <p className="svc-plan-muted mt-4 text-[13px]">税別 / 一度きり</p>
                </div>

                {/* 1023px以下は縦に積む。横に並べると右の列が狭く、文の途中で折り返してしまう */}
                <div className="lg:col-span-7 lg:col-start-6 lg:pt-1 flex flex-col items-start">
                  <p className="svc-jp svc-plan-body text-pretty text-[15px] md:text-[16px] leading-[1.9]">
                    <Lines text={"ページ数や必要な機能によって変わります。\n{内容をお伺いしたうえで、}{正式なお見積りをご提示します。}\n個人・フリーランスの方向けの{プランもご用意しています。}"} />
                  </p>
                  <Link href="/#contact" className="svc-btn svc-btn--plan mt-8">
                    無料でお見積りを依頼する
                    <Arrow />
                  </Link>
                  <p className="svc-plan-muted mt-4 text-[13px]">お見積りまでは費用をいただきません</p>
                </div>
              </div>
            </PlanRow>
          </ul>
        </div>

        {/* こんな方に。カードに入れず、一文ずつ大きく読ませる。料金の行の下の線がそのまま区切りになる */}
        <section>
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-24 md:py-32">
            <h2 className="svc-h2 text-white">
              <PhraseWrap text="こんな方にご利用いただけます" />
            </h2>
            <ul className="mt-12 md:mt-16 border-b border-white/10">
              {targets.map((target) => (
                <li
                  key={target}
                  className="svc-slide svc-jp flex items-start gap-4 md:gap-5 border-t border-white/10 py-6 md:py-8 text-white text-[clamp(1.125rem,2.3vw,1.75rem)] font-bold leading-[1.5] text-pretty"
                >
                  <CheckIcon className="text-[#7dd8ca] md:w-5 md:h-5" />
                  <span>
                    <Lines text={target} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 標準で含まれるもの。追加料金のかからない安心材料なので、一段明るい面に切り替えて落ち着いて読ませる */}
        <section className="px-3 md:px-5">
          <div className="svc-open rounded-2xl bg-[#e0f7f4] text-[#1a2e35]">
            <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-20 md:py-28">
              <h2 className="svc-h2">標準で含まれるもの</h2>
              <div className="mt-12 md:mt-16 border-b border-[#1a2e35]/15">
                {included.map((item, i) => (
                  // 見出しと本文を横に並べるのは 1280px から。1024px だと右の列が狭く、本文が指定の位置より手前で折れる
                  <div key={item.title} className="grid xl:grid-cols-12 gap-x-10 gap-y-4 border-t border-[#1a2e35]/15 py-8 md:py-10">
                    <div className="xl:col-span-5 flex items-center gap-5">
                      <IncludedGlyph kind={i} />
                      <h3 className="text-[1.25rem] md:text-[1.5rem] font-bold leading-[1.45]">{item.title}</h3>
                    </div>
                    <p className="svc-jp xl:col-span-7 max-w-[40em] text-[#1a2e35]/75 text-[15px] leading-[1.9] xl:pt-1">
                      <Lines text={item.body} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 制作の流れ。この順でしか進まない本物の手順なので、番号を振る。
            線はスクロールに合わせて伸び、図のページが4コマで出来上がっていく。
            横4列は 1280px から（1024px の4列は本文が細切れに折れるので、縦のまま） */}
        <section>
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-24 md:py-32">
            <h2 className="svc-h2 text-white">制作の流れ</h2>
            <ol className="svc-steps svc-steps--lg mt-14 md:mt-20 grid xl:grid-cols-4 gap-12 xl:gap-7">
              {flow.map((item, i) => (
                <li key={item.step} className="relative pl-9 xl:pl-0 xl:pt-12">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[2px] xl:top-0 w-[9px] h-[9px] rounded-full bg-[#7dd8ca] ring-4 ring-[#0f1e24]"
                  />
                  <div className="mb-6">
                    <FlowGlyph step={i} />
                  </div>
                  <h3 className="flex items-baseline gap-3 text-white">
                    <span aria-hidden="true" className="font-num text-[#7dd8ca] text-[15px] font-medium">
                      {item.step}
                    </span>
                    <span className="text-[1.5rem] md:text-[1.75rem] xl:text-[1.625rem] font-bold leading-[1.3] whitespace-nowrap">
                      {item.title}
                    </span>
                  </h3>
                  <p className="svc-jp mt-4 text-white/70 text-[15px] leading-[1.9] max-w-[34em]">
                    <Lines text={item.body} />
                  </p>
                </li>
              ))}
            </ol>
            <p className="svc-jp mt-16 md:mt-20 pt-8 border-t border-white/10 text-white/80 text-[17px] leading-[1.9]">
              <strong className="text-[#9fe8dc] font-bold whitespace-nowrap">最短5営業日</strong>から。<span className="whitespace-nowrap">内容によって期間は変わります。</span>
            </p>
          </div>
        </section>

        {/* 公開後の運用 → AI仕組み化への導線。見出しは全幅、本文とボタンはその下に並べる */}
        <section className="border-t border-white/10">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-24 md:py-36">
            <h2 className="svc-display svc-rise text-white">
              <PhraseWrap text="作ったあとの、問い合わせ対応まで" />
            </h2>
            <div className="svc-rise mt-10 md:mt-14 grid lg:grid-cols-12 gap-x-10 gap-y-10 lg:items-end">
              <p className="svc-jp lg:col-span-8 text-white/70 text-[15px] md:text-[17px] leading-[1.95]">
                <Lines text={"ホームページができると、問い合わせが届くようになります。\nその返信を{一件ずつ書くのは、}想像以上に{時間を取られます。}\nAllovvは、{その返信の下書きまでを}AIに任せる{仕組みまでご用意しています。}\n{作って終わりではなく、}{届いたあとの手間まで}含めてご相談ください。"} />
              </p>
              <div className="lg:col-span-4 lg:justify-self-end">
                <Link href="/services/ai-consulting" className="svc-btn svc-btn--ghost">
                  AI仕組み化の料金を見る
                  <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA。最後に、帯で出来上がったページが同じ歩調で流れていき、話を閉じる */}
        <section className="border-t border-white/10">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-28 md:pt-40 pb-16 md:pb-20">
            <p className="svc-kicker">
              <FrameMark />
              Contact
            </p>
            <h2 className="svc-cta-h svc-rise text-white mt-6">まずはご相談ください</h2>
            <div className="mt-12 md:mt-16 pt-8 border-t border-white/10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              <p className="svc-jp text-white/70 text-[15px] md:text-[17px] leading-[1.9]">
                <Lines text={"どんなホームページにしたいか決まっていない{段階で構いません。}\nご状況をお伺いしたうえで、{必要な内容と金額を}ご提示します。"} />
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-6 shrink-0">
                <Link href="/#contact" className="svc-btn svc-btn--pastel self-start sm:self-auto">
                  無料相談はこちら
                  <Arrow />
                </Link>
                <Link href="/faq" className="svc-link self-start sm:self-auto text-[14px]">
                  よくあるご質問はこちら
                  <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <div className="pb-16 md:pb-24">
          <div aria-hidden="true" className="svc-march">
            <div className="svc-march-track" style={{ backgroundImage: marchTile }} />
          </div>
        </div>

      </main>
      <Footer seamless />
    </>
  )
}
