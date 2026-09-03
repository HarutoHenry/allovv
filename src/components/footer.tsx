import Image from "next/image"
import Link from "next/link"
import { InstagramIcon, XIcon } from "@/components/social-icons"

const socialLinks = [
  { name: "X", href: "https://x.com/allovv_ai", Icon: XIcon },
  { name: "Instagram", href: "https://www.instagram.com/allovv_ai/", Icon: InstagramIcon },
]

const serviceLinks = [
  { href: "/#business", label: "事業内容" },
  { href: "/services/web", label: "ホームページ制作" },
  { href: "/services/ai-consulting", label: "料金" },
  { href: "/faq", label: "よくあるご質問" },
]

const companyLinks = [
  { href: "/#about", label: "会社概要" },
  { href: "/#news", label: "ニュース" },
  { href: "/#blog", label: "ブログ" },
  { href: "/#contact", label: "お問い合わせ" },
]

function LinkColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <p className="font-display font-light text-[10px] tracking-[0.22em] uppercase text-accent-mint/85 mb-5">
        {title}
      </p>
      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="footer-link inline-block text-white/70 hover:text-white text-sm transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="footer-ground relative overflow-hidden">
      {/* 継ぎ目の光 */}
      <div aria-hidden className="footer-seam absolute inset-x-0 top-0 h-px" />

      <div className="relative max-w-[900px] mx-auto px-5 py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:justify-between gap-14 md:gap-10">
          {/* 会社の言葉 */}
          <div className="md:max-w-[380px]">
            {/* ロゴはミント・ティール・モーブでできているので、紺地でそのまま読める（反転版は不要） */}
            <Link
              href="/"
              className="inline-block opacity-90 hover:opacity-100 transition-opacity"
              aria-label="Allovv トップへ"
            >
              <Image
                src="/logo.png"
                alt="Allovv"
                width={306}
                height={79}
                className="h-8 w-auto object-contain"
                placeholder="empty"
                unoptimized
              />
            </Link>
            <p className="footer-tagline font-display font-light text-[clamp(1.75rem,4.5vw,2.5rem)] leading-[1.15] tracking-[-0.01em] mt-5">
              Give more.
              <br />
              Allow more.
            </p>

            <div className="flex items-center gap-3 mt-9">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/25 text-white/70 hover:text-navy hover:bg-accent-mint hover:border-accent-mint transition-colors"
                  aria-label={`${name}（@allovv_ai）を開く`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ナビゲーション */}
          <nav aria-label="フッターナビゲーション" className="grid grid-cols-2 gap-10 sm:gap-16">
            <LinkColumn title="Services" links={serviceLinks} />
            <LinkColumn title="Company" links={companyLinks} />
          </nav>
        </div>

        {/* 下段 */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white/55 text-xs">
            <span>&copy; 2026 Allovv</span>
            <div className="flex flex-wrap gap-x-7 gap-y-3">
              <Link href="/privacy" className="footer-link hover:text-white transition-colors">
                プライバシーポリシー
              </Link>
              <Link href="/legal" className="footer-link hover:text-white transition-colors">
                特定商取引法に基づく表記
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
