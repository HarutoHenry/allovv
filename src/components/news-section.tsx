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
        <h2 className={`text-navy font-bold text-2xl md:text-3xl leading-relaxed mb-16 transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          最新のお知らせ
        </h2>

        {/* News List */}
        <ul className={`glass-card divide-y divide-navy/8 overflow-hidden text-left mb-12 transition-all duration-600 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {newsItems.map((item, index) => (
            <li key={item.slug}>
              <Link
                href={`/news/${item.slug}`}
                className={`group flex flex-col md:flex-row md:items-center gap-2 md:gap-6 px-6 md:px-8 py-6 transition-all duration-500 hover:bg-white/70 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${250 + index * 100}ms` }}
              >
                <div className="flex items-center gap-4 shrink-0">
                  <time className="font-display text-sm text-navy/50 tabular-nums w-24">
                    {item.date}
                  </time>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${item.categoryColor}`}>
                    {item.category}
                  </span>
                </div>
                <h3 className="flex-1 text-navy text-sm leading-relaxed group-hover:text-accent-purple transition-colors">
                  {item.title}
                </h3>
                <svg
                  className="hidden md:block w-4 h-4 text-navy/30 shrink-0 transition-all group-hover:text-accent-purple group-hover:translate-x-1"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>

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
