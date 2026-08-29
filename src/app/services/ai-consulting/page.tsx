import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PricingExampleToggle } from "@/components/services/pricing-example-toggle"
import { IndustryCases } from "@/components/services/industry-cases"
import { CaseExampleSwitcher, type CaseExample } from "@/components/services/case-example-switcher"

export const metadata = {
  title: "AI仕組み化 料金プラン",
  description: "AllovvのAI仕組み化サービス（業務設計→AI構築→標準化）の料金プランです。AI活用研修・業務効率化・高機能AI導入サポートをご用意しています。",
}

const plans = [
  {
    id: "training",
    badge: "研修",
    badgeColor: "bg-[#e0f7f4] text-[#5fb8ab]",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.42A12.08 12.08 0 0118 15.5c0 1.02-.13 2.01-.37 2.95A11.96 11.96 0 0112 21a11.96 11.96 0 01-5.63-2.55A12.05 12.05 0 016 15.5c0-1.7.34-3.32.95-4.79L12 14z" />
      </svg>
    ),
    title: "AI活用研修",
    subtitle: "従業員向け・全10〜12時間",
    price: "¥400,000〜",
    priceNote: "税別 / 1社5名まで",
    featured: false,
    ctaLabel: "お問い合わせ",
    ctaHref: "/#contact",
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
    badgeColor: "bg-[#7dd8ca]/20 text-[#7dd8ca]",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "AIによる業務効率化",
    subtitle: "業務ごとの参考価格",
    price: "¥80,000〜",
    priceNote: "1業務あたりの参考価格 / 税別",
    featured: true,
    ctaLabel: "お問い合わせ",
    ctaHref: "/#contact",
    featuresLabel: "業務の料金例を見る",
    features: [
      "メール対応 ¥150,000（問い合わせ返信を下書きまで）",
      "見積書の作成 ¥120,000（過去の見積を元に金額入りで）",
      "シフト作成 ¥100,000（希望と人数からたたき台を）",
      "打ち合わせの議事録 ¥80,000（録音から決定事項を）",
      "契約書・規程のチェック ¥80,000（抜け・気になる点の洗い出し）",
      "発注予測 ¥250,000（飲食店。次に頼む量と抜けを出す）",
      "事業承継・引き継ぎを楽にする業務AI化 ¥250,000（ベテランの手順を手順書に）",
    ],
    featureNote: {
      label: null,
      items: [
        "業務の内容によって金額は変わります（上記は参考価格です）",
        "業務フローのヒアリングから構築・レクチャーまで込み",
        "まずは1業務から始めていただけます",
        "導入後の運用と改善をご希望の場合は、月額¥30,000（税別）からの運用契約で承ります",
      ],
    },
  },
  {
    id: "advanced",
    badge: "高機能",
    badgeColor: "bg-[#9b8ec4]/20 text-[#c5b8f0]",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
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

const caseExamples: CaseExample[] = [
  {
    key: "pricing",
    label: "料金について",
    subject: "料金についてのお問い合わせ",
    customerName: "佐藤",
    customerEmail: "sato@example.com",
    customerBody: [
      "Allovv ご担当者様",
      "はじめまして。佐藤と申します。ホームページで御社のサービスを知り、ご連絡いたしました。",
      "導入にかかる料金と期間、また専門知識がなくても運用できるかを教えていただけますでしょうか。",
      "お忙しいところ恐れ入りますが、よろしくお願いいたします。",
      "佐藤",
    ],
    replySubject: "Re: 料金についてのお問い合わせ",
    aiBody: [
      "佐藤様",
      "お問い合わせいただき、誠にありがとうございます。",
      "導入費用は¥200,000（税別）の一度きりで、最短2営業日で導入いただけます。構築から操作レクチャーまで弊社が行いますので、専門知識は不要です。",
      "正確なお見積りのため、一度オンラインでお話しさせていただけたらと思います。ご都合のよい日時をお知らせください。",
      "何卒、よろしくお願いいたします。",
    ],
  },
  {
    key: "schedule",
    label: "導入期間について",
    subject: "導入までの期間について",
    customerName: "中村",
    customerEmail: "nakamura@example.com",
    customerBody: [
      "Allovv ご担当者様",
      "はじめまして。中村と申します。貴社のAIメール自動化に興味があり、ご連絡いたしました。",
      "現在、問い合わせ対応に追われており、できるだけ早く導入したいと考えています。お申し込みから実際に使えるようになるまで、どのくらいの期間がかかりますでしょうか。",
      "よろしくお願いいたします。",
      "中村",
    ],
    replySubject: "Re: 導入までの期間について",
    aiBody: [
      "中村様",
      "お問い合わせいただき、誠にありがとうございます。",
      "導入期間は、お申し込みから最短2営業日です。初回の打ち合わせで業務フローと課題をお伺いした後、設定・テスト運用を弊社側で行いますので、お客様側での特別な準備は必要ございません。",
      "ご都合のよい日時が決まりましたら、オンラインでの打ち合わせを設定させていただきます。",
      "何卒、よろしくお願いいたします。",
    ],
  },
  {
    key: "support",
    label: "サポート体制について",
    subject: "導入後のサポートについて",
    customerName: "高橋",
    customerEmail: "takahashi@example.com",
    customerBody: [
      "Allovv ご担当者様",
      "高橋と申します。ホームページを拝見し、ご連絡いたしました。",
      "AIに任せることに少し不安があり、導入後のサポート体制について詳しく教えていただけますでしょうか。",
      "よろしくお願いいたします。",
      "高橋",
    ],
    replySubject: "Re: 導入後のサポートについて",
    aiBody: [
      "高橋様",
      "お問い合わせいただき、誠にありがとうございます。",
      "導入時には操作レクチャーを行い、その後は月額¥30,000（税別）の保守プランで、設定変更とメール・チャットでの質問対応をいたします。月次レポートと月1回の改善打ち合わせをご希望でしたら、運用改善プランをご案内いたしますので、遠慮なくお申し付けください。",
      "ご不明点があれば、遠慮なくお申し付けください。",
    ],
  },
  {
    key: "difference",
    label: "他社との違い",
    subject: "他社サービスとの違いについて",
    customerName: "山本",
    customerEmail: "yamamoto@example.com",
    customerBody: [
      "Allovv ご担当者様",
      "山本と申します。AIメール自動化のサービスを比較しており、貴社にもご連絡いたしました。",
      "他社のツールとの違いや、貴社ならではの強みがあれば教えていただけますでしょうか。",
      "よろしくお願いいたします。",
      "山本",
    ],
    replySubject: "Re: 他社サービスとの違いについて",
    aiBody: [
      "山本様",
      "お問い合わせいただき、誠にありがとうございます。",
      "弊社の強みは、代表自身が日々AIメール自動化を実際に運用しながら改善を重ねている点です。汎用ツールの提供ではなく、貴社の業務フローに合わせて一つ一つ設計・調整いたします。",
      "導入後も伴走してチューニングを続けますので、「導入して終わり」にはならないサービスです。",
    ],
  },
  {
    key: "quote",
    label: "資料・見積もり請求",
    subject: "サービス資料のご請求",
    customerName: "田中",
    customerEmail: "tanaka@example.com",
    customerBody: [
      "Allovv ご担当者様",
      "田中と申します。社内で導入を検討するにあたり、サービス資料と概算のお見積りをいただくことは可能でしょうか。",
      "よろしくお願いいたします。",
      "田中",
    ],
    replySubject: "Re: サービス資料のご請求",
    aiBody: [
      "田中様",
      "お問い合わせいただき、誠にありがとうございます。",
      "サービス資料と概算のお見積りを添付いたします。貴社の業務内容に応じて金額が変動する場合がございますので、正式なお見積りは簡単なヒアリングの後にご提示いたします。",
      "ご都合のよい日時がございましたら、オンラインでご案内いたします。",
    ],
    attachment: "Allovv_サービス資料.pdf",
  },
]

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function AiConsultingPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#0f1e24]">

        {/* Hero */}
        <div className="pt-36 pb-20 text-center px-5">
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
            Systemize
          </p>

          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-5">
            AI仕組み化
          </h1>

          {/* 着手順そのもの。設計 → 構築 → 標準化の順でしか進まないので、矢印が意味を持つ。
              言葉を主役にしたいので、矢印はミントを薄く敷いて後ろに下げる */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-6
                          text-white/85 text-sm md:text-base font-medium tracking-[0.06em]">
            <span>業務設計</span>
            <span aria-hidden="true" className="text-[#7dd8ca]/55">→</span>
            <span>AI構築</span>
            <span aria-hidden="true" className="text-[#7dd8ca]/55">→</span>
            <span>標準化</span>
          </div>

          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            人が代わっても同じ品質で回る形にします。
          </p>
        </div>

        {/* Pricing & Examples toggle */}
        <PricingExampleToggle
          pricingContent={
            <div className="max-w-[1100px] mx-auto px-5 pb-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative rounded-2xl p-8 flex flex-col"
                style={
                  plan.featured
                    ? {
                        background: "rgba(125, 216, 202, 0.06)",
                        border: "1px solid rgba(125, 216, 202, 0.45)",
                        boxShadow: "0 0 40px rgba(125, 216, 202, 0.12), 0 8px 32px rgba(0,0,0,0.3)",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                      }
                }
              >
                {/* Featured label */}
                {plan.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-[11px] font-semibold tracking-wide"
                      style={{ background: "linear-gradient(135deg, #7dd8ca 0%, #9fe8dc 100%)", color: "#0f1e24" }}>
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Badge */}
                <span className={`inline-block self-start px-3 py-1 text-xs font-medium rounded-full mb-5 ${plan.badgeColor}`}>
                  {plan.badge}
                </span>

                {/* Icon */}
                <div className={`mb-4 ${plan.featured ? "text-[#7dd8ca]" : "text-white/40"}`}>
                  {plan.icon}
                </div>

                {/* Title */}
                <h2 className="text-white text-xl font-bold leading-snug mb-1">
                  {plan.title}
                </h2>
                <p className="text-white/40 text-sm mb-6">{plan.subtitle}</p>

                {/* Price */}
                <div className="mb-2">
                  {plan.price === "お見積り" ? (
                    <p className="text-3xl font-bold text-white/80">{plan.price}</p>
                  ) : (
                    <p className="text-3xl font-bold"
                      style={{ background: "linear-gradient(135deg, #7dd8ca 0%, #9fe8dc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      {plan.price}
                    </p>
                  )}
                </div>
                <p className="text-white/30 text-xs mb-8">{plan.priceNote}</p>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className="block text-center py-3 rounded-xl font-semibold text-sm mb-8 transition-all"
                  style={
                    plan.featured
                      ? { background: "linear-gradient(135deg, #c5f5e8 0%, #ffe4ef 100%)", color: "#1a2e35" }
                      : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.12)" }
                  }
                >
                  {plan.ctaLabel}
                </Link>

                {/* Divider */}
                <div className="border-t border-white/10 mb-6" />

                {/* Features（featuresLabel があるプランは、長い一覧をプルダウンに畳む） */}
                {plan.featuresLabel ? (
                  <details className="group">
                    <summary
                      className="cursor-pointer list-none flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/75 hover:text-white transition-colors"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)" }}
                    >
                      <span>{plan.featuresLabel}</span>
                      <svg className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <ul className="space-y-3 mt-5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-white/65 text-sm">
                          <span className={plan.featured ? "text-[#7dd8ca]" : "text-white/30"}>
                            <CheckIcon />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-white/65 text-sm">
                        <span className={plan.featured ? "text-[#7dd8ca]" : "text-white/30"}>
                          <CheckIcon />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Monthly support note */}
                {plan.featureNote && (
                  <div className="mt-6 pt-5 border-t border-[#7dd8ca]/20">
                    {plan.featureNote.label && (
                      <p className="text-[#7dd8ca] text-xs font-semibold tracking-wide mb-3">
                        + {plan.featureNote.label}
                      </p>
                    )}
                    <ul className="space-y-3">
                      {plan.featureNote.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-white/50 text-sm">
                          <span className="text-[#7dd8ca]/60">
                            <CheckIcon />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 料金の考え方（業務ごとの参考価格 → まとめると割引。率は公開しない）*/}
          <p className="text-center text-white/45 text-sm mt-12 max-w-3xl mx-auto leading-relaxed">
            料金は、AIに任せる業務の内容によって変わります。<br className="hidden md:block" />
            上記は業務ごとの参考価格で、2業務以上をお選びの場合は合計から割り引いた一式価格でご提示します。<br className="hidden md:block" />
            御社に必要な業務だけを選んでいただくため、最終的なお見積りはヒアリングのうえでご提示します。
          </p>

          {/* Bottom Note */}
          <p className="text-center text-white/25 text-xs mt-8">
            すべての料金は税別です。詳細はお問い合わせください。
          </p>
          <p className="text-center text-xs mt-4">
            <Link href="/faq" className="text-[#7dd8ca]/60 hover:text-[#7dd8ca] transition-colors underline underline-offset-4">
              よくあるご質問（セキュリティ・導入期間・費用）はこちら
            </Link>
          </p>
            </div>
          }
          examplesContent={<IndustryCases />}
        />

        {/* Contact CTA */}
        <div className="border-t border-white/5 py-24 text-center px-5">
          <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5">
            CONTACT
          </p>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
            まずはご相談ください
          </h2>
          <p className="text-white/40 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
            貴社の状況をヒアリングしたうえで、最適なプランをご提案します。
          </p>
          <Link
            href="/#contact"
            className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
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
