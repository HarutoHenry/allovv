import type { Metadata, Viewport } from "next";
import { Zen_Kaku_Gothic_New, Jost } from "next/font/google";
import { ScrollTop } from "@/components/scroll-top";
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

const siteDescription =
  "Allovvは、人工知能の力を事業の推進力に変えるAIカンパニーです。起業支援・AI仕組み化・システム開発を通じて、あらゆる挑戦の障壁を取り除きます。";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.allovv.com"),
  title: {
    default: "Allovv | AIで、日本のビジネスインフラを変える",
    template: "%s | Allovv",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://www.allovv.com",
    siteName: "Allovv",
    title: "Allovv | AIで、日本のビジネスインフラを変える",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Allovv | AIで、日本のビジネスインフラを変える",
    description: siteDescription,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8fcfb",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Allovv",
  url: "https://www.allovv.com",
  logo: "https://www.allovv.com/logo.png",
  description: siteDescription,
  foundingDate: "2026-06",
  address: {
    "@type": "PostalAddress",
    addressRegion: "神奈川県",
    addressLocality: "横浜市",
    addressCountry: "JP",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ScrollTop />
        {children}
      </body>
    </html>
  );
}
