"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const philosophyCards = [
  {
    en: "Give AI",
    title: "AIを与える",
    description: "専門知識は不要。最先端のAIを、すぐに、誰の手にも届ける。それがAllovvのスタートラインです。"
  },
  {
    en: "Give Time",
    title: "時間を与える",
    description: "繰り返しの作業をAIに任せ、人にしかできないことへの時間を取り戻す。AIは最高の贈り物です。"
  },
  {
    en: "Give Possibility",
    title: "可能性を与える",
    description: "AIが新たな扉を開く。これまで諦めていた挑戦が、今日から現実になります。"
  }
]

export function PhilosophySection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-28 md:py-36 bg-soft-bg">
      <div ref={ref} className="max-w-[900px] mx-auto px-5 text-center">

        {/* Section Label */}
        <p className={`font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-6 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          OUR PHILOSOPHY
        </p>

        {/* Philosophy */}
        <div className={`mb-16 transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-display font-light text-sm tracking-[0.08em] text-[#7dd8ca] mb-5">
            Allow gives you AI, gives you time, gives you possibility.
          </p>
          <h2
            className="text-navy font-bold leading-snug"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)" }}
          >
            AIを与える。時間を与える。<br />
            可能性を与える。それがAllovvだ。
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {philosophyCards.map((card, index) => (
            <div
              key={card.title}
              className={`glass-card p-8 text-left transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + index * 120}ms` }}
            >
              <p className="font-display font-light text-xs tracking-[0.15em] uppercase text-[#7dd8ca] mb-2">
                {card.en}
              </p>
              <h3 className="font-bold text-navy text-lg mb-4">
                {card.title}
              </h3>
              <p className="text-navy/70 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Vision */}
        <div className={`transition-all duration-600 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5">
            OUR VISION
          </p>
          <p className="font-display font-light text-navy/50 text-sm tracking-wide mb-4 italic">
            &ldquo;We believe AI should give everyone the time and possibility<br className="hidden md:block" />
            to live the life they truly want.&rdquo;
          </p>
          <p
            className="text-navy leading-relaxed"
            style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
          >
            AIが与える時間と可能性で、<br />
            誰もが本当に生きたい人生を選べる世界へ。
          </p>
        </div>

      </div>
    </section>
  )
}
