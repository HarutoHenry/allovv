import Link from "next/link"
import { GuideLayout } from "@/components/guides/guide-layout"
import { pageMetadata } from "@/lib/seo"

const title = "AIで業務改善するには？業務の選び方と仕組み化の進め方"
const description = "AI活用の入口は、日々の業務を洗い出すことです。入力資料・完成形・確認担当を整理し、1業務で試してから広げる進め方を、見積書作成の検討例とともに説明します。"
const path = "/guides/ai-workflow"
export const metadata = pageMetadata({ title, description, path })

export default function AiWorkflowGuide() {
  return <GuideLayout title={title} description={description} path={path} sections={[
    { id: "meaning", label: "AI活用と仕組み化の違い" },
    { id: "choose", label: "最初に改善する業務の選び方" },
    { id: "example", label: "見積書の作成で考える、入力・出力・確認" },
    { id: "measure", label: "効果の測り方と、相談前の準備" },
  ]}>
    <section id="meaning">
      <h2>AI活用と、AI仕組み化はどう違う？</h2>
      <p>AI（Artificial Intelligence／人工知能）は、認識・予測・文章生成などに使われる技術の総称です。生成AIは、そのうち文章や画像などを生成する技術を指します。業務では、元資料から文章の下書きを作る、情報を整理する、といった用途が検討できます。出力に誤りが含まれることもあるため、確認の手順と組み合わせて使います。</p>
      <p>Allovvが考える「AI仕組み化」は、担当者がそのつどAIに質問する使い方から一歩進め、入力する資料、処理の手順、出力する書式、人の確認までを業務の流れとして揃えることです。誰が使うかだけでなく、誰が直し、誰が承認するかも決めます。</p>
      <p>決まった計算・転記・条件分岐は、表計算や通常のプログラムで処理するほうが適する場合があります。AIは、曖昧な文章の整理や下書きなど、役に立つ工程に組み込みます。</p>
      <p className="guide-source">基礎情報：<a href="https://www.ibm.com/jp-ja/think/topics/artificial-intelligence">IBM「人工知能（AI）とは」</a>。業務の進め方はAllovvの考え方です。</p>
    </section>
    <section id="choose">
      <h2>最初の1業務は、何を基準に選ぶ？</h2>
      <p>繰り返しが多く、元資料と完成形が分かり、出力を確認できる業務から検討します。「営業をAI化」のような大きなくくりを、「商談メモから提案のたたき台を作る」のように、開始と終了が分かる単位へ分けると具体化できます。</p>
      <div className="guide-table" tabIndex={0} role="region" aria-label="業務を選ぶ確認表">
        <table><caption>業務を洗い出すときの確認項目</caption><thead><tr><th scope="col">確認すること</th><th scope="col">具体的な問い</th><th scope="col">進める前に整理したい状態</th></tr></thead><tbody>
          <tr><th scope="row">繰り返しと負担</th><td>いつ、何件あり、確認までにどれだけ時間がかかるか</td><td>担当者の感覚だけでなく、実際の作業を数回記録する</td></tr>
          <tr><th scope="row">入力と完成形</th><td>何を見て、どの書式を完成させるか</td><td>使ってよい元資料と、正しい完成例が分かる</td></tr>
          <tr><th scope="row">人の確認</th><td>誤りに気づける担当者と照合資料があるか</td><td>確認箇所と、判断できないときの相談先が決まる</td></tr>
          <tr><th scope="row">例外</th><td>資料不足や普段と違う依頼をどう扱うか</td><td>無理に答えを作らず、人に戻す条件が分かる</td></tr>
        </tbody></table>
      </div>
      <p>確認できる人がいない、元資料が不正確、例外が多すぎる場合は、先に情報と手順を整えます。「AIを使えば何とかなる」という前提で進めず、試す範囲を小さく区切ります。</p>
    </section>
    <section id="example">
      <h2>見積書の作成を、4つの工程に分ける</h2>
      <p>以下は導入を検討するための説明例です。特定の顧客への導入実績や、削減効果を示すものではありません。</p>
      <ol>
        <li><strong>入力：</strong>依頼内容、過去の見積、現在の単価表、見積書の書式を確認する。古い単価や条件が混ざらないよう、使う資料を決める。</li>
        <li><strong>処理：</strong>依頼文から項目を整理し、該当する単価や過去資料の候補を示す。数量・単価・合計は決めた計算で照合する。</li>
        <li><strong>出力：</strong>社内の書式に合わせた見積の下書きと、根拠資料、不足している情報を用意する。</li>
        <li><strong>確認：</strong>担当者が仕様、数量、単価、適用条件を照合し、承認後に送付する。根拠が足りない項目は確定させない。</li>
      </ol>
      <p>最初の試行では、よくある依頼に加えて、情報が足りない依頼も使います。普段のケースで動くことと、判断できないケースで止まれることの両方を確かめます。</p>
      <p><Link href="/services/ai-consulting#scope">Allovvの支援範囲と成果物を見る →</Link></p>
    </section>
    <section id="measure">
      <h2>効果は、確認・修正を含めて測る</h2>
      <p>AIの処理速度だけでなく、資料を準備し、出力を確認・修正して、仕事を終えるまでの時間を比べます。似た種類の業務で件数と条件を揃え、やり直しや見落としも記録します。</p>
      <ul>
        <li>作業全体の時間：準備、入力、処理待ち、確認、修正、引き継ぎ</li>
        <li>品質：修正箇所、見落とし、担当者に戻した例外</li>
        <li>運用負担：ツール利用料、保守、担当者が迷った操作</li>
      </ul>
      <p>試行の段階で「どの状態なら続けるか」を決めます。確認の手間が増えているなら、入力資料や対象範囲を見直します。削減時間を、そのまま売上増加や人件費削減として扱わないことも大切です。</p>
      <h3>相談前に、この5点をメモする</h3>
      <ol><li>困っている業務と担当者</li><li>使う資料・ツール・現在の書式</li><li>発生頻度とおおよその作業時間</li><li>欲しい完成形と確認する人</li><li>困る例外、扱えない情報、希望時期</li></ol>
      <p>すべて決まっていなくても相談できます。初回は機密情報を除いた説明で十分です。Allovvでは業務の洗い出しから、構築・テスト運用・操作レクチャーまでを支援しています。</p>
      <p><Link href="/guides/fde-dx-ax-si">SIの意味とFDE・DX・AXの違いから、必要な支援を整理する →</Link></p>
    </section>
  </GuideLayout>
}
