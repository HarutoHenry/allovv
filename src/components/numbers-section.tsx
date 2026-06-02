"use client"

import { useEffect, useState, useRef } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const stats = [
  { prefix: "最大", value: 90, suffix: "%", label: "返信工数削減" },
  { prefix: "最短", value: 3, suffix: "日", label: "導入期間" },
  { prefix: "", value: 24, suffix: "h", label: "AI対応時間" },
  { prefix: "", value: 2026, suffix: "", label: "創業" }
]

function useCountUp(end: number, duration: number = 1500, start: boolean = false) {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!start) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(startValue + (end - startValue) * easeOutQuart))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [end, duration, start])

  return count
}

function StatItem({ prefix, value, suffix, label, isVisible, delay }: {
  prefix: string
  value: number
  suffix: string
  label: string
  isVisible: boolean
  delay: number
}) {
  const count = useCountUp(value, 1500, isVisible)

  return (
    <div
      className={`text-center transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="font-display font-bold text-4xl md:text-5xl text-navy mb-2">
        {prefix && <span className="text-base font-medium text-navy/50 mr-0.5">{prefix}</span>}
        {count}{suffix}
      </p>
      <div className="w-8 h-0.5 mx-auto mb-3" style={{ background: "#4cbfa0" }} />
      <p className="text-navy/50 text-sm">{label}</p>
    </div>
  )
}

export function NumbersSection() {
  const { ref, isVisible } = useScrollAnimation(0.3)

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">

      {/* 背景動画 */}
      <div
        className="absolute inset-0"
        style={{
          transform: isVisible ? "scale(1)" : "scale(1.08)",
          transition: "transform 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/image-section-bg.mp4"
        />
      </div>

      {/* オーバーレイ */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(168,237,216,0.65) 0%, rgba(197,245,232,0.60) 100%)" }}
      />

      {/* コンテンツ */}
      <div ref={ref} className="relative z-10 max-w-[900px] mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              prefix={stat.prefix}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              isVisible={isVisible}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
