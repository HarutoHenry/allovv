import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PricingExampleToggle } from "@/components/services/pricing-example-toggle"
import { CaseExampleSwitcher, type CaseExample } from "@/components/services/case-example-switcher"

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

const caseExamples: CaseExample[] = [
  {
    key: "pricing",
    icon: "💰",
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
      "導入費用は¥198,000（税別）の一度きりで、最短2営業日で導入いただけます。構築から操作レクチャーまで弊社が行いますので、専門知識は不要です。",
      "正確なお見積りのため、一度オンラインでお話しさせていただけたらと思います。ご都合のよい日時をお知らせください。",
      "何卒、よろしくお願いいたします。",
    ],
  },
  {
    key: "schedule",
    icon: "⏱️",
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
    icon: "🛟",
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
      "導入時には操作レクチャーを行い、その後も月額サポート（¥30,000/月）で月1回の改善打ち合わせと、メール・チャットでの質問対応をいたします。設定の変更やチューニングも都度対応いたしますので、ご安心ください。",
      "ご不明点があれば、遠慮なくお申し付けください。",
    ],
  },
  {
    key: "difference",
    icon: "🔍",
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
    icon: "📎",
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
            AI Consulting
          </p>

          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-6">
            AI導入コンサルティング
          </h1>

          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            業務フロー分析からAI構築・定着まで。<br />
            貴社の課題と規模に合わせた3つのプランをご用意しています。
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
          }
          examplesContent={
            <div className="max-w-[1100px] mx-auto px-5 pb-28">
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

            {/* Before / After mock（カテゴリ切替） */}
            <CaseExampleSwitcher examples={caseExamples} />

            {/* できること */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14">
              {[
                {
                  icon: "📈",
                  title: "使うほど貴社らしく育つ",
                  desc: "実際の返信を見ながら言い回しやトーンを学習させ、下書きの精度をどんどん上げていけます。導入して終わりではありません。",
                },
                {
                  icon: "🔀",
                  title: "問い合わせ別に返し分け",
                  desc: "料金のご質問には料金案内、日程のご相談には調整のご案内など、内容に応じて返信パターンを自動で切り替えます。",
                },
                {
                  icon: "📎",
                  title: "リンク・資料添付も対応",
                  desc: "料金ページへのリンクを添えたり、特定のお問い合わせに資料PDFを自動で添付するなど、貴社の営業フローに合わせて設計します。",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl p-6"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <h3 className="text-white font-bold text-sm mb-2">{f.title}</h3>
                  <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-white/30 text-xs mt-10">
              ※ 画面はイメージです。返信文は貴社の文面・トーンに合わせて調整します。
            </p>

            {/* 業界別 活用事例 */}
            <div className="mt-20 pt-16 border-t border-white/5">
              <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5 text-center">
                Industry Cases
              </p>
              <h2 className="text-white text-2xl md:text-4xl font-bold text-center mb-4">
                業界ではAI活用でこう変わっています
              </h2>
              <p className="text-white/50 text-sm md:text-base text-center max-w-xl mx-auto leading-relaxed mb-16">
                メール対応はほんの入り口です。同じ考え方で、
                <br className="hidden md:block" />
                業種ごとの定型業務をまるごと仕組み化できます。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: "🏛️", field: "士業（税理士・行政書士）", desc: "顧客からの質問への回答ドラフト作成で、1件60分の対応が15分に。空いた時間で顧問先が1.4倍に増えた事例も。" },
                  { icon: "🏠", field: "不動産", desc: "ポータル掲載文の作成が1物件20分→3分。掲載スピードが上がり、反響数も向上。" },
                  { icon: "🏗️", field: "建設・工務店", desc: "打ち合わせの議事録起こしと見積更新を自動化し、設計担当1人あたり週8〜12時間を削減。" },
                  { icon: "🏭", field: "製造・金属加工", desc: "図面と過去データから見積ドラフトを自動生成。1件30分かかっていた作業が3分に。" },
                  { icon: "🛒", field: "小売・EC", desc: "商品説明文の作成が1点30分→5分。掲載できる商品数が大きく増加。" },
                  { icon: "🍶", field: "飲食店", desc: "シフト作成やメニュー考案をAIが下支えし、店長の作成時間を最大90%削減。" },
                  { icon: "🎨", field: "広告・デザイン", desc: "企画書の初稿づくりが6〜8時間から2〜3時間に。提案できる件数が1.4倍に。" },
                  { icon: "💇", field: "美容・サロン", desc: "SNS投稿づくりを内製化し、投稿頻度アップで新規客が41%増えた事例も。" },
                  { icon: "🧸", field: "介護・保育", desc: "介護記録や連絡帳の作成をAIが補助し、1日90分の記録が25分に。残業ゼロ化の例も。" },
                  { icon: "🚚", field: "物流・運送", desc: "配車計画の作成が1日3時間→40分。ルート最適化で燃料コストも圧縮。" },
                ].map((c) => (
                  <div
                    key={c.field}
                    className="rounded-2xl p-6"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="text-2xl mb-3">{c.icon}</div>
                    <h3 className="text-white font-bold text-sm mb-2">{c.field}</h3>
                    <p className="text-white/45 text-xs leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>

              <p className="text-center text-white/30 text-xs mt-10 max-w-2xl mx-auto leading-relaxed">
                ※ 上記は各種公開事例をもとにした業界の一般的な成果であり、特定の導入結果を保証するものではありません。
              </p>
            </div>
            </div>
          }
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
