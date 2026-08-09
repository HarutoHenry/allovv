import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "よくあるご質問 | Allovv",
  description:
    "AllovvのAI導入支援サービスに関するよくあるご質問です。セキュリティ・誤送信対策・導入期間・費用などにお答えします。",
}

const faqs = [
  {
    category: "安全性",
    items: [
      {
        q: "AIが勝手にメールを送信してしまうことはありませんか？",
        a: "ありません。AIが作成するのは「下書き」までで、送信は必ず人が内容を確認したうえで行う設計です。誤送信のリスクを仕組みとして排除しています。",
      },
      {
        q: "顧客情報や機密情報の取り扱いが心配です。",
        a: "メールの内容は、返信文の下書き作成のためだけに処理されます。利用するAI（Anthropic社の商用API）は、お客様のデータをAIの学習に利用しない契約形態です。また、システムはお客様ご自身のアカウント上に構築するため、当方がお客様のメールを常時閲覧することはありません。",
      },
      {
        q: "AIが間違った内容の下書きを作ったらどうなりますか？",
        a: "下書きは送信前に必ず人が確認するため、そのまま相手に届くことはありません。また、導入後1ヶ月のサポート期間中に、実際のメールに合わせてAIへの指示文を調整し、精度を高めていきます。",
      },
    ],
  },
  {
    category: "導入について",
    items: [
      {
        q: "ITに詳しくなくても使えますか？",
        a: "はい。構築・設定はすべて当方が行い、納品時に操作マニュアルをお渡しして操作レクチャーも実施します。日々の運用は「下書きを確認して送信する」だけです。",
      },
      {
        q: "導入までどのくらいかかりますか？",
        a: "ご契約・ご入金の確認後、最短2営業日で導入できます。業務フローの整理やパターン設計を含む標準的な進行では、1〜2週間程度が目安です。",
      },
      {
        q: "Gmail以外のメール（Outlook等）でも使えますか？",
        a: "現在はGmail（独自ドメインのメールをGmailで送受信する構成を含む）を中心に対応しています。その他の環境については、まずはお問い合わせください。",
      },
      {
        q: "自分の事務所の文面・言い回しに合わせられますか？",
        a: "はい。導入時のヒアリングで普段お使いの文面・署名・敬語のトーンを確認し、それに合わせた下書きが作られるように設計します。",
      },
    ],
  },
  {
    category: "費用について",
    items: [
      {
        q: "料金はどのように決まりますか？",
        a: "AIに任せる業務の内容によって変わります。参考価格として、メール対応が¥150,000、見積書の作成が¥120,000、シフト作成が¥100,000、打ち合わせの議事録・日報や作業報告書・契約書や規程のチェックが各¥80,000、飲食店向けの発注予測と引き継ぎ資料づくりが各¥250,000（いずれも税別）です。複数の業務をまとめてご依頼の場合は、合計から割り引いた一式価格でご提示します。御社に必要な業務だけを選んでいただくため、最終的なお見積りはヒアリングのうえでご提示します。",
      },
      {
        q: "「1業務」とはどの範囲ですか？",
        a: "ひとつの仕事の流れ（たとえば「見積書の作成」「問い合わせへの返信」「打ち合わせの議事録」）を、AIが下書きまで用意する状態にするまでを1業務としています。業務フローのヒアリング・システム構築・テスト運用・操作レクチャーまでが含まれます。同じ業務名でも、扱う書類の種類や社内の手順の複雑さによって金額は変わります。",
      },
      {
        q: "月々の費用はかかりますか？",
        a: "導入費は一度きりのお支払いです。別途、外部ツールの実費（Make・Claude APIの利用料。合わせて月数千円程度が目安）がかかり、こちらはお客様のアカウントで直接お支払いいただきます。",
      },
      {
        q: "導入後のサポートはありますか？",
        a: "導入後1ヶ月間のサポート（調整・改善・質問対応）がパッケージに含まれています。継続的なサポートをご希望の場合は、月額¥30,000の顧問プラン（月1回の改善打ち合わせ・設定変更・質問対応）をご用意しています。",
      },
      {
        q: "途中でやめることはできますか？",
        a: "導入パックは買い切りのため、月額の縛りはありません。顧問プランはいつでも解約いただけます。解約後もシステムはお客様のアカウント上でそのまま使い続けられます。",
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        <div className="pt-36 pb-24 max-w-[720px] mx-auto px-5">
          <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5 text-center">
            FAQ
          </p>
          <h1 className="text-navy text-2xl md:text-3xl font-bold text-center mb-4">
            よくあるご質問
          </h1>
          <p className="text-navy/50 text-sm text-center mb-16 leading-relaxed">
            AI導入支援サービスについて、よくいただくご質問をまとめました。
          </p>

          <div className="space-y-14">
            {faqs.map((group) => (
              <section key={group.category}>
                <h2 className="text-[#5fb8ab] font-bold text-sm tracking-wide mb-6">
                  {group.category}
                </h2>
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <details
                      key={item.q}
                      className="glass-card feature-card px-6 py-5 group"
                    >
                      <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                        <span className="text-navy font-medium text-sm leading-relaxed">
                          Q. {item.q}
                        </span>
                        <svg
                          className="w-4 h-4 shrink-0 mt-1 text-navy/40 transition-transform group-open:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <p className="text-navy/70 text-sm leading-relaxed mt-4">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <p className="text-navy/60 text-sm mb-6">
              その他のご質問は、お気軽にお問い合わせください。
            </p>
            <Link
              href="/#contact"
              className="inline-block px-8 py-3.5 gradient-btn font-semibold text-sm rounded-full"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
