"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { LiquidNavItem } from "@/components/liquid-nav-item"
import { SCROLL_TARGET_KEY } from "@/components/hash-scroll"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isTop = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#business", label: "SERVICES" },
    { href: "#philosophy", label: "PHILOSOPHY" },
    { href: "#news", label: "NEWS" },
    { href: "#blog", label: "BLOG" },
    { href: "#about", label: "COMPANY" },
  ]

  const handleNav = (id: string) => {
    setMobileMenuOpen(false)
    const anchor = id.replace("#", "")
    if (isTop) {
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" })
      }, 50)
    } else {
      // 遷移でハッシュが落ちてもトップページ側（HashScroll）が拾えるようにしておく
      try {
        sessionStorage.setItem(SCROLL_TARGET_KEY, anchor)
      } catch {
        // sessionStorage が使えない環境では無視する
      }
      router.push(`/#${anchor}`)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || mobileMenuOpen
          ? "bg-white/70 backdrop-blur-xl shadow-[0_1px_0_rgba(26,46,53,0.06),0_8px_32px_rgba(26,46,53,0.05)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 pt-[22px] pb-3 flex items-end translate-x-[20px]">
        {/* Logo — 左1/3 */}
        <div className="flex-1 flex items-center pl-[53px] lg:pl-[24px] xl:pl-[73px] 2xl:pl-[55px]">
          <Link href="/" className="flex items-center translate-y-[8px] lg:translate-y-[10px] 2xl:translate-y-[8px]">
            <Image
              src="/logo.png"
              alt="Allovv"
              width={200}
              height={67}
              className="h-11 lg:h-[42px] 2xl:h-[45px] w-auto object-contain"
              style={{ background: "transparent" }}
              placeholder="empty"
              priority
              unoptimized
            />
          </Link>
        </div>

        {/* Desktop Nav — 中央1/3 */}
        <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-[38px] translate-y-[3px] lg:translate-y-[8px] 2xl:translate-y-[3px] 2xl:-translate-x-[8px]">
          {navLinks.map((link) => (
            <LiquidNavItem
              key={link.href}
              label={link.label}
              onClick={() => handleNav(link.href)}
            />
          ))}
        </div>

        {/* CTA Button — 右1/3 */}
        <div className="flex-1 hidden lg:flex items-center justify-end pr-[24px] xl:pr-[124px] 2xl:pr-[65px] translate-y-[8px] lg:translate-y-[13px] 2xl:translate-y-[8px]">
          <button
            onClick={() => handleNav("#contact")}
            className="px-6 py-2.5 gradient-btn font-medium text-sm rounded-full transition-all"
          >
            お問い合わせ
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-navy transition-colors translate-y-[10px] -translate-x-[13px]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-white/95 backdrop-blur-[16px] border-t border-navy/10 animate-menu-in">
          <div className="px-5 py-4 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="block text-navy/70 hover:text-navy font-display font-light text-xs tracking-[0.15em] transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav("#contact")}
              className="block w-full text-center px-5 py-2.5 gradient-btn font-medium text-sm rounded-full"
            >
              お問い合わせ
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
