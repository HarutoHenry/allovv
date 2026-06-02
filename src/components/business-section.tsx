"use client"

import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const businessCards = [
  {
    tag: "個人向け",
    tagColor: "bg-[#ffe4ef] text-[#d4788a]",
    category: "Platform",
    title: "AIにおまかせ起業",
    description: "起業に必要な手続き・書類作成・専門家連携をAIが自動化。誰でも確実に起業を完走できるプラットフォームを提供します。"
  },
  {
    tag: "法人向け",
    tagColor: "bg-[#e0f7f4] text-[#5fb8ab]",
    category: "Consulting",
    title: "AI導入コンサルティング",
    description: "業務フロー分析からAIツール選定・導入・定着まで伴走。中小企業・スタートアップのAI活用を最短距離で実現します。"
  },
  {
    tag: "法人向け",
    tagColor: "bg-[#e0f7f4] text-[#5fb8ab]",
    category: "Creative",
    title: "AIクリエイティブ制作",
    description: "画像・動画・広告コピーなど、AIを活用したクリエイティブ制作をワンストップで提供。高品質なコンテンツを短期間・低コストで実現します。"
  }
]

export function BusinessSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="business" className="py-28 md:py-36 bg-white">
      <div ref={ref} className="max-w-[900px] mx-auto px-5 text-center">
        {/* Section Label */}
        <p className={`font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-6 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          BUSINESS
        </p>

        {/* Heading */}
        <h2 className={`text-navy text-2xl md:text-3xl leading-relaxed mb-16 transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Allovvは3つの領域で<br className="md:hidden" />
          AIを社会に実装します。
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businessCards.map((card, index) => (
            <div
              key={card.title}
              className={`glass-card p-8 text-left transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + index * 120}ms` }}
            >
              {/* Tag */}
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-4 ${card.tagColor}`}>
                {card.tag}
              </span>
              
              {/* Category */}
              <p className="font-display font-light text-xs tracking-[0.15em] uppercase text-navy/40 mb-2">
                {card.category}
              </p>
              
              {/* Title */}
              <h3 className="font-bold text-navy text-lg mb-4">
                {card.title}
              </h3>
              
              {/* Description */}
              <p className="text-navy/70 text-sm leading-relaxed mb-6">
                {card.description}
              </p>

              {/* Link */}
              <Link 
                href="#" 
                className="inline-flex items-center gap-2 text-[#7dd8ca] text-sm font-medium group-hover:gap-3 transition-all"
              >
                詳しく見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
