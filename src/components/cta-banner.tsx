"use client"

import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function CTABanner() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section 
      className="py-24 md:py-32"
      style={{
        background: "linear-gradient(135deg, #c5f5e8 0%, #ffe4ef 100%)"
      }}
    >
      <div ref={ref} className="max-w-[900px] mx-auto px-5 text-center">
        <h2 className={`text-navy text-2xl md:text-4xl font-bold mb-4 md:mb-6 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          まず、話してみませんか。
        </h2>
        <p className={`text-navy/70 text-base md:text-lg mb-10 px-2 md:px-0 transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          事業のご相談・取材・採用、いずれも無料でお受けしています。
        </p>
        <Link
          href="#contact"
          className={`inline-flex items-center gap-2 px-10 py-4 bg-white text-navy font-medium rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '200ms' }}
        >
          お問い合わせ
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
