"use client"

import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { newsItems } from "@/lib/news-data"

export function NewsSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="news" className="py-28 md:py-36 bg-lavender-bg">
      <div ref={ref} className="max-w-[900px] mx-auto px-5 text-center">
        {/* Section Label */}
        <p className={`font-display font-light text-xs tracking-[0.2em] uppercase text-accent-purple mb-6 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          NEWS
        </p>

        {/* Heading */}
        <h2 className={`text-navy text-2xl md:text-3xl leading-relaxed mb-16 transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          最新のお知らせ
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {newsItems.map((item, index) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className={`glass-card p-6 text-left transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl group block ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + index * 120}ms` }}
            >
              {/* Date */}
              <p className="font-display text-sm text-navy/50 mb-3">
                {item.date}
              </p>
              
              {/* Category */}
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-4 ${item.categoryColor}`}>
                {item.category}
              </span>
              
              {/* Title */}
              <h3 className="text-navy text-sm leading-relaxed group-hover:text-accent-purple transition-colors">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/news"
          className={`inline-flex items-center gap-2 px-8 py-4 bg-white text-navy font-medium rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '500ms' }}
        >
          すべて見る
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
