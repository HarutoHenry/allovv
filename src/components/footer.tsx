import Link from "next/link"

const footerLinks = [
  { href: "/#business", label: "事業内容" },
  { href: "/services/ai-consulting", label: "料金" },
  { href: "/faq", label: "よくあるご質問" },
  { href: "/#about", label: "会社概要" },
  { href: "/#news", label: "ニュース" },
  { href: "/#contact", label: "お問い合わせ" },
]

export function Footer() {
  return (
    <footer className="bg-navy py-16">
      <div className="max-w-[900px] mx-auto px-5">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
          {/* Logo + Tagline */}
          <div className="text-center md:text-left">
            <Link href="/" className="font-display font-bold text-xl text-white tracking-tight">
              Allovv
            </Link>
            <p className="font-display font-light text-white/40 text-xs tracking-[0.12em] mt-2">
              Give more. Allow more.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="フッターナビゲーション" className="flex flex-wrap justify-center gap-6 md:gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Bottom Links */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white/40 text-xs">
            <span>&copy; 2026 Allovv</span>
            <Link href="/privacy" className="hover:text-white/60 transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/legal" className="hover:text-white/60 transition-colors">
              特定商取引法に基づく表記
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
