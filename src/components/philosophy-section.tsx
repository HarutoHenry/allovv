"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const philosophyCards = [
  {
    title: "AI First",
    description: "すべてのソリューションにAIを前提として設計。人間の創造性とAIの効率性を最大限に引き出します。"
  },
  {
    title: "Zero Barrier",
    description: "専門知識がなくても、誰でもAIの恩恵を受けられる。複雑さを排除したシンプルな体験を提供します。"
  },
  {
    title: "Outcome Focus",
    description: "導入することが目的ではなく、成果を出すことが目的。結果にコミットしたサービスを提供します。"
  }
]

export function PhilosophySection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-20 md:py-36 bg-soft-bg">
      <div ref={ref} className="max-w-[900px] mx-auto px-5 text-center">
        {/* Section Label */}
        <p className={`font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-6 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          OUR PHILOSOPHY
        </p>

        {/* Quote */}
        <blockquote className={`text-navy text-xl md:text-4xl leading-relaxed mb-10 md:mb-16 transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-[#9fe8dc] text-4xl md:text-5xl leading-none">&ldquo;</span>
          <br />
          テクノロジーは、挑戦する<br className="hidden md:block" />
          すべての人のために存在する。
          <br />
          <span className="text-[#9fe8dc] text-4xl md:text-5xl leading-none">&rdquo;</span>
        </blockquote>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {philosophyCards.map((card, index) => (
            <div
              key={card.title}
              className={`glass-card p-6 md:p-8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + index * 120}ms` }}
            >
              <h3 className="font-display font-bold text-[#5fb8ab] text-lg mb-4">
                {card.title}
              </h3>
              <p className="text-navy/70 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
