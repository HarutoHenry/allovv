import { SlipMark } from "@/components/services/slip-mark"

// 実測の裏付けがない成果数値は載せず、相談時に検討する入力・出力・確認を示す。
const industries = [
  { name: "士業", task: "顧客向けの説明文を準備する", input: "相談内容、確認済みの事実、事務所の説明書式", output: "説明の下書きと、追加で確認する項目", review: "専門家が根拠・適用条件・最終回答を確認" },
  { name: "不動産", task: "物件紹介文を作る", input: "物件資料、確認済みの設備・条件、掲載先の書式", output: "掲載文の下書きと、資料で確認できない項目", review: "担当者が価格・設備・表現を原資料と照合" },
  { name: "建設・工務店", task: "打ち合わせの決定事項を整理する", input: "録音・メモ、案件名、議事録の書式", output: "決定事項、未決事項、担当・期限の候補", review: "参加者が仕様変更や約束した内容を確認" },
  { name: "製造・金属加工", task: "見積の準備を進める", input: "依頼条件、過去の見積、確認済みの単価表", output: "類似見積の候補と、見積書の下書き", review: "担当者が仕様・数量・単価・製造可否を確認" },
  { name: "小売・EC", task: "商品説明文を作る", input: "商品仕様、写真、販売時の注意事項", output: "販売ページに合わせた説明文の下書き", review: "担当者が仕様・在庫・効能などの表現を確認" },
  { name: "飲食店", task: "シフトのたたき台を作る", input: "勤務希望、必要人数、担当できる業務", output: "シフト案と、人数不足・条件不一致の一覧", review: "店長が配置・勤務条件を確認して確定" },
  { name: "広告・デザイン", task: "企画書の初稿を作る", input: "依頼内容、対象顧客、確認済みの商品情報", output: "構成案と広告コピーの候補", review: "担当者が訴求の根拠・権利・ブランド表現を確認" },
  { name: "美容・サロン", task: "店舗の発信内容を整える", input: "店舗メニュー、写真、営業日、伝えたい内容", output: "SNS投稿文と掲載予定の下書き", review: "担当者が料金・日付・写真の使用可否を確認" },
  { name: "介護・保育", task: "日々の記録を整理する", input: "担当者のメモと施設の記録様式", output: "記録の下書きと、記入が不足している項目", review: "担当者が事実と個人情報の扱いを確認。専門判断は人が行う" },
  { name: "物流・運送", task: "配送依頼を一覧に整理する", input: "依頼書、配送条件、社内の管理書式", output: "依頼一覧と、住所・時間指定などの不足項目", review: "担当者が配送条件と受け入れ可否を確認" },
]

export function IndustryCases() {
  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-16 md:pt-24 pb-24 md:pb-32">
      <p className="svc-kicker"><SlipMark />Use Cases</p>
      <h2 className="svc-h2 text-white mt-5">業種別・AI活用の検討例</h2>
      <p className="mt-6 text-white/70 text-[15px] leading-[1.9] max-w-[50em]">業務を整理するときの例です。Allovvの導入実績や効果の実測値ではありません。実際に対応する範囲は、元資料・既存ツール・確認できる担当者を伺って決めます。</p>
      <div className="grid md:grid-cols-2 gap-x-12 mt-10">
        {industries.map(item => (
          <details key={item.name} className="py-6 border-t border-white/15">
            <summary className="cursor-pointer text-white marker:text-[#9fe8dc] leading-relaxed"><span className="text-xl font-bold">{item.name}</span><span className="block text-sm text-white/70 mt-2 ml-4">{item.task}</span></summary>
            <dl className="mt-6 space-y-4 text-sm leading-[1.9]">
              {[["入力する資料", item.input], ["AIが用意するもの", item.output], ["人が確認すること", item.review]].map(([label, value]) => <div key={label}><dt className="text-[#9fe8dc] font-bold">{label}</dt><dd className="mt-1 text-white/75">{value}</dd></div>)}
            </dl>
          </details>
        ))}
      </div>
    </div>
  )
}
