"use client"

import { useEffect, useState, useRef } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const stats = [
  { value: 500, suffix: "+", label: "支援実績" },
  { value: 94, suffix: "%", label: "AI導入成功率" },
  { value: 67, suffix: "%", label: "コスト削減率" },
  { value: 2026, suffix: "", label: "創業" }
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

function StatItem({ value, suffix, label, isVisible, delay }: { 
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
    <section className="py-28 md:py-36" style={{ background: "linear-gradient(135deg, #a8edd8 0%, #c5f5e8 100%)" }}>
      <div ref={ref} className="max-w-[900px] mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
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
