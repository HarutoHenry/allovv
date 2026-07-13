import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.st-note.com" },
      { protocol: "https", hostname: "d2l930y2yx77uc.cloudfront.net" },
    ],
  },
};

export default nextConfig;
