import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "AI導入コンサルティング 料金プラン | Allovv",
  description: "AllovvのAI導入コンサルティングサービスの料金プランです。AIメール自動化・業務効率化・高機能AI導入サポートをご用意しています。",
}

const plans = [
  {
    id: "efficiency",
    badge: "業務効率化",
    badgeColor: "bg-[#e0f7f4] text-[#5fb8ab]",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "AIによる業務効率化",
    subtitle: "御社の課題に合わせたご提案",
    price: "お見積り",
    priceNote: "課題ヒアリング後にご提示",
    featured: false,
    ctaLabel: "お問い合わせ",
    ctaHref: "/#contact",
    features: [
      "業務フロー分析・課題ヒアリング",
      "最適なAIツール選定・提案",
      "導入スケジュール設計",
      "ROI試算レポート",
      "導入後フォローアップ",
    ],
    featureNote: null,
  },
  {
    id: "email",
    badge: "人気No.1",
    badgeColor: "bg-[#7dd8ca]/20 text-[#7dd8ca]",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "AIメール自動化",
    subtitle: "導入パック",
    price: "¥198,000",
    priceNote: "税別 / 初期費用",
    featured: true,
    ctaLabel: "お申し込み",
    ctaHref: "/#contact",
    features: [
      "初回打ち合わせ（業務フロー・課題ヒアリング）",
      "Gmail × Claude AIシステム構築・設定",
      "テスト運用・動作確認",
      "操作レクチャー（30分）",
      "1ヶ月後フォロー打ち合わせ（調整・改善）",
      "最短2営業日で導入完了",
    ],
    featureNote: {
      label: "月額サポート ¥30,000/月",
      items: [
        "月1回改善打ち合わせ",
        "設定変更・チューニング対応",
        "メール・チャットでの質問対応",
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
    featureNote: null,
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
            AI Consulting
          </p>

          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-6">
            料金プラン
          </h1>

          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            業務フロー分析からAI構築・定着まで。<br />
            貴社の課題と規模に合わせた3つのプランをご用意しています。
          </p>
        </div>

        {/* Pricing Cards */}
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

                {/* Features */}
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

                {/* Monthly support note */}
                {plan.featureNote && (
                  <div className="mt-6 pt-5 border-t border-[#7dd8ca]/20">
                    <p className="text-[#7dd8ca] text-xs font-semibold tracking-wide mb-3">
                      + {plan.featureNote.label}
                    </p>
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

          {/* Bottom Note */}
          <p className="text-center text-white/25 text-xs mt-12">
            すべての料金は税別です。詳細はお問い合わせください。
          </p>
          <p className="text-center text-xs mt-4">
            <Link href="/faq" className="text-[#7dd8ca]/60 hover:text-[#7dd8ca] transition-colors underline underline-offset-4">
              よくあるご質問（セキュリティ・導入期間・費用）はこちら
            </Link>
          </p>
        </div>

        {/* How it works */}
        <div className="border-t border-white/5 pt-24 pb-28 px-5">
          <div className="max-w-[1100px] mx-auto">
            <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5 text-center">
              How it works
            </p>
            <h2 className="text-white text-2xl md:text-4xl font-bold text-center mb-4">
              導入後、メール対応はこう変わります
            </h2>
            <p className="text-white/50 text-sm md:text-base text-center max-w-xl mx-auto leading-relaxed mb-16">
              AIメール自動化パックの実際の流れです。
              <br className="hidden md:block" />
              AIが作るのは「下書き」まで。送信は必ず人が確認するので、誤送信の心配はありません。
            </p>

            {/* 4 Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
              {[
                { icon: "📩", title: "お問い合わせが届く", desc: "お客様からのメールをシステムが自動で検知します" },
                { icon: "🤖", title: "AIが内容を読む", desc: "質問の内容・お名前に合わせて返信文を組み立てます" },
                { icon: "📝", title: "下書きに自動保存", desc: "受信から数分で、そのまま送れる品質の下書きが完成" },
                { icon: "✅", title: "確認して送信", desc: "最終確認と送信は人が行います。AIが勝手に送ることはありません" },
              ].map((step, i) => (
                <div
                  key={step.title}
                  className="relative rounded-2xl p-6 text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ background: "linear-gradient(135deg, #7dd8ca 0%, #9fe8dc 100%)", color: "#0f1e24" }}
                  >
                    STEP {i + 1}
                  </span>
                  <div className="text-3xl mt-3 mb-3">{step.icon}</div>
                  <h3 className="text-white font-bold text-sm mb-2">{step.title}</h3>
                  <p className="text-white/45 text-xs leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Before / After mock */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6">
              {/* 受信メール */}
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <span className="text-white/60 text-xs font-semibold">📩 届いたお問い合わせ</span>
                  <span className="text-white/35 text-[11px]">10:02 受信</span>
                </div>
                <div className="bg-white p-5">
                  <p className="text-[#1a2e35] text-sm font-bold mb-1">料金についてのお問い合わせ</p>
                  <p className="text-[#1a2e35]/50 text-xs mb-3">お客様 &lt;customer@example.com&gt;</p>
                  <p className="text-[#1a2e35]/75 text-[13px] leading-relaxed">
                    はじめまして。ホームページで御社のサービスを知り、ご連絡いたしました。
                    導入にかかる料金と期間、また専門知識がなくても運用できるかを教えていただけますでしょうか。
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-center">
                <div className="text-[#7dd8ca] text-3xl md:text-4xl font-bold rotate-90 md:rotate-0">→</div>
                <p className="text-[#7dd8ca]/70 text-[11px] font-semibold mt-1 whitespace-nowrap">AIが自動作成<br />（数分後）</p>
              </div>

              {/* AI下書き */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(125,216,202,0.5)", boxShadow: "0 0 32px rgba(125,216,202,0.15)" }}
              >
                <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "rgba(125,216,202,0.15)" }}>
                  <span className="text-[#7dd8ca] text-xs font-semibold">📝 AIが作成した返信下書き</span>
                  <span className="text-white/35 text-[11px]">10:05 完成</span>
                </div>
                <div className="bg-white p-5">
                  <p className="text-[#1a2e35] text-sm font-bold mb-3">Re: 料金についてのお問い合わせ</p>
                  <p className="text-[#1a2e35]/75 text-[13px] leading-relaxed">
                    お問い合わせいただき誠にありがとうございます。
                    導入費用は¥198,000（税別）の一度きりで、最短2営業日で導入いただけます。
                    構築から操作レクチャーまで弊社が行いますので、専門知識は不要です。
                    <br />
                    <br />
                    正確なお見積りのため、一度オンラインでお話しさせていただけますと幸いです。
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: "#1a73e8" }}>
                      送信
                    </span>
                    <span className="text-[#1a2e35]/40 text-[11px]">← 確認して押すだけ</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-white/30 text-xs mt-10">
              ※ 画面はイメージです。返信文は貴社の文面・トーンに合わせて調整します。
            </p>
          </div>
        </div>

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
