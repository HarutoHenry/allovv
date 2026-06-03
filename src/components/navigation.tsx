"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { LiquidNavItem } from "@/components/liquid-nav-item"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    { href: "#about", label: "COMPANY" },
  ]

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false)
    setTimeout(() => {
      document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" })
    }, 50)
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-8 pt-[22px] pb-3 flex items-end translate-x-[20px]">
        {/* Logo — 左1/3 */}
        <div className="flex-1 flex items-center pl-[63px] md:pl-[60px] lg:pl-[73px]">
          <Link href="/" className="flex items-center translate-y-[8px] lg:translate-y-[10px]">
            <Image
              src="/logo.png"
              alt="Allovv"
              width={200}
              height={67}
              className="h-11 md:h-[34px] lg:h-[47px] 2xl:h-14 w-auto object-contain"
              style={{ background: "transparent" }}
              placeholder="empty"
              priority
              unoptimized
            />
          </Link>
        </div>

        {/* Desktop Nav — 中央1/3 */}
        <div className="hidden md:flex items-center justify-center gap-[38px] translate-y-[3px] lg:translate-y-[8px]">
          {navLinks.map((link) => (
            <LiquidNavItem
              key={link.href}
              label={link.label}
              onClick={() => scrollTo(link.href)}
            />
          ))}
        </div>

        {/* CTA Button — 右1/3 */}
        <div className="flex-1 hidden md:flex items-center justify-end pr-[60px] lg:pr-[124px] 2xl:pr-[60px] translate-y-[8px] lg:translate-y-[13px]">
          <button
            onClick={() => scrollTo("#contact")}
            className="px-6 py-2.5 gradient-btn font-medium text-sm rounded-full transition-all"
          >
            お問い合わせ
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 transition-colors translate-y-[10px] ${scrolled ? 'text-navy' : 'text-navy'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="メニューを開く"
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
        <div className="md:hidden bg-white/95 backdrop-blur-[16px] border-t border-navy/10">
          <div className="px-5 py-4 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="block text-navy/70 hover:text-navy font-display font-light text-xs tracking-[0.15em] transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("#contact")}
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
