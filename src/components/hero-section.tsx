"use client"

import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient - Soft Pastel Mint to Pink */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #c5f5e8 0%, #e0f7f4 25%, #ffe4ef 75%, #fff0f5 100%)"
        }}
      />
      
      {/* Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="blob-1 absolute w-[600px] h-[600px] rounded-full -top-48 -left-24"
        />
        <div 
          className="blob-2 absolute w-[500px] h-[500px] rounded-full top-1/4 -right-32"
        />
        <div 
          className="blob-3 absolute w-[400px] h-[400px] rounded-full bottom-1/4 left-1/4"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center pt-40">
        {/* Sub heading */}
        <p className="animate-fade-in-up font-display font-light text-xs tracking-[0.2em] uppercase text-navy/50 mb-6">
          AI Company — Tokyo, Japan
        </p>

        {/* Main Heading */}
        <h1 
          className="animate-fade-in-up-delay-1 text-navy leading-tight mb-8"
          style={{
            fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)",
            letterSpacing: "-0.02em"
          }}
        >
          AIで、日本の<br />
          <span className="whitespace-nowrap"><span className="gradient-text">ビジネスインフラ</span>を変える。</span>
        </h1>

        {/* Sub copy */}
        <p className="animate-fade-in-up-delay-2 text-navy/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          Allovvは、人工知能の力を事業の推進力に変えるAIカンパニーです。<br className="hidden md:block" />
          起業支援・AI導入・システム開発を通じて、<br className="hidden md:block" />
          あらゆる挑戦の障壁を取り除きます。
        </p>

        {/* Buttons */}
        <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="#business"
            className="gradient-btn px-8 py-4 font-medium rounded-full transition-all inline-flex items-center justify-center gap-2"
          >
            事業内容を見る
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="animate-fade-in-up-delay-3 flex flex-wrap justify-center gap-6 md:gap-12">
          <div className="text-center">
            <p className="font-display font-bold text-2xl md:text-3xl text-navy">
              <span className="text-sm font-medium text-navy/50 mr-0.5">最大</span>90%
            </p>
            <p className="text-navy/50 text-sm">返信工数削減</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-navy/20" />
          <div className="text-center">
            <p className="font-display font-bold text-2xl md:text-3xl text-navy">
              <span className="text-sm font-medium text-navy/50 mr-0.5">最短</span>3日
            </p>
            <p className="text-navy/50 text-sm">導入期間</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-navy/20" />
          <div className="text-center">
            <p className="font-display font-bold text-2xl md:text-3xl text-navy">24h</p>
            <p className="text-navy/50 text-sm">AI対応時間</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
