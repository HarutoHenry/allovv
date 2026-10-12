import Link from "next/link"
import { GuideLayout } from "@/components/guides/guide-layout"
import { pageMetadata } from "@/lib/seo"

const title = "SIとは？AIの新しい呼称とFDE・DX・AXの違い"
const description = "SIはSuper Intelligence（超知能）。米国行政府でAIの呼称をSIへ変更する動きと、その適用範囲を解説します。DX・AX・FDEとの違いも整理し、企業のAI活用で確認する支援範囲をご案内します。"
const path = "/guides/fde-dx-ax-si"
export const metadata = pageMetadata({ title, description, path })

export default function TermsGuide() {
  return <GuideLayout title={title} description={description} path={path} sections={[
    { id: "si", label: "SIの意味と、AIからの呼称変更" },
    { id: "compare", label: "SI・DX・AX・FDEを比較する" },
    { id: "fde", label: "FDEとAIコンサルの関係" },
    { id: "scope", label: "依頼前に確認する支援範囲" },
    { id: "allovv", label: "AllovvのAI導入支援との関係" },
  ]}>
    <section id="si">
      <h2>SIとは？AIを「Super Intelligence」と呼ぶ動き</h2>
      <p>ここでいうSIは、Super Intelligence（超知能）の略です。2026年9月29日、米国では大統領令第14434号により、行政府の公式な通信・広報・ウェブサイト・報告書などで、法令上許される範囲で「Artificial Intelligence／AI」に代えて「Super Intelligence／SI」を使う方針が示されました。</p>
      <p>これは米国行政府での呼称変更です。世界共通でAIという名称が廃止されたことを意味しません。また、呼び名の変更と、技術として人間の知能を超える「超知能」を実現したかどうかは別の話です。</p>
      <p>大統領令では、当面のSIの定義に既存の米連邦法上のAIの定義を用いるとしています。企業のAI活用を考えるときは、名前だけで性能を判断せず、実際にできる業務と確認が必要な点を見ます。</p>
      <p className="guide-source">出典：<a href="https://www.whitehouse.gov/presidential-actions/2026/09/inaugurating-the-era-of-super-intelligence/">ホワイトハウス「Inaugurating the Era of Super Intelligence」（2026年9月29日、第2・3節）</a>。2026年10月12日確認。</p>
    </section>
    <section id="compare">
      <h2>呼称・変革の方向性・役割を分けて考える</h2>
      <p>SIはAIの呼称に関する言葉、DX・AXは事業や業務を変える方向性、FDEは現場で実装を進める役割です。同じ分類の選択肢ではありません。名前だけで発注先を選ばず、何を作り、どこまで運用を支援するかで比べます。</p>
      <div className="guide-table" tabIndex={0} role="region" aria-label="DX・AX・SI・FDEの比較表">
        <table><caption>AI導入を検討するときの用語の整理</caption><thead><tr><th scope="col">用語</th><th scope="col">意味・位置づけ</th><th scope="col">相談で確認すること</th></tr></thead><tbody>
          <tr><th scope="row">DX<br /><span>Digital Transformation</span></th><td>データやデジタル技術を活用し、事業・業務・組織などを変革する考え方。AIの利用に限りません。</td><td>どんな事業上の変化を目指すか</td></tr>
          <tr><th scope="row">AX<br /><span>AI Transformation</span></th><td>AIを軸に業務や組織を変える意味で使われる言葉。本ガイドではこの意味で扱いますが、使い手によって範囲が異なります。</td><td>「AI化」の対象が1業務か、組織全体か</td></tr>
          <tr><th scope="row">SI<br /><span>Super Intelligence</span></th><td>米国行政府でAIに代えて用いる呼称。ここでは2026年9月の呼称変更の意味で扱います。</td><td>名称にかかわらず、実際の機能・精度・確認手順</td></tr>
          <tr><th scope="row">FDE<br /><span>Forward Deployed Engineer</span></th><td>顧客の業務に近い場所で課題を理解し、実装と改善を進めるエンジニアの役割。具体的な担当範囲は提供者ごとに異なります。</td><td>課題整理・実装・定着を誰が担当するか</td></tr>
        </tbody></table>
      </div>
      <p className="guide-source">出典：DXは<a href="https://www.chusho.meti.go.jp/pamflet/hakusyo/2024/chusho/b1_4_7.html">中小企業庁「2024年版中小企業白書・DX」</a>、AX・FDEの使用例は<a href="https://www.hitachi.com/ja-jp/press/articles/2026/06/0609a/">日立の2026年6月9日発表</a>を参照。SIの出典は上記の米大統領令です。比較の軸はAllovvによる整理です。</p>
    </section>
    <section id="fde">
      <h2>FDEは、AIコンサルとどう関わる？</h2>
      <p>AIコンサルティングは課題整理・技術選定・導入計画などを含む広いサービスの呼び名で、実装や運用まで支援する場合があります。FDEは職種や支援の進め方を指し、課題を現場で理解して実装につなぐ役割です。具体的な担当範囲は提供者ごとに確認します。</p>
      <p>たとえば問い合わせ対応を改善するなら、業務の聞き取り、必要な情報の整理、既存台帳との接続、返信の下書き、承認の流れ、使い方の共有までが検討対象です。大切なのは、それぞれを誰が担当し、変更が必要なときにどう戻せるかです。</p>
      <p>FDEという名前から、常駐・無制限の修正・特定製品への対応を想定することはできません。契約形態、訪問の頻度、担当者、成果物と責任範囲を個別に確認します。</p>
      <p className="guide-source">役割の具体例：<a href="https://www.fsi.co.jp/solution/data-analytics/blog/glossary/glossary0005.html">富士ソフト「FDEモデル型コンサル」</a>。各社のサービス内容とAllovvの提供範囲は異なります。</p>
    </section>
    <section id="scope">
      <h2>AI導入支援を選ぶときの確認項目</h2>
      <ul>
        <li><strong>課題：</strong>使うAIの名前より先に、改善したい業務と現在の負担を整理してくれるか。</li>
        <li><strong>成果物：</strong>調査資料、試作、運用する仕組み、操作マニュアルのどこまでが含まれるか。</li>
        <li><strong>連携：</strong>既存システムの接続方法・権限・費用を調べたうえで範囲を決めるか。</li>
        <li><strong>確認：</strong>出力の誤りや資料不足を、誰がどう確認・修正するか。</li>
        <li><strong>費用：</strong>初期費用、外部ツールの利用料、保守費、追加修正を分けて説明しているか。</li>
        <li><strong>定着：</strong>研修、質問対応、引き継ぎ、解約後の利用条件が明確か。</li>
      </ul>
      <p>デモで動くことと、日々の例外を含めて業務で使えることは、確認する条件が異なります。契約前に、試す資料・完了条件・本番へ移す条件をすり合わせます。</p>
    </section>
    <section id="allovv">
      <h2>Allovvでは、1業務の洗い出しから</h2>
      <p>AllovvのAI導入コンサルティングは、業務設計、AI構築、標準化の順で進めます。普段の書式や手順を確認し、AIが下書きなどを用意する仕組みを作り、操作マニュアルとレクチャーで使い方を共有します。</p>
      <p>「現場で考え、現場で使えるAIの仕組みを作る」という姿勢を、FDEの言葉とともに紹介しています。常駐体制や全社システム刷新までを一律に約束するものではありません。訪問頻度や連携・保守の範囲は、必要な業務を伺って確認します。</p>
      <p>社員自身がAIを使う力を育てたい場合はAI研修、決まった業務の流れを作りたい場合はAI導入コンサルが相談の入口です。</p>
      <p><Link href="/guides/ai-workflow">次に読む：AIに任せる業務の選び方と効果の測り方 →</Link></p>
    </section>
  </GuideLayout>
}
