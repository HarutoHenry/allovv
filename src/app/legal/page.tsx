import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "特定商取引法に基づく表記 | Allovv",
  description: "Allovvの特定商取引法に基づく表記です。",
}

const items = [
  { label: "事業者名", value: "Allovv" },
  { label: "代表者", value: "三沼 春斗" },
  {
    label: "所在地",
    value:
      "神奈川県横浜市（詳細な住所は、ご請求いただければ遅滞なく開示いたします）",
  },
  {
    label: "電話番号",
    value:
      "080-4477-1439（受付時間：平日10:00〜18:00。お問い合わせはメールでのご連絡を推奨しています）",
  },
  { label: "メールアドレス", value: "minuma.haruto@allovv.com" },
  {
    label: "販売価格",
    value:
      "各サービスページに記載しています。表示価格はすべて税別です。個別のお見積りが必要なサービスは、ご契約前に書面でご提示します。",
  },
  {
    label: "販売価格以外の必要料金",
    value:
      "外部ツールの利用料（Make・Claude API等の実費）、サーバー・ドメイン費用等が別途発生する場合があります。詳細はご契約前にご案内します。",
  },
  {
    label: "支払方法",
    value: "銀行振込（振込手数料はお客様のご負担となります）",
  },
  {
    label: "支払時期",
    value: "ご契約締結後、当方が指定する期日までにお支払いください。",
  },
  {
    label: "サービスの提供時期",
    value:
      "ご入金確認後に作業へ着手し、個別の契約に定めるスケジュールに従って提供します。",
  },
  {
    label: "キャンセル・返金",
    value:
      "サービスの性質上、作業着手後のキャンセル・返金はお受けできません。作業着手前のキャンセルは全額返金いたします。成果物に契約内容との相違がある場合は、契約に定める範囲で修正対応いたします。",
  },
  {
    label: "動作環境",
    value:
      "AI導入支援サービスのご利用には、Gmailアカウント等、対象サービスのアカウントとインターネット接続環境が必要です。",
  },
]

export default function LegalPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        <div className="pt-36 pb-24 max-w-[720px] mx-auto px-5">
          <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5 text-center">
            Legal
          </p>
          <h1 className="text-navy text-2xl md:text-3xl font-bold text-center mb-16">
            特定商取引法に基づく表記
          </h1>

          <table className="w-full">
            <tbody>
              {items.map((item) => (
                <tr key={item.label} className="border-b border-navy/10">
                  <th className="py-5 pr-4 text-left text-navy/50 text-sm font-medium w-32 md:w-44 align-top">
                    {item.label}
                  </th>
                  <td className="py-5 text-navy/80 text-sm leading-relaxed">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-navy/40 text-xs leading-relaxed mt-10">
            最終更新日：2026年7月10日
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
