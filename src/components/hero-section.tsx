"use client"

import Link from "next/link"
import { HeroVideoGL } from "@/components/hero-video-gl"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 流体動画 + WebGLカーソル効果 */}
      <HeroVideoGL src="/videos/hero-bg.mp4" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/40 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center pt-28 md:pt-40">
        <p className="animate-fade-in-up font-display font-light text-xs tracking-[0.2em] uppercase text-navy/50 mb-6">
          AI Company — Tokyo, Japan
        </p>

        <h1
          className="animate-fade-in-up-delay-1 text-navy leading-tight mb-8"
          style={{
            fontSize: "clamp(1.75rem, 5.5vw, 4.5rem)",
            letterSpacing: "-0.02em"
          }}
        >
          AIで、日本の<br />
          <span className="whitespace-nowrap"><span className="gradient-text">ビジネスインフラ</span>を変える。</span>
        </h1>

        <p className="animate-fade-in-up-delay-2 text-navy/70 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto mb-10 px-2 md:px-0">
          Allovvは、人工知能の力を事業の推進力に変えるAIカンパニーです。<br className="hidden md:block" />
          起業支援・AI導入・システム開発を通じて、あらゆる挑戦の障壁を取り除きます。
        </p>

        <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16">
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none">
        <svg className="w-6 h-6 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
