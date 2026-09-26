/**
 * 日本語の見出しが、スマホ幅で語の途中（「実際／の業務」「書／き方」など）で折り返されないようにする。
 * 「、」の直後で区切り、区切った塊ごとに inline-block にして、折り返しを塊の境目に寄せる。
 * 塊そのものが1行に収まらない幅では、塊の中で普通に折り返す（はみ出しはしない）
 */
export function PhraseWrap({ text }: { text: string }) {
  return text.split(/(?<=、)/).map((phrase, i) => (
    <span key={i} className="inline-block">
      {phrase}
    </span>
  ))
}
