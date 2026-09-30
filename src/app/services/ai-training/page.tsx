import { Fragment } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { PlanRow } from "@/components/services/plan-row"
import { TrainingCanvas } from "@/components/services/training-canvas"
import { TrainingMark } from "@/components/services/training-mark"
import { TrainingScene } from "@/components/services/training-scene"
import { PhraseWrap } from "@/components/phrase-wrap"
import { ORG_ID, SITE_URL, breadcrumbJsonLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "社員向けAI研修（AI活用研修）の内容と料金",
  description:
    "Allovvの社員向けAI活用研修です。生成AIの基礎とやってはいけないこと、指示文（プロンプト）の書き方と社内の型づくり、バックオフィス・営業・会議でのAI活用を、貴社の実際の業務・書類を教材に学びます。全10〜12時間・1社5名まで・¥150,000〜（税別）。オンライン・訪問どちらにも対応し、受講後に社内マニュアルをお渡しします。",
  path: "/services/ai-training",
})

// このページに書くのは、料金ページの研修カードと FAQ にある事実だけ（2026-09-26 ユーザー指示
// 「今の記載だけで作る」）。受講者の声・実績・カリキュラムの細目は、確認が取れるまで足さない。
// バックオフィス・営業・会議でのAI活用は 2026-09-30 のユーザー指示で追加（カードと FAQ にも同じ内容を載せた）
const specs = [
  { label: "時間", value: "全10〜12時間", note: "{半日×3回など、}{日程はご相談}" },
  { label: "人数", value: "1社5名まで", note: "{人数の追加は}{ご相談ください}" },
  { label: "形式", value: "{オンライン・}{貴社への訪問}", note: "{どちらにも}{対応します}" },
  { label: "受講後", value: "社内マニュアル", note: "{受講後に見返せる形で}{お渡しします}" },
]

// 本文の改行の目印。\n＝768px 以上で改行、^＝どの幅でも改行、{ }＝途中で折り返さない語句
const topics = [
  {
    title: "{生成AIの基礎と、}^{やってはいけないこと}",
    body: "仕事で使い始める前に{押さえておきたい}{生成AIの基礎と、}{やってはいけない使い方を}扱います。",
  },
  {
    title: "{指示文（プロンプト）の}^{書き方と、}{社内の型づくり}",
    body: "AIへの指示文の書き方を練習し、{社内で繰り返し使える}{指示の型をつくります。}",
  },
  {
    title: "{バックオフィスでのAI活用}",
    body: "{書類の作成や確認など、}^{バックオフィスでの}{AIの使い方を扱います。}",
  },
  {
    title: "{営業でのAI活用}",
    body: "{提案の準備や}{お客様とのやりとりなど、}^{営業でのAIの使い方を扱います。}",
  },
  {
    title: "{会議でのAI活用}",
    body: "{会議の準備や}{内容のまとめなど、}^{会議でのAIの使い方を扱います。}",
  },
]

// 「オンライン・貴社」のように「・」でつないだ語は、途中で折り返さない
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

// 改行の目印（\n と ^）の付いた本文を描く。{ } で囲んだ語句は途中で折り返さない（スマホで「持ち／帰れます」のように割れるのを防ぐ）。
// 語句の後ろには <wbr> を置く。Chrome の語句単位の折り返し（auto-phrase）は「学ぶ｜社員」のような語句の境目で
// 折り返さないことがあり、2つの語句がつながったまま 320px の枠からはみ出したため
function Lines({ text }: { text: string }) {
  return text.split(/(\n|\^|\{[^}]*\})/).map((part, i) => {
    if (part === "\n") return <br key={i} className="hidden md:block" />
    if (part === "^") return <br key={i} />
    if (part.startsWith("{"))
      return (
        <Fragment key={i}>
          <span className="whitespace-nowrap">{part.slice(1, -1)}</span>
          <wbr />
        </Fragment>
      )
    return <Fragment key={i}>{keepJoined(part)}</Fragment>
  })
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

// 「研修で扱うこと」の各項目の枠。1024px 以上では上の段に2つ（6列の半分ずつ）、下の段に3つ（3分の1ずつ）並べ、
// 項目のあいだを縦線で仕切る。それより狭い幅では1列に積み、横線で仕切る
const topicCell = [
  "lg:col-span-3 lg:pr-10",
  "lg:col-span-3 border-t lg:border-t-0 lg:border-l lg:pl-10",
  "lg:col-span-2 border-t lg:pr-8",
  "lg:col-span-2 border-t lg:border-l lg:px-8",
  "lg:col-span-2 border-t lg:border-l lg:pl-8",
]

// 「研修で扱うこと」の印。明るい面の上なので紺で描く（絵文字の代わり）。
// ヒーローの帯と同じ部品（書いた行・型の枠）でできている
const INK = "#1a2e35"
function TopicGlyph({ kind }: { kind: number }) {
  const common = { viewBox: "0 0 64 48", "aria-hidden": true, className: "shrink-0 w-16 h-12 md:w-20 md:h-[60px]" } as const
  // 基礎の行が並び、最後の一行だけ線で消してある＝やってはいけない使い方
  if (kind === 0) {
    return (
      <svg {...common}>
        <rect x="4" y="9" width="6" height="5" rx="1.4" fill={INK} />
        <rect x="14" y="9" width="40" height="5" rx="1.4" fill={INK} fillOpacity=".75" />
        <rect x="4" y="21.5" width="6" height="5" rx="1.4" fill={INK} />
        <rect x="14" y="21.5" width="30" height="5" rx="1.4" fill={INK} fillOpacity=".75" />
        <rect x="4" y="34" width="6" height="5" rx="1.4" fill={INK} fillOpacity=".28" />
        <rect x="14" y="34" width="36" height="5" rx="1.4" fill={INK} fillOpacity=".28" />
        <path d="M1.5 36.5h55" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  // 点線の型の枠。一段目にだけ言葉が入り、同じ型を下の段でも繰り返し使う
  if (kind === 1) {
    return (
      <svg {...common} fill="none" stroke={INK} strokeWidth="1.2">
        <rect x="4" y="9" width="6" height="5" rx="1.4" fill={INK} stroke="none" />
        <rect x="14" y="9" width="22" height="5" rx="1.4" fill={INK} fillOpacity=".75" stroke="none" />
        <rect x="40" y="9" width="16" height="5" rx="1.4" fill={INK} fillOpacity=".75" stroke="none" />
        {[21.5, 34].map((y) => (
          <g key={y} strokeDasharray="3 2" strokeOpacity=".55">
            <rect x="4.6" y={y + 0.6} width="4.8" height="3.8" rx="1.2" />
            <rect x="14.6" y={y + 0.6} width="20.8" height="3.8" rx="1.2" />
            <rect x="40.6" y={y + 0.6} width="14.8" height="3.8" rx="1.2" />
          </g>
        ))}
      </svg>
    )
  }
  // バックオフィス。項目の埋まった書類に、確認済みの印
  if (kind === 2) {
    return (
      <svg {...common} fill="none">
        <rect x="4.7" y="3.7" width="32.6" height="40.6" rx="3" stroke={INK} strokeWidth="1.4" />
        {[11, 19, 27].map((y, i) => (
          <g key={y} fill={INK}>
            <rect x="9.5" y={y} width="5" height="4" rx="1.2" />
            <rect x="17" y={y} width={[15, 11, 13][i]} height="4" rx="1.2" fillOpacity=".75" />
          </g>
        ))}
        <rect x="9.5" y="35" width="5" height="4" rx="1.2" fill={INK} fillOpacity=".28" />
        <rect x="17" y="35" width="9" height="4" rx="1.2" fill={INK} fillOpacity=".28" />
        <circle cx="48" cy="33" r="9" fill={INK} />
        <path d="M43.8 33.2l3 3 5.4-6" stroke="#e0f7f4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  // 営業。こちらからの提案と、お客様からの返事が行き交う
  if (kind === 3) {
    return (
      <svg {...common} fill="none">
        <rect x="4.7" y="4.7" width="34.6" height="17.6" rx="3" stroke={INK} strokeWidth="1.4" />
        <rect x="9.5" y="9.5" width="22" height="3.6" rx="1.1" fill={INK} fillOpacity=".75" />
        <rect x="9.5" y="15" width="14" height="3.6" rx="1.1" fill={INK} fillOpacity=".45" />
        <rect x="24" y="25.5" width="36" height="18" rx="3" fill={INK} />
        <rect x="29" y="30.5" width="24" height="3.6" rx="1.1" fill="#e0f7f4" fillOpacity=".85" />
        <rect x="29" y="36" width="15" height="3.6" rx="1.1" fill="#e0f7f4" fillOpacity=".5" />
      </svg>
    )
  }
  // 会議。参加者それぞれの話が、下の一枚のまとめに集まる
  return (
    <svg {...common} fill="none">
      {[10, 22, 34, 46].map((x) => (
        <g key={x}>
          <circle cx={x} cy="8" r="4" fill={INK} fillOpacity={x === 10 ? 1 : 0.75} />
          <path d={`M${x} 14v6`} stroke={INK} strokeWidth="1.2" strokeDasharray="2 2" strokeOpacity=".55" />
        </g>
      ))}
      <rect x="4.7" y="21.7" width="48.6" height="22.6" rx="3" stroke={INK} strokeWidth="1.4" />
      <rect x="9.5" y="27" width="5" height="4" rx="1.2" fill={INK} />
      <rect x="17" y="27" width="28" height="4" rx="1.2" fill={INK} fillOpacity=".75" />
      <rect x="9.5" y="35" width="5" height="4" rx="1.2" fill={INK} />
      <rect x="17" y="35" width="19" height="4" rx="1.2" fill={INK} fillOpacity=".75" />
    </svg>
  )
}

// 受講後にお渡しする社内マニュアルの印。ヒーローの帯で、書き上げた型が綴じられていく束と同じ形
function ManualGlyph() {
  return (
    <svg width="36" height="44" viewBox="0 0 36 44" aria-hidden="true" className="shrink-0">
      <rect x="9.75" y="7.75" width="24" height="32" rx="3" fill="#3f6f6c" stroke="#0f1e24" strokeWidth="1.5" />
      <rect x="4.75" y="3.75" width="24" height="32" rx="3" fill="#7dd8ca" stroke="#0f1e24" strokeWidth="1.5" />
      {[11, 17, 23].map((y, i) => (
        <g key={y} fill="#0f1e24" fillOpacity={i === 2 ? 0.35 : 0.6}>
          <rect x="8.5" y={y} width="3.5" height="2.2" rx=".7" />
          <rect x="14" y={y} width={i === 2 ? 7 : 11} height="2.2" rx=".7" />
        </g>
      ))}
    </svg>
  )
}

// 問い合わせ欄の下を流れる、綴じ終えた社内マニュアルの列。ヒーローの帯の束と同じ形
const marchTile = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="36" viewBox="0 0 56 36">' +
    '<rect x="18" y="4" width="20" height="28" rx="2.5" fill="#7dd8ca"/>' +
    '<g fill="#0f1e24" fill-opacity=".6">' +
    '<rect x="21" y="10" width="3" height="2" rx=".6"/><rect x="25.5" y="10" width="9.5" height="2" rx=".6"/>' +
    '<rect x="21" y="15" width="3" height="2" rx=".6"/><rect x="25.5" y="15" width="9.5" height="2" rx=".6"/>' +
    "</g>" +
    '<g fill="#0f1e24" fill-opacity=".35">' +
    '<rect x="21" y="20" width="3" height="2" rx=".6"/><rect x="25.5" y="20" width="6" height="2" rx=".6"/>' +
    "</g>" +
    "</svg>",
)}")`

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI活用研修",
    serviceType: "AI研修",
    description:
      "生成AIの基礎とやってはいけないこと、指示文（プロンプト）の書き方と社内の型づくり、バックオフィス・営業・会議でのAI活用を、貴社の実際の業務・書類を教材に学ぶ社員向け研修です。全10〜12時間、1社5名まで。受講後に社内マニュアルをお渡しします。",
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
      <main id="main" className="min-h-screen bg-[#0f1e24] overflow-x-clip">

        {/* Hero。背景に「講師がスクリーンのまえで研修している」図を敷き、見出しを左下に大きく、説明を右下に添える。
            その下の帯で「5人が別々に書いた指示文が、同じ型に揃い、社内マニュアルに綴じられる」様子を見せる */}
        <header>
          <div className="relative">
            <TrainingScene />
            <div className="relative max-w-[1200px] mx-auto px-5 md:px-10 pt-32 md:pt-40 flex flex-col min-h-[clamp(620px,100svh,760px)] lg:min-h-[clamp(620px,90svh,860px)]">
              <Link
                href="/#business"
                className="self-start inline-flex items-center gap-2 text-white/60 text-[13px] font-display tracking-[0.08em] hover:text-white transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                SERVICES
              </Link>

              <div className="mt-auto pt-40 grid lg:grid-cols-12 gap-x-10 gap-y-7 items-end">
                <div className="lg:col-span-7">
                  <p className="svc-kicker svc-enter">
                    <TrainingMark />
                    Training
                  </p>
                  <h1 className="svc-h1 text-white mt-4">
                    <span>AI活用研修</span>
                  </h1>
                </div>
                <p
                  className="svc-jp svc-enter lg:col-span-5 max-w-[34em] text-white/80 text-[15px] md:text-[17px] leading-[1.9] text-pretty lg:pb-3"
                  style={{ "--d": "380ms" } as React.CSSProperties}
                >
                  <Lines text={"{貴社の実際の業務と書類を}{教材に、}^{生成AIの使い方を学ぶ}{社員向けの研修です。}^{研修のみのご依頼も}{承ります。}"} />
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto px-5 md:px-10">
            <div className="mt-12 md:mt-16 svc-enter-fade" style={{ "--d": "520ms" } as React.CSSProperties}>
              <TrainingCanvas />
            </div>
          </div>
        </header>

        {/* 料金と研修の条件。ほかのサービスのページの料金の行と同じく、カーソルを乗せると色が付く */}
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-20 md:pt-28">
          <ul className="svc-plan-solo">
            <PlanRow featured={false}>
              <div className="grid lg:grid-cols-12 gap-x-10 gap-y-10 py-12 md:py-16">
                <div className="lg:col-span-5">
                  <h2 className="text-[1.625rem] md:text-[2rem] font-bold leading-[1.3]">研修費用</h2>
                  <p className="mt-8 md:mt-10 font-num font-bold text-[clamp(3rem,6.4vw,5rem)] leading-none tracking-[-0.02em]">
                    ¥150,000
                    <span className="text-[0.5em] font-medium ml-0.5">〜</span>
                  </p>
                  <p className="svc-plan-muted mt-4 text-[13px]">税別 / 1社5名まで</p>
                </div>

                <div className="lg:col-span-7 lg:col-start-6 lg:pt-1 flex flex-col items-start">
                  <dl className="w-full">
                    {specs.map((spec, i) => (
                      <div
                        key={spec.label}
                        className={`grid grid-cols-[4.5rem_1fr] sm:grid-cols-[6rem_1fr] gap-x-4 py-4 md:py-5 ${i > 0 ? "border-t svc-plan-line" : "pt-0 md:pt-0"}`}
                      >
                        <dt className="svc-plan-muted text-[14px] leading-[1.7]">{spec.label}</dt>
                        <dd className="sm:flex sm:flex-wrap sm:items-baseline sm:gap-x-5">
                          <p className="font-bold text-[16px] md:text-[17px] leading-[1.6]">
                            <Lines text={spec.value} />
                          </p>
                          <p className="svc-plan-body text-[14px] leading-[1.7] mt-0.5 sm:mt-0">
                            <Lines text={spec.note} />
                          </p>
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Link href="/#contact" className="svc-btn svc-btn--plan mt-8">
                    研修について相談する
                    <Arrow />
                  </Link>
                </div>
              </div>
            </PlanRow>
          </ul>
        </div>

        {/* 研修で扱うこと。上の段に土台になる2つ（基礎・指示の型）を大きく、下の段に実際の業務での使い方3つを並べる */}
        <section className="px-3 md:px-5 pt-24 md:pt-32">
          <div className="svc-open rounded-2xl bg-[#e0f7f4] text-[#1a2e35]">
            <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-20 md:py-28">
              <h2 className="svc-h2">研修で扱うこと</h2>
              <div className="mt-12 md:mt-16 grid lg:grid-cols-6 border-y border-[#1a2e35]/15">
                {topics.map((topic, i) => (
                  <div key={topic.title} className={`py-10 md:py-12 border-[#1a2e35]/15 ${topicCell[i]}`}>
                    <TopicGlyph kind={i} />
                    <h3
                      className={`mt-7 md:mt-8 font-bold leading-[1.45] ${
                        i < 2
                          ? "text-[1.375rem] md:text-[1.75rem]"
                          : "text-[1.25rem] md:text-[1.5rem] lg:text-[1.25rem] xl:text-[1.5rem]"
                      }`}
                    >
                      <Lines text={topic.title} />
                    </h3>
                    <p className="svc-jp mt-4 md:mt-5 max-w-[30em] text-[#1a2e35]/75 text-[15px] md:text-[16px] leading-[1.9]">
                      <Lines text={topic.body} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* このページでいちばん伝えたいこと。一文を大きく置き、「貴社の実際の業務と書類」にだけ蛍光ペンを引く */}
        <section>
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-24 md:py-36">
            <h2 className="svc-display svc-rise text-white">
              <span className="whitespace-nowrap">教材は、</span>
              <mark className="svc-mark">
                <span className="whitespace-nowrap">貴社の実際の</span>
              </mark>
              <span className="whitespace-nowrap">
                <mark className="svc-mark svc-mark--2">業務と書類</mark>です。
              </span>
            </h2>
            <p className="svc-jp svc-rise mt-10 md:mt-14 max-w-[40em] text-white/70 text-[15px] md:text-[17px] leading-[1.95]">
              <Lines text={"研修では、{普段お使いの書類や}{日々の業務を}{そのまま教材にします。}\n{練習した内容を、}{そのまま日々の仕事に}{持ち帰れます。}"} />
            </p>
            <p className="svc-jp mt-16 md:mt-20 pt-8 border-t border-white/10 flex items-center gap-5 text-white/80 text-[15px] md:text-[17px] leading-[1.9]">
              <ManualGlyph />
              <span>
                {"受講後には、見返せる"}
                <strong className="text-[#9fe8dc] font-bold whitespace-nowrap">社内マニュアル</strong>
                <span className="whitespace-nowrap">をお渡しします。</span>
              </span>
            </p>
          </div>
        </section>

        {/* 研修のあと → AI仕組み化への導線。見出しは左、本文とボタンは右に置く */}
        <section className="border-t border-white/10">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-24 md:py-32 grid lg:grid-cols-12 gap-x-10 gap-y-8">
            <h2 className="svc-h2 svc-rise text-white lg:col-span-5">
              <PhraseWrap text="業務そのものを、AIに任せたいときは" />
            </h2>
            <div className="svc-rise lg:col-span-7 lg:pt-2">
              <p className="svc-jp text-white/70 text-[15px] md:text-[17px] leading-[1.95]">
                <Lines text={"研修は、社員の方がAIを{使いこなすためのものです。}\n{見積書の作成や議事録のように、}{決まった業務をAIが}{下書きまで用意する仕組みにしたい場合は、}{AI導入コンサルティング（AI仕組み化）で}{承ります。}"} />
                <span className="whitespace-nowrap">
                  <strong className="text-[#9fe8dc] font-bold">1業務あたり¥50,000〜</strong>（税別）です。
                </span>
              </p>
              <Link href="/services/ai-consulting" className="svc-btn svc-btn--ghost mt-10">
                進め方と料金を見る
                <Arrow />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact CTA。最後に、綴じ終えたマニュアルが同じ歩調で流れていき、話を閉じる */}
        <section className="border-t border-white/10">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-28 md:pt-40 pb-16 md:pb-20">
            <p className="svc-kicker">
              <TrainingMark />
              Contact
            </p>
            <h2 className="svc-cta-h svc-rise text-white mt-6">まずはご相談ください</h2>
            <div className="mt-12 md:mt-16 pt-8 border-t border-white/10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              <p className="svc-jp text-white/70 text-[15px] md:text-[17px] leading-[1.9]">
                <Lines text={"{日程や人数をお伺いしたうえで、}{研修の内容と金額をご提示します。}"} />
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
