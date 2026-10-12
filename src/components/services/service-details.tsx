import Link from "next/link"

const wrap = "max-w-[1200px] mx-auto px-5 md:px-10 py-20 md:py-28"
const body = "text-white/75 text-[15px] md:text-[16px] leading-[1.95]"

function Questions({ id, items }: { id: string; items: { q: string; a: string }[] }) {
  return (
    <section id={id} className="border-t border-white/10 scroll-mt-24">
      <div className={wrap}>
        <h2 className="svc-h2 text-white">ご相談の前に</h2>
        <div className="mt-10 divide-y divide-white/15 border-y border-white/15">
          {items.map(({ q, a }) => (
            <details key={q} className="py-6 group">
              <summary className="cursor-pointer text-white text-lg font-medium leading-relaxed marker:text-[#9fe8dc]">{q}</summary>
              <p className={`${body} mt-4 max-w-[52em]`}>{a}</p>
            </details>
          ))}
        </div>
        <Link href="/faq" className="svc-link mt-7 text-sm">費用・情報の取り扱い・サポートの質問をすべて読む →</Link>
      </div>
    </section>
  )
}

export function ConsultingDetails() {
  return (
    <>
      <section id="scope" className="border-t border-white/10 scroll-mt-24">
        <div className={wrap}>
          <p className="svc-kicker">Scope & Deliverables</p>
          <h2 className="svc-h2 text-white mt-5">何を一緒に作るのか</h2>
          <p className={`${body} mt-6 max-w-[52em]`}>AI導入支援では、業務の整理から仕組みの構築、使い方のレクチャーまでを扱います。社内で使い始めるために必要なものを、対象の1業務に合わせて揃えます。</p>
          <dl className="mt-10 border-b border-white/15">
            {[
              ["業務の整理", "現在の入力資料、作業手順、完成させたい書式を確認。AIに任せる工程と、人が判断する工程を決めます。"],
              ["使える仕組み", "合意した業務の下書き・整理・確認を支える仕組みを構築。テスト運用で、実際の書式や手順に合わせて調整します。"],
              ["操作と引き継ぎ", "操作マニュアルとレクチャーで使い方を共有。導入後1ヶ月は、調整・改善・質問対応を行います。"],
            ].map(([title, text]) => (
              <div key={title} className="grid md:grid-cols-3 gap-3 md:gap-10 py-7 border-t border-white/15">
                <dt className="text-[#9fe8dc] text-xl font-bold">{title}</dt>
                <dd className={`${body} md:col-span-2`}>{text}</dd>
              </div>
            ))}
          </dl>
          <div className="grid md:grid-cols-2 gap-9 mt-12">
            <div>
              <h3 className="text-white font-bold text-xl">見積りで確認すること</h3>
              <p className={`${body} mt-4`}>書類の種類、手順の複雑さ、連携するツール、扱う件数によって必要な設計が変わります。外部ツールの利用料は導入費とは別の実費です。追加機能や継続運用の範囲は、見積り時に確認します。</p>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">社内で決めておくこと</h3>
              <p className={`${body} mt-4`}>出力を確認する担当者と、正しい内容を照合できる資料を決めます。既存システムとの連携は、そのシステムの接続方法や権限を確認して判断します。初回相談では、機密情報を除いた業務の説明から始められます。</p>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-white/10">
        <div className={`${wrap} grid lg:grid-cols-2 gap-10`}>
          <div>
            <p className="svc-kicker">FDE</p>
            <h2 className="svc-h2 text-white mt-5">現場の課題を、実装につなぐ</h2>
          </div>
          <div className={body}>
            <p>FDE（Forward Deployed Engineer）は、顧客の業務に近い場所で課題を理解し、実装と改善を進めるエンジニアの役割です。Allovvも、業務の洗い出し、構築、使い方の標準化を一連の支援として考えています。</p>
            <p className="mt-4">訪問・常駐の要否や頻度、保守の範囲は個別に確認します。まずは改善したい1業務を起点にご相談ください。</p>
            <Link href="/guides/fde-dx-ax-si" className="svc-link mt-6">SIの意味とFDE・DX・AXの違い、支援を選ぶ基準 →</Link>
          </div>
        </div>
      </section>
      <Questions id="consulting-faq" items={[
        { q: "AI導入で、どの業務から始めればよいですか？", a: "繰り返しが多く、元資料と完成形が分かり、担当者が出力を確認できる業務が検討の入口になります。最初に日々の業務を伺い、AIに向く工程と人が残す工程を整理します。" },
        { q: "AI導入コンサルの費用には何が含まれますか？", a: "業務効率化は1業務¥50,000〜（税別）。業務フローのヒアリング、構築、テスト運用、操作レクチャーと導入後1ヶ月のサポートを含みます。外部ツールの実費は別途必要です。最終金額は対象業務を確認して提示します。" },
        { q: "研修と、業務の仕組み化はどう違いますか？", a: "研修は社員の方がAIを使いこなすための支援です。仕組み化は、決めた業務で下書きなどを用意する流れを構築する支援です。必要な範囲に合わせてご相談いただけます。" },
        { q: "AIに任せた結果は、誰が確認しますか？", a: "最終的な確認と判断は人が行います。見積の金額、契約の条件、社外に出す文章などは、担当者が原資料と照らして確認する流れを設計します。" },
      ]} />
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 pb-16">
        <Link href="/guides/ai-workflow" className="svc-link">相談前に整理できる、AI業務改善の進め方を読む →</Link>
      </div>
    </>
  )
}

export function TrainingDetails() {
  return (
    <>
      <section className="border-t border-white/10">
        <div className={wrap}>
          <p className="svc-kicker">For Your Team</p>
          <h2 className="svc-h2 text-white mt-5">社員のAI活用を、日々の仕事へ</h2>
          <div className="grid md:grid-cols-2 gap-10 mt-9">
            <div>
              <h3 className="text-white text-xl font-bold">こんな課題のある企業に</h3>
              <ul className={`${body} mt-5 space-y-3 list-disc pl-5`}>
                <li>生成AIを試しているが、自分の業務への使い方が分からない</li>
                <li>指示の書き方が人によって違い、社内の型を作りたい</li>
                <li>バックオフィス・営業・会議の仕事で実際に練習したい</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">相談時に教えていただきたいこと</h3>
              <p className={`${body} mt-5`}>受講する方の担当業務、人数、AIの利用経験、希望日程をお知らせください。教材にしたい書類があれば、まず種類と用途を伺います。原本を共有する前に、機密情報・個人情報の扱いを確認します。</p>
            </div>
          </div>
          <p className={`${body} mt-9 pt-7 border-t border-white/15`}>研修後には、見返せる社内マニュアルをお渡しします。社内で実際に使う業務を決めておくと、学んだ指示の型を試し、確認・修正しながら活用を続けやすくなります。</p>
          <Link href="/guides/ai-workflow" className="svc-link mt-6">研修の題材にも使える、改善業務の選び方 →</Link>
        </div>
      </section>
      <Questions id="training-faq" items={[
        { q: "AI研修だけでも依頼できますか？", a: "はい。研修のみのご依頼も承ります。業務システムの構築をご希望の場合は、AI導入コンサルティングで別途ご相談いただけます。" },
        { q: "費用・時間・人数はどのくらいですか？", a: "¥150,000〜（税別）、全10〜12時間、1社5名までが基本です。半日×3回など日程は相談でき、人数の追加もご相談いただけます。内容と金額は日程・人数を伺ったうえで提示します。" },
        { q: "オンラインでも受講できますか？", a: "オンラインと貴社への訪問、どちらにも対応しています。実施形式と日程はご相談ください。" },
        { q: "何を学び、何を持ち帰れますか？", a: "生成AIの基礎とやってはいけないこと、プロンプトの書き方と社内の型づくり、バックオフィス・営業・会議での活用を扱います。貴社の業務・書類を教材にし、受講後には社内マニュアルをお渡しします。" },
      ]} />
    </>
  )
}
