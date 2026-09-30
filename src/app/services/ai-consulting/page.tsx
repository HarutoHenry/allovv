import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PricingExampleToggle } from "@/components/services/pricing-example-toggle"
import { IndustryCases } from "@/components/services/industry-cases"
import { SystemizeCanvas } from "@/components/services/systemize-canvas"
import { SlipMark } from "@/components/services/slip-mark"
import { PlanRow } from "@/components/services/plan-row"
import { JsonLd } from "@/components/json-ld"
import { PhraseWrap } from "@/components/phrase-wrap"
import { ORG_ID, SITE_URL, breadcrumbJsonLd, pageMetadata, yen } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "AI導入コンサルティング（AI仕組み化）の進め方と料金",
  description:
    "AllovvのAI導入コンサルティングは、業務の洗い出しから始めて、AIで置き換えられるところから実装します。業務設計→AI構築→標準化の進め方、AIに任せられる業務の例、情報の取り扱い、料金（1業務¥50,000〜・AI活用研修¥150,000〜、税別）をご案内します。",
  path: "/services/ai-consulting",
})

const plans = [
  {
    id: "training",
    badge: "研修",
    title: "AI活用研修",
    subtitle: "従業員向け・全10〜12時間",
    price: "¥150,000〜",
    priceNote: "税別 / 1社5名まで",
    featured: false,
    ctaLabel: "研修の内容を見る",
    ctaHref: "/services/ai-training",
    features: [
      "全10〜12時間（半日×3回など、日程はご相談）",
      "1社5名まで（人数の追加はご相談ください）",
      "貴社の実際の業務・書類を教材に使います",
      "生成AIの基礎と、やってはいけないこと",
      "指示文（プロンプト）の書き方と社内の型づくり",
      "受講後に見返せる社内マニュアルをお渡しします",
      "オンライン・貴社への訪問どちらも対応",
    ],
    featuresLabel: null,
    featureNote: null,
  },
  {
    id: "efficiency",
    badge: "人気No.1",
    title: "AIによる業務効率化",
    subtitle: "1業務からご依頼いただけます",
    price: "¥50,000〜",
    priceNote: "1業務あたり / 税別",
    featured: true,
    ctaLabel: "お問い合わせ",
    ctaHref: "/#contact",
    featuresLabel: "対応できる業務を見る",
    features: [
      "メール対応（問い合わせ返信を下書きまで）",
      "見積書の作成（過去の見積を元に金額入りで）",
      "シフト作成（希望と人数からたたき台を）",
      "打ち合わせの議事録（録音から決定事項を）",
      "契約書・規程のチェック（抜け・気になる点の洗い出し）",
      "発注予測（飲食店。次に頼む量と抜けを出す）",
      "事業承継・引き継ぎを楽にする業務AI化（ベテランの手順を手順書に）",
    ],
    featureNote: {
      label: null,
      items: [
        "業務の内容によって金額は変わります。お見積りはヒアリングのうえでご提示します",
        "業務フローのヒアリングから構築・レクチャーまで込み",
        "まずは1業務から始めていただけます",
        "導入後の運用と改善をご希望の場合は、月額¥30,000（税別）からの運用契約で承ります",
      ],
    },
  },
  {
    id: "advanced",
    badge: "高機能",
    title: "高機能AI導入サポート",
    subtitle: "Cursor・Codex",
    price: "お見積り",
    priceNote: "要件に応じてご提示",
    featured: false,
    ctaLabel: "お問い合わせ",
    ctaHref: "/#contact",
    features: [
      "CursorによるAIコーディング環境構築",
      "OpenAI Codexによる自動化システム開発",
      "開発者向けAIワークフロー設計",
      "カスタムAIエージェント構築",
      "専任エンジニアサポート",
    ],
    featuresLabel: null,
    featureNote: null,
  },
]

// 料金のあとに置く説明の文面。書いてよいのは FAQ と料金カードにある事実だけ。
// 実績・数字・新しい約束はここで足さない（足すときは先にユーザーに確認する）
const steps = [
  {
    num: "01",
    title: "業務設計",
    body: "業務の流れをお伺いし、AIで置き換えるところと人が残すところを決めます。普段お使いの書式・文面・言い回しや、社内の手順もここで確認します。",
  },
  {
    num: "02",
    title: "AI構築",
    body: "確認した書式や手順に合わせて、AIが下書きを用意する仕組みを構築し、テスト運用で調整します。構築・設定はすべてAllovvが行うので、ITに詳しくなくても進められます。",
  },
  {
    num: "03",
    title: "標準化",
    body: "操作マニュアルをお渡しし、レクチャーで使い方を揃えます。人が代わっても同じ品質で回る形にしたうえで、導入後1ヶ月は調整と質問対応でサポートします。",
  },
]

// 返信の自動化だけの会社に見えないよう、問い合わせ返信を先頭に置かない（AGENTS.md）
const tasks = [
  { name: "見積書の作成", body: "過去の見積を元に、金額入りの下書きを用意します。" },
  { name: "打ち合わせの議事録", body: "録音から、決定事項をまとめます。" },
  { name: "シフト作成", body: "希望と人数から、たたき台をつくります。" },
  { name: "問い合わせへの返信", body: "届いた問い合わせへの返信を、下書きまで用意します。" },
  { name: "契約書・規程のチェック", body: "抜けや気になる点を洗い出します。" },
  { name: "発注予測", body: "飲食店向け。次に頼む量と抜けを出します。" },
  { name: "手順書づくり", body: "ベテランの手順を、引き継げる手順書にします。" },
]

const assurances = [
  {
    title: "AIが用意するのは、下書きまでです",
    body: "最終的な確認と判断は人が行う設計です。AIの出力が、そのまま社外に出ることはありません。",
  },
  {
    title: "お客様のデータは、AIの学習に使われません",
    body: "利用するAI（Anthropic社の商用API）は、お客様のデータをAIの学習に利用しない契約形態です。仕組みはお客様ご自身のアカウント上に構築するため、当方がデータを常時閲覧することもありません。",
  },
  {
    title: "導入後も、実際の業務に合わせて調整します",
    body: "導入後1ヶ月のサポート期間中に、AIへの指示を調整して精度を高めます。その後も続けたい場合は、月額¥30,000（税別）からの運用契約をご用意しています。運用契約はいつでも解約でき、解約後も仕組みはそのまま使い続けられます。",
  },
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

// 手順ごとの小さな図。ヒーローの帯と同じ話（散らばった書類 → 揃う → 同じ形で回る）を3コマで見せる
const slips = [4, 24, 44]
function StepGlyph({ step }: { step: number }) {
  if (step === 0) {
    return (
      <svg width="64" height="40" viewBox="0 0 64 40" aria-hidden="true" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2">
        <rect x="5" y="13" width="15" height="20" rx="2" transform="rotate(-16 12.5 23)" />
        <rect x="25" y="5" width="15" height="20" rx="2" transform="rotate(11 32.5 15)" />
        <rect x="45" y="15" width="15" height="20" rx="2" transform="rotate(-6 52.5 25)" />
      </svg>
    )
  }
  const filled = step === 2
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" aria-hidden="true">
      {slips.map((x) => (
        <g key={x}>
          <rect
            x={x + 0.6}
            y="10.6"
            width="14.8"
            height="19.8"
            rx="2"
            fill={filled ? "#7dd8ca" : "none"}
            stroke="#7dd8ca"
            strokeWidth="1.2"
          />
          {[16, 20, 24].map((y, i) => (
            <rect
              key={y}
              x={x + 3.5}
              y={y}
              width={[8, 6, 7][i]}
              height="1.3"
              fill={filled ? "#0f1e24" : "#7dd8ca"}
              opacity={filled ? 0.6 : 0.7}
            />
          ))}
        </g>
      ))}
    </svg>
  )
}

// 問い合わせ欄の下を流れる書類の列。ヒーローの帯で最後に揃った書類と同じ形
const marchTile = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="36" viewBox="0 0 56 36">' +
    '<rect x="17" y="3.5" width="22" height="29" rx="3" fill="#7dd8ca"/>' +
    '<rect x="21.5" y="11" width="12" height="2" fill="#0f1e24" fill-opacity=".6"/>' +
    '<rect x="21.5" y="16.5" width="9" height="2" fill="#0f1e24" fill-opacity=".6"/>' +
    '<rect x="21.5" y="22" width="10.5" height="2" fill="#0f1e24" fill-opacity=".6"/>' +
    "</svg>",
)}")`

// 検索エンジン向けに「何の、誰の、いくらのサービスか」を機械が読める形で渡す。料金は上の plans から作る
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI導入コンサルティング（AI仕組み化）",
    serviceType: "AI導入コンサルティング",
    description:
      "業務を洗い出し、AIで置き換えられるところから実装します。業務設計→AI構築→標準化の順で進め、人が代わっても同じ品質で回る形にします。",
    url: `${SITE_URL}/services/ai-consulting`,
    provider: { "@id": ORG_ID },
    areaServed: "JP",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AI仕組み化 料金プラン",
      itemListElement: plans.map((plan) => {
        const min = yen(plan.price)
        return {
          "@type": "Offer",
          name: plan.title,
          description: plan.subtitle,
          ...(min && {
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: min,
              priceCurrency: "JPY",
              valueAddedTaxIncluded: false,
            },
          }),
        }
      }),
    },
  },
  breadcrumbJsonLd([
    { name: "TOP", path: "/" },
    { name: "AI導入コンサルティング", path: "/services/ai-consulting" },
  ]),
]

export default function AiConsultingPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Navigation />
      <main id="main" className="min-h-screen bg-[#0f1e24] overflow-x-clip">

        {/* Hero。見出しを左に大きく置き、説明は右下に添える。下の帯で「ばらばらの業務が揃っていく」様子を見せる */}
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

            <div className="mt-10 md:mt-14 grid md:grid-cols-12 gap-x-10 gap-y-7 items-end">
              <div className="md:col-span-7">
                <p className="svc-kicker svc-enter">
                  <SlipMark />
                  Systemize
                </p>
                <h1 className="svc-h1 text-white mt-4">
                  <span>AI仕組み化</span>
                </h1>
              </div>
              <p
                className="svc-jp svc-enter md:col-span-5 text-white/75 text-[15px] md:text-[17px] leading-[1.9] text-pretty md:pb-3"
                style={{ "--d": "380ms" } as React.CSSProperties}
              >
                業務を洗い出し、AIで置き換えられるところから実装するAI導入コンサルティングです。人が代わっても同じ品質で回る形にします。
              </p>
            </div>

            {/* 着手順そのもの。設計 → 構築 → 標準化の順でしか進まないので、矢印が意味を持つ。
                帯の関門と同じ位置に名前を置き、書類がそこを通るたびに整っていく */}
            <div className="mt-12 md:mt-16 svc-enter-fade" style={{ "--d": "520ms" } as React.CSSProperties}>
              <SystemizeCanvas steps={["業務設計", "AI構築", "標準化"]} />
            </div>
          </div>
        </header>

        {/* 料金と導入例の切り替え */}
        <div className="pt-16 md:pt-24">
          <PricingExampleToggle
            pricingContent={
              <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-4 md:pt-8 pb-24 md:pb-32">
                <ul>
                  {plans.map((plan) => (
                    <PlanRow key={plan.id} featured={plan.featured}>
                      <div className="grid md:grid-cols-12 gap-x-10 gap-y-10 py-12 md:py-16">
                        <div className="md:col-span-6 lg:col-span-5">
                          <span className="svc-plan-badge inline-block px-3 py-1 rounded-full text-[12px] font-bold tracking-[0.04em]">
                            {plan.badge}
                          </span>
                          <h2 className="mt-5 text-[1.625rem] md:text-[2rem] font-bold leading-[1.3]">{plan.title}</h2>
                          <p className="svc-plan-muted mt-2 text-[14px] md:text-[15px]">{plan.subtitle}</p>

                          {plan.price === "お見積り" ? (
                            <p className="mt-8 md:mt-10 font-bold text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1]">{plan.price}</p>
                          ) : (
                            <p className="mt-8 md:mt-10 font-num font-bold text-[clamp(2.5rem,5vw,3.5rem)] leading-none tracking-[-0.02em]">
                              {plan.price.replace("〜", "")}
                              <span className="text-[0.5em] font-medium ml-0.5">〜</span>
                            </p>
                          )}
                          <p className="svc-plan-muted mt-3 text-[13px]">{plan.priceNote}</p>
                          <Link href={plan.ctaHref} className="svc-btn svc-btn--plan mt-7">
                            {plan.ctaLabel}
                            <Arrow />
                          </Link>
                        </div>

                        <div className="md:col-span-6 lg:col-span-6 lg:col-start-7 md:pt-1">
                          {/* featuresLabel があるプランは、長い一覧をプルダウンに畳む */}
                          {plan.featuresLabel ? (
                            <details className="svc-details">
                              <summary className="svc-plan-line flex items-center justify-between gap-4 py-4 border-y text-[15px] font-bold">
                                {plan.featuresLabel}
                                <svg
                                  className="svc-chev w-4 h-4 shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </summary>
                              <ul className="space-y-3 pt-5 pb-1">
                                {plan.features.map((feature) => (
                                  <li key={feature} className="svc-jp svc-plan-body text-pretty flex items-start gap-3 text-[15px] leading-[1.7]">
                                    <CheckIcon className="svc-plan-check" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </details>
                          ) : (
                            <ul className="space-y-3">
                              {plan.features.map((feature) => (
                                <li key={feature} className="svc-jp svc-plan-body text-pretty flex items-start gap-3 text-[15px] leading-[1.7]">
                                  <CheckIcon className="svc-plan-check" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          )}

                          {plan.featureNote && (
                            <ul className="mt-6 space-y-2.5">
                              {plan.featureNote.items.map((item) => (
                                <li key={item} className="svc-jp svc-plan-muted text-pretty flex items-start gap-3 text-[14px] leading-[1.75]">
                                  <CheckIcon className="svc-plan-check" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </PlanRow>
                  ))}
                </ul>

                {/* 料金の考え方（業務ごとの参考価格 → まとめると割引。率は公開しない）*/}
                <div className="mt-14 md:mt-20 pt-10 border-t border-white/10 grid lg:grid-cols-12 gap-x-10 gap-y-8">
                  <p className="svc-jp lg:col-span-7 text-white/70 text-[15px] leading-[1.9]">
                    料金は、AIに任せる業務の内容によって変わります。<br className="hidden md:block" />
                    2業務以上をお選びの場合は、合計から割り引いた一式価格でご提示します。<br className="hidden md:block" />
                    御社に必要な業務だけを選んでいただくため、最終的なお見積りはヒアリングのうえでご提示します。
                  </p>
                  <div className="lg:col-span-5 lg:col-start-8 space-y-4">
                    <p className="text-white/55 text-[13px]">すべての料金は税別です。詳細はお問い合わせください。</p>
                    <Link href="/faq" className="svc-jp svc-link svc-link--wrap text-[14px] leading-[1.9]">
                      よくあるご質問（セキュリティ・導入期間・費用）はこちら
                      <Arrow />
                    </Link>
                  </div>
                </div>
              </div>
            }
            examplesContent={<IndustryCases />}
          />
        </div>

        {/* ここから下は、検索から直接来た人向けの説明。トップの「料金を見る」から来た人には
            料金を先に見せたいので、説明は料金のあとに置く。見出しは全幅、本文の2段落はその下に左右に並べて、面を偏らせない */}
        <section className="border-t border-white/10">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-24 md:py-36">
            <h2 className="svc-display svc-rise text-white">
              <PhraseWrap text="AI導入コンサルティングは、業務の洗い出しから始めます" />
            </h2>
            <div className="svc-jp svc-rise mt-10 md:mt-14 grid md:grid-cols-2 gap-6 md:gap-10 text-white/70 text-[15px] md:text-[17px] leading-[1.95]">
              <p>
                最初に、日々の業務の流れをお伺いします。そのうえで、AIで置き換えられるところと人が残すべきところを整理し、効果の出やすい業務からご提案します。
              </p>
              <p>
                特定のツールを入れることが目的ではありません。洗い出しの結果、AIを使わないほうがよい業務であれば、そのようにお伝えします。ご相談は無料です。
              </p>
            </div>
          </div>
        </section>

        {/* 進め方。この順でしか進まない本物の手順なので、番号を振る。
            線はスクロールに合わせて左から伸び、ヒーローの帯と同じ「揃っていく」話を3コマで繰り返す */}
        <section className="border-t border-white/10">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-24 md:py-32">
            <h2 className="svc-h2 text-white">導入の進め方と期間</h2>
            <ol className="svc-steps mt-14 md:mt-20 grid md:grid-cols-3 gap-12 md:gap-10">
              {steps.map((step, i) => (
                <li key={step.num} className="relative pl-9 md:pl-0 md:pt-12">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[2px] md:top-0 w-[9px] h-[9px] rounded-full bg-[#7dd8ca] ring-4 ring-[#0f1e24]"
                  />
                  <div className="mb-6">
                    <StepGlyph step={i} />
                  </div>
                  <h3 className="flex items-baseline gap-3 text-white">
                    <span aria-hidden="true" className="font-num text-[#7dd8ca] text-[15px] font-medium">
                      {step.num}
                    </span>
                    <span className="text-[1.5rem] md:text-[1.75rem] font-bold leading-[1.3]">{step.title}</span>
                  </h3>
                  <p className="svc-jp mt-4 text-white/70 text-[15px] leading-[1.9]">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="svc-jp mt-16 md:mt-20 pt-8 border-t border-white/10 text-white/80 text-[17px] leading-[1.9] max-w-[62ch] lg:max-w-none">
              ご契約・ご入金の確認後、<strong className="text-[#9fe8dc] font-bold whitespace-nowrap">最短2営業日</strong>で導入できます。業務フローの整理から進める標準的な進行では、<span className="whitespace-nowrap">1〜2週間程度</span>が目安です。
            </p>
          </div>
        </section>

        {/* 任せられる業務の例。見出しは1行のまま上に置き、一覧は全幅で「業務名｜説明」を揃えて流す */}
        <section className="border-t border-white/10">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-24 md:py-32">
            <h2 className="svc-h2 text-white">AIに任せられる業務の例</h2>
            <p className="svc-jp mt-6 text-white/70 text-[15px] leading-[1.9] max-w-[62ch]">
              これらは一例です。実際に任せる業務は、御社の業務を伺ったうえで一緒に決めます。料金は1業務あたり
              <span className="font-num text-white font-medium">¥50,000〜</span>
              （税別）です。
            </p>
            <dl className="mt-12 md:mt-16 border-b border-white/10">
              {tasks.map((task) => (
                <div key={task.name} className="svc-slide grid sm:grid-cols-12 gap-x-8 gap-y-2 border-t border-white/10 py-6 md:py-7">
                  <dt className="svc-jp text-balance sm:col-span-5 lg:col-span-4 text-white font-bold text-[clamp(1.25rem,2.2vw,1.625rem)] leading-[1.35]">
                    {task.name}
                  </dt>
                  <dd className="svc-jp sm:col-span-7 lg:col-span-8 text-white/65 text-[15px] leading-[1.8] sm:pt-1.5">{task.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 情報の扱いと導入後。安心材料なので、暗い面から一段明るい面に切り替えて落ち着いて読ませる */}
        <section className="px-3 md:px-5">
          <div className="svc-open rounded-2xl bg-[#e0f7f4] text-[#1a2e35]">
            <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-20 md:py-28">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <h2 className="svc-h2">
                  <PhraseWrap text="情報の取り扱いと、導入後のこと" />
                </h2>
                <Link href="/faq" className="svc-link svc-link--dark text-[14px] md:mb-2 shrink-0">
                  よくあるご質問をすべて見る
                  <Arrow />
                </Link>
              </div>
              <div className="mt-12 md:mt-16 border-b border-[#1a2e35]/15">
                {assurances.map((item) => (
                  <div key={item.title} className="grid md:grid-cols-12 gap-x-10 gap-y-3 border-t border-[#1a2e35]/15 py-8 md:py-10">
                    <h3 className="md:col-span-5 lg:col-span-6 text-[1.25rem] md:text-[1.5rem] font-bold leading-[1.45]">
                      <PhraseWrap text={item.title} />
                    </h3>
                    <p className="svc-jp md:col-span-7 lg:col-span-6 text-[#1a2e35]/75 text-[15px] leading-[1.9] md:pt-1">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA。最後に帯で揃った書類が同じ歩調で流れていき、ページの話を閉じる */}
        <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-28 md:pt-40 pb-16 md:pb-20">
          <p className="svc-kicker">
            <SlipMark />
            Contact
          </p>
          <h2 className="svc-cta-h svc-rise text-white mt-6">まずはご相談ください</h2>
          <div className="mt-12 md:mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <p className="svc-jp text-white/70 text-[15px] md:text-[17px] leading-[1.9]">
              貴社の状況をヒアリングしたうえで、最適なプランをご提案します。
            </p>
            <Link href="/#contact" className="svc-btn svc-btn--pastel self-start md:self-auto">
              無料相談はこちら
              <Arrow />
            </Link>
          </div>
        </section>
        <div className="pb-16 md:pb-24">
          <div aria-hidden="true" className="svc-march">
            <div className="svc-march-track" style={{ backgroundImage: marchTile }} />
          </div>
        </div>

      </main>
      <Footer onDark />
    </>
  )
}
