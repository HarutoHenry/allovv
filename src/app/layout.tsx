import type { Metadata, Viewport } from "next";
import { Zen_Kaku_Gothic_New, Jost } from "next/font/google";
import { ScrollTop } from "@/components/scroll-top";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { JsonLd } from "@/components/json-ld";
import { ORG_ID, PERSON_ID, SITE_NAME, SITE_URL, siteDescription, siteTitle } from "@/lib/seo";
import "./globals.css";

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

// 正規URL（canonical）はここに置かない。子ページに引き継がれ、全ページが
// トップのURLを名乗ってしまう（2026-09-26 まで実際にそうなっていた）。各ページで pageMetadata() を使う
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteTitle,
    template: "%s | Allovv",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  // Google Search Console の所有権確認（URL プレフィックス https://www.allovv.com/）。消すと確認が外れる
  verification: {
    google: "U-lEDdVthPyTcR_YhLPsseuDglk2-6FgcDK0XaVL_p4",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8fcfb",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: siteDescription,
  foundingDate: "2025-06",
  founder: { "@id": PERSON_ID },
  knowsAbout: ["AI導入コンサルティング", "AI仕組み化", "業務改善", "業務効率化", "AI研修", "AIクリエイティブ制作"],
  areaServed: "JP",
  sameAs: [
    "https://x.com/allovv_ai",
    "https://www.instagram.com/allovv_ai/",
    "https://note.com/allovv",
  ],
  address: {
    "@type": "PostalAddress",
    addressRegion: "神奈川県",
    addressLocality: "横浜市",
    addressCountry: "JP",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "ja",
  publisher: { "@id": ORG_ID },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${zenKaku.variable} ${jost.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-white text-navy">
        <a href="#main" className="skip-link">
          本文へスキップ
        </a>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        <ScrollTop />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
