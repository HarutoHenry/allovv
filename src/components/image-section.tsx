"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function ImageSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div ref={ref} className="relative h-[480px] overflow-hidden">
      <video
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        src="/videos/image-section-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-white/20" />
    </div>
  )
}
