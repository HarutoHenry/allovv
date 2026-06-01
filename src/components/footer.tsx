import Link from "next/link"

const footerLinks = [
  { href: "#business", label: "事業内容" },
  { href: "#about", label: "会社概要" },
  { href: "#news", label: "ニュース" },
  { href: "#contact", label: "お問い合わせ" },
]

export function Footer() {
  return (
    <footer className="bg-navy py-16">
      <div className="max-w-[900px] mx-auto px-5">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Logo */}
          <Link href="/" className="font-display font-bold text-xl text-white tracking-tight">
            Allovv
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
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

          {/* Social */}
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/60 hover:text-accent-mint transition-colors"
            aria-label="X (Twitter)"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Bottom Links */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white/40 text-xs">
            <span>&copy; 2025 Allovv Inc.</span>
            <Link href="#" className="hover:text-white/60 transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="#" className="hover:text-white/60 transition-colors">
              特定商取引法
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
