import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "よくあるご質問（AI導入・AI仕組み化）",
  description:
    "AllovvのAI導入コンサルティング・AI仕組み化についてよくあるご質問です。進め方と導入期間、AI研修、情報の取り扱い、料金の決まり方、導入後のサポートなどにお答えします。",
  path: "/faq",
})

// 事業の書き方は AGENTS.md に従う（メール返信などの単機能を主語にせず、業務の洗い出しから）。
// 答えに書くのはサイト上の料金ページ・プライバシーポリシーにある事実だけ
const faqs = [
  {
    category: "AI導入の進め方",
    items: [
      {
        q: "何から相談すればよいか分かりません。",
        a: "最初は「どの業務にAIを使えるか」の洗い出しから始めます。日々の業務の流れをお伺いし、AIで置き換えられるところと人が残すべきところを整理したうえで、効果の出やすい業務からご提案します。ご相談は無料です。",
      },
      {
        q: "どのような業務をAIに任せられますか？",
        a: "たとえば、問い合わせメールへの返信、過去の見積を元にした見積書の作成、希望と人数からのシフトのたたき台、録音からの議事録、契約書・規程のチェック、飲食店の発注予測、ベテランの手順の手順書化などです。これらは一例で、実際に任せる業務は御社の業務を伺ったうえで一緒に決めます。",
      },
      {
        q: "導入はどのように進みますか？",
        a: "業務設計→AI構築→標準化の順で進めます。まず業務の流れを整理してAIで置き換えるところを決め、次にAIが下書きを用意する仕組みを構築してテスト運用で調整します。最後に操作マニュアルとレクチャーで使い方を揃え、人が代わっても同じ品質で回る形にします。",
      },
      {
        q: "導入までどのくらいかかりますか？",
        a: "ご契約・ご入金の確認後、最短2営業日で導入できます。業務フローの整理から進める標準的な進行では、1〜2週間程度が目安です。",
      },
      {
        q: "自社のやり方や書式に合わせられますか？",
        a: "はい。導入時のヒアリングで、普段お使いの書式・文面・言い回しや社内の手順を確認し、それに合わせた下書きをAIが用意するように設計します。",
      },
      {
        q: "CursorやCodexなど、開発向けのAI導入も相談できますか？",
        a: "はい。高機能AI導入サポートとして、CursorによるAIコーディング環境の構築、OpenAI Codexによる自動化システム開発、開発者向けAIワークフローの設計、カスタムAIエージェントの構築を承ります。料金は要件に応じてお見積りします。",
      },
    ],
  },
  {
    category: "AI研修・社内への定着",
    items: [
      {
        q: "ITに詳しくなくても使えますか？",
        a: "はい。構築・設定はすべて当方が行い、納品時に操作マニュアルをお渡しして操作レクチャーも実施します。",
      },
      {
        q: "社員向けのAI研修だけをお願いできますか？",
        a: "はい。AI活用研修は¥150,000〜（税別）で、研修のみのご依頼も承ります。全10〜12時間（半日×3回など、日程はご相談）、1社5名までが基本で、人数の追加もご相談いただけます。オンライン・貴社への訪問のどちらにも対応しています。",
      },
      {
        q: "研修ではどのようなことを学べますか？",
        a: "生成AIの基礎とやってはいけないこと、指示文（プロンプト）の書き方と社内の型づくりを扱います。教材には貴社の実際の業務・書類を使うため、研修で練習した内容をそのまま日々の仕事に持ち帰れます。受講後に見返せる社内マニュアルもお渡しします。",
      },
    ],
  },
  {
    category: "情報の取り扱い",
    items: [
      {
        q: "社内の情報や顧客情報をAIに渡しても大丈夫ですか？",
        a: "利用するAI（Anthropic社の商用API）は、お客様のデータをAIの学習に利用しない契約形態です。また、仕組みはお客様ご自身のアカウント上に構築するため、当方がお客様のデータを常時閲覧することはありません。",
      },
      {
        q: "AIが間違えたらどうなりますか？",
        a: "AIが用意するのは下書きまでで、最終的な確認と判断は人が行う設計です。AIの出力がそのまま社外に出ることはありません。導入後1ヶ月のサポート期間中に、実際の業務に合わせてAIへの指示を調整し、精度を高めていきます。",
      },
    ],
  },
  {
    category: "費用について",
    items: [
      {
        q: "料金はどのように決まりますか？",
        a: "AIに任せる業務の内容によって変わります。1業務あたり¥50,000〜（税別）が目安です。複数の業務をまとめてご依頼の場合は、合計から割り引いた一式価格でご提示します。御社に必要な業務だけを選んでいただくため、最終的なお見積りはヒアリングのうえでご提示します。",
      },
      {
        q: "「1業務」とはどの範囲ですか？",
        a: "ひとつの仕事の流れ（たとえば「見積書の作成」「問い合わせへの返信」「打ち合わせの議事録」）を、AIが下書きまで用意する状態にするまでを1業務としています。業務フローのヒアリング・システム構築・テスト運用・操作レクチャーまでが含まれます。同じ業務名でも、扱う書類の種類や社内の手順の複雑さによって金額は変わります。",
      },
      {
        q: "月々の費用はかかりますか？",
        a: "AI仕組み化の導入費は一度きりのお支払いです。別途、外部ツールの実費（Make・Claude APIの利用料。合わせて月数千円程度が目安）がかかり、こちらはお客様のアカウントで直接お支払いいただきます。",
      },
      {
        q: "導入後のサポートはありますか？",
        a: "導入後1ヶ月間のサポート（調整・改善・質問対応）が含まれています。その後も継続をご希望の場合は、月額¥30,000（税別）の保守プランから運用契約をご用意しています。月次レポートと月1回の改善打ち合わせまで含めた運用改善プラン、手順書の改訂や新任レクチャーまで含めた標準化プランもございますので、必要な範囲に合わせてお選びいただけます。",
      },
      {
        q: "途中でやめることはできますか？",
        a: "導入費は買い切りのため、月額の縛りはありません。月額の運用契約はいつでも解約いただけます。解約後も、仕組みはお客様のアカウント上でそのまま使い続けられます。",
      },
    ],
  },
]

// よくある質問の構造化データ。検索結果の開閉表示は今は官公庁・医療系サイトに限られているが、
// 検索エンジンやAI検索が「どの質問にどう答えているか」を読み取る手がかりになる
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  ),
}

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          faqJsonLd,
          breadcrumbJsonLd([{ name: "TOP", path: "/" }, { name: "よくあるご質問", path: "/faq" }]),
        ]}
      />
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
            AI導入・AI仕組み化について、よくいただくご質問をまとめました。
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
