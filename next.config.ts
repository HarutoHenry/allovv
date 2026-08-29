import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* スマホ実機で開発中の画面を見るため。localhost 以外から dev サーバーに来た
     リクエストは Next が既定で弾くので、同じWi-Fi内のアドレスだけ通す。
     本番ビルドには影響しない（dev 専用の設定） */
  allowedDevOrigins: ["192.168.40.140", "192.168.*.*", "harutonomac-mini.local"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.st-note.com" },
      { protocol: "https", hostname: "d2l930y2yx77uc.cloudfront.net" },
    ],
  },
};

export default nextConfig;
