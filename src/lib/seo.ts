import type { Metadata } from "next"

export const SITE_URL = "https://www.allovv.com"
export const SITE_NAME = "Allovv"
/** 構造化データの中で「Allovv という組織」を指す共通の名札。各ページの Service や記事からここを参照する */
export const ORG_ID = `${SITE_URL}/#organization`

// 検索で拾ってほしい言葉（AI導入・AIコンサル・AI仕組み化・業務改善）を、トップの題名と説明文に自然に入れる。
// 事業の書き方は AGENTS.md に従う（単機能を主語にせず「業務を洗い出し、AIで置き換える」の枠で）
export const siteTitle = "AI導入コンサル・AI仕組み化で業務改善 | Allovv"
export const siteDescription =
  "Allovvは、AI導入コンサルティングとAIクリエイティブ制作を手がけるAIカンパニーです。業務を洗い出し、AIで置き換えられるところから仕組み化して、業務改善・業務効率化につなげます。AI研修、ホームページ制作、起業支援にも対応しています。"

type PageMeta = {
  /** 検索結果に出る題名。末尾の「 | Allovv」は自動で付く */
  title: string
  description: string
  /** このページの正規URL（パス）。親レイアウトの値を引き継ぐと全ページが同じURLを名乗り、
      検索エンジンに「トップの複製」とみなされるので、ページごとに必ず渡す */
  path: string
  /** true なら題名に「 | Allovv」を付けない（トップ用） */
  absolute?: boolean
  /** お知らせ記事のときだけ渡す（公開日は ISO 形式） */
  article?: { publishedTime: string }
  images?: string[]
}

/**
 * ページごとの題名・説明文・正規URL・SNS共有時の表示をまとめて作る。
 * openGraph と twitter は親と「丸ごと差し替え」で合成されるので、
 * siteName や locale もここで毎回入れ直す
 */
export function pageMetadata({ title, description, path, absolute, article, images }: PageMeta): Metadata {
  const fullTitle = absolute ? title : `${title} | ${SITE_NAME}`
  // openGraph を自分で書くと、app/opengraph-image.tsx の共有画像が子ページに付かなくなる。
  // 記事の写真が無いページは、その共通画像を明示して SNS で画像なしのカードにならないようにする
  images ??= ["/opengraph-image"]
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: article ? "article" : "website",
      locale: "ja_JP",
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      ...(article && { publishedTime: article.publishedTime }),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images,
    },
  }
}

/** パンくず（TOP > お知らせ > 記事名 など）の構造化データ。最後の項目が今いるページ */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  }
}

/** 「¥150,000〜」→ 150000。「お見積り」のように数字が無ければ undefined */
export function yen(price: string) {
  const digits = price.replace(/[^\d]/g, "")
  return digits ? Number(digits) : undefined
}
