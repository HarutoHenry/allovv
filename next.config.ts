import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ビルドの基準フォルダをこのプロジェクトに固定する。指定しないとホーム直下の
     package-lock.json を拾って ~/ が基準になり、内部の名前に「Webサイト」が混ざる。
     ページ名の長さによってはそこで Turbopack が落ちる（2026-09-26 /services/ai-training で発生）。
     Vercel 上はもともとこのフォルダが基準なので、本番の出力は変わらない */
  turbopack: {
    root: path.join(__dirname),
  },
  /* スマホ実機で開発中の画面を見るため。localhost 以外から dev サーバーに来た
     リクエストは Next が既定で弾くので、同じWi-Fi内のアドレスだけ通す。
     本番ビルドには影響しない（dev 専用の設定） */
  allowedDevOrigins: ["192.168.40.140", "192.168.*.*", "harutonomac-mini.local"],
  /* dev サーバーのキャッシュ（.next/dev/cache/turbopack）を保存しない。16.1 から既定で有効で、
     8月から溜まって 1.9GB・約1.8万ファイルになり、起動直後の「Compiling」中にメモリを食い尽くして
     Mac ごと固まった（2026-09-26 に2回・09-28 に1回）。切ると初回の表示が数秒遅くなるだけ。
     本番ビルドには影響しない（dev 専用の設定） */
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  /* 導入事例ページ（/cases）は 2026-09-30 に取り下げた。検索結果やブックマークから来た人が
     404 にならないよう、サービスのページへ恒久的に送る */
  async redirects() {
    return [{ source: "/cases", destination: "/services/ai-consulting", permanent: true }]
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.st-note.com" },
      { protocol: "https", hostname: "d2l930y2yx77uc.cloudfront.net" },
    ],
  },
};

export default nextConfig;
