import type { Metadata } from "next";
import { Noto_Sans_JP, DM_Sans } from "next/font/google";
import { ScrollTop } from "@/components/scroll-top";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Allovv株式会社 | AIで、日本のビジネスインフラを変える",
  description: "Allovvは、人工知能の力を事業の推進力に変えるAIカンパニーです。起業支援・AI導入・システム開発を通じて、あらゆる挑戦の障壁を取り除きます。",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-white text-navy">
        <ScrollTop />
        {children}
      </body>
    </html>
  );
}
