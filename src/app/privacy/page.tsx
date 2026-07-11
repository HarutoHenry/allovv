import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "プライバシーポリシー | Allovv",
  description: "Allovvのプライバシーポリシー（個人情報保護方針）です。",
}

const sections = [
  {
    heading: "1. 基本方針",
    body: [
      "Allovv（以下「当方」といいます）は、当方が提供するサービスおよびウェブサイト（以下「本サービス」といいます）における個人情報の取り扱いについて、個人情報の保護に関する法律（個人情報保護法）その他関係法令を遵守し、以下のとおりプライバシーポリシーを定めます。",
    ],
  },
  {
    heading: "2. 取得する情報",
    body: [
      "当方は、本サービスの提供にあたり、以下の情報を取得することがあります。",
    ],
    list: [
      "氏名・会社名・事務所名",
      "メールアドレス・電話番号",
      "お問い合わせフォームに入力された内容",
      "サービス提供に必要な業務上の情報（メール運用状況・業務フロー等）",
    ],
  },
  {
    heading: "3. 利用目的",
    body: ["取得した個人情報は、以下の目的で利用します。"],
    list: [
      "お問い合わせへの回答・ご連絡",
      "サービスの提供・構築・サポートの実施",
      "契約の締結・履行・代金請求",
      "サービスに関するご案内（ご希望されない場合は停止します）",
    ],
  },
  {
    heading: "4. 第三者提供",
    body: [
      "当方は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供しません。",
    ],
  },
  {
    heading: "5. 外部サービスの利用",
    body: [
      "本サービスでは、お問い合わせフォームの送信処理等に外部サービスを利用しています。これらの事業者における情報の取り扱いは、各社のプライバシーポリシーに従います。また、AI導入支援サービスの構築・運用においては、お客様の同意のもと、Google（Gmail）、Make、Anthropic（Claude AI）等の外部サービスを利用します。",
    ],
  },
  {
    heading: "6. 安全管理",
    body: [
      "当方は、個人情報の漏えい・滅失・毀損の防止のため、アクセス権限の管理その他の安全管理措置を講じます。",
    ],
  },
  {
    heading: "7. 開示・訂正・削除の請求",
    body: [
      "ご本人からの個人情報の開示・訂正・利用停止・削除のご請求には、ご本人であることを確認のうえ、法令に従い速やかに対応します。下記の窓口までご連絡ください。",
    ],
  },
  {
    heading: "8. 改定",
    body: [
      "本ポリシーの内容は、法令の変更やサービス内容の変更に応じて改定することがあります。改定後の内容は本ページに掲載した時点で効力を生じます。",
    ],
  },
  {
    heading: "9. お問い合わせ窓口",
    body: ["Allovv（代表：三沼 春斗）", "メール：minuma.haruto@allovv.com"],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        <div className="pt-36 pb-24 max-w-[720px] mx-auto px-5">
          <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5 text-center">
            Privacy Policy
          </p>
          <h1 className="text-navy text-2xl md:text-3xl font-bold text-center mb-4">
            プライバシーポリシー
          </h1>
          <p className="text-navy/40 text-xs text-center mb-16">
            制定日：2026年7月10日
          </p>

          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-navy font-bold text-base mb-3">
                  {section.heading}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-navy/70 text-sm leading-relaxed mb-2"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="list-disc pl-5 space-y-1.5 mt-2">
                    {section.list.map((item) => (
                      <li key={item} className="text-navy/70 text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
