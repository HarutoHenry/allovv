"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function ImageSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    /* IMAGE_SECTION: ここに画像を挿入 */
    <section className="relative h-[480px] overflow-hidden">
      <div 
        ref={ref}
        className={`absolute inset-0 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: "linear-gradient(135deg, #fce4ec 0%, #ede7f6 50%, #e8eaf6 100%)"
        }}
      />
      {/* 
        画像挿入後の構造例:
        <img src="/images/hero-image.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/40" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h2 className="text-white text-4xl font-bold">オーバーレイテキスト</h2>
        </div>
      */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-navy/30 text-sm font-display tracking-wider">
          /* IMAGE_PLACEHOLDER */
        </p>
      </div>
    </section>
  )
}
