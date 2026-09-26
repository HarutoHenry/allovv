/**
 * 検索エンジン向けの構造化データ（JSON-LD）を埋め込む。
 * 記事本文などが入っても </script> で抜け出せないよう、< を < に置き換える
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
