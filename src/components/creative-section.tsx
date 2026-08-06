"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const works = [
  {
    no: "01",
    en: "Animation",
    lead: "実写では撮れない画を、動きごと設計する。",
    tags: ["SNS広告", "ブランドムービー"],
    src: "/videos/creative-animation.mp4",
    poster: "/videos/creative-animation-poster.jpg",
  },
  {
    no: "02",
    en: "Fantasy",
    lead: "世界観の作り込みまで、まるごと映像に。",
    tags: ["コンセプト映像", "世界観PV"],
    src: "/videos/creative-fantasy.mp4",
    poster: "/videos/creative-fantasy-poster.jpg",
  },
  {
    no: "03",
    en: "Realism",
    lead: "撮影をせずに、実写と見分けのつかない画を。",
    tags: ["商品カット", "実写風CM"],
    src: "/videos/creative-real.mp4",
    poster: "/videos/creative-real-poster.jpg",
  },
]

export function CreativeSection() {
  const { ref: headRef, isVisible } = useScrollAnimation(0.2)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // ピン留め＋横スライドはデスクトップのみ。
  // 未判定（SSR・初回描画）は false ＝ タッチ向けの横スワイプ版で出す。
  const [pinned, setPinned] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)")
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setPinned(wide.matches && !calm.matches)
    sync()
    wide.addEventListener("change", sync)
    calm.addEventListener("change", sync)
    return () => {
      wide.removeEventListener("change", sync)
      calm.removeEventListener("change", sync)
    }
  }, [])

  // 縦スクロール量 → トラックの translateX。
  // ラッパーの高さは「横に動かしたい距離」から実測して決めるので、
  // 画面幅が変わってもスクロールと横移動の比が 1:1 に保たれる。
  useEffect(() => {
    if (!pinned) {
      if (trackRef.current) trackRef.current.style.transform = ""
      if (wrapperRef.current) wrapperRef.current.style.height = ""
      return
    }

    const wrapper = wrapperRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!wrapper || !viewport || !track) return

    let distance = 0
    let frame = 0

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - viewport.clientWidth)
      wrapper.style.height = `${window.innerHeight + distance}px`
    }

    const render = () => {
      frame = 0
      const top = wrapper.getBoundingClientRect().top
      const progress = distance > 0 ? Math.min(1, Math.max(0, -top / distance)) : 0
      track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`
      setActive(Math.min(works.length - 1, Math.round(progress * (works.length - 1))))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(render)
    }

    measure()
    render()

    const observer = new ResizeObserver(() => {
      measure()
      render()
    })
    observer.observe(track)
    observer.observe(viewport)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measure)
    }
  }, [pinned])

  // 画面に入っている1本だけ再生する（3本同時再生を避ける）
  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[]
    if (videos.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting) video.play().catch(() => {})
          else video.pause()
        }
      },
      { root: viewportRef.current, threshold: 0.55 }
    )
    videos.forEach((video) => observer.observe(video))

    const onVisibility = () => {
      if (document.hidden) videos.forEach((video) => video.pause())
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [pinned])

  // 横スワイプ版のときは、実スクロール位置から現在地を出す
  const onViewportScroll = useCallback(() => {
    if (pinned) return
    const viewport = viewportRef.current
    if (!viewport) return
    const max = viewport.scrollWidth - viewport.clientWidth
    const progress = max > 0 ? viewport.scrollLeft / max : 0
    setActive(Math.min(works.length - 1, Math.round(progress * (works.length - 1))))
  }, [pinned])

  return (
    <section id="creative" className="bg-soft-bg">
      {/* ── 見出し ── */}
      <div
        ref={headRef}
        className="max-w-[1180px] mx-auto px-5 pt-28 md:pt-36 pb-10 md:pb-14 text-center"
      >
        <p
          className={`font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          CREATIVE
        </p>
        {/* 短い一文なので、字間を少し開けて見出しとしての重心を持たせる */}
        <h2
          className={`text-navy font-bold leading-tight tracking-[0.04em] transition-all duration-600 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)" }}
        >
          想像を映像に
        </h2>
      </div>

      {/* ── 横スライド ── */}
      <div ref={wrapperRef} className="relative">
        {/* pt-16 は固定ナビの分。中央寄せのままだと上が詰まって見え、下に余白が余る */}
        <div className={pinned ? "sticky top-0 h-screen flex flex-col justify-center pt-16" : ""}>
          <div
            ref={viewportRef}
            onScroll={onViewportScroll}
            className={
              pinned
                ? "overflow-hidden"
                : "overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            }
          >
            <div
              ref={trackRef}
              className="flex items-stretch gap-5 md:gap-8 px-5 md:px-10 w-max"
              style={pinned ? { willChange: "transform" } : undefined}
            >
              {works.map((work, index) => (
                <figure
                  key={work.no}
                  className="snap-center shrink-0 w-[86vw] max-w-[980px] lg:w-auto"
                >
                  <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-navy-dark shadow-[0_24px_60px_-32px_rgba(26,46,53,0.55)]">
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el
                      }}
                      className="block aspect-video w-full lg:w-auto lg:h-[min(62svh,600px)] object-cover"
                      src={work.src}
                      poster={work.poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-label={`${work.en}の制作事例`}
                    />
                  </div>

                  <figcaption className="mt-5 flex items-start gap-4">
                    <span className="font-display font-light text-xs tracking-[0.15em] text-navy/35 pt-1 tabular-nums">
                      {work.no}
                    </span>
                    <div>
                      <p className="font-display font-light text-xs tracking-[0.15em] uppercase text-[#7dd8ca] mb-1.5">
                        {work.en}
                      </p>
                      <p className="text-navy font-bold text-base leading-snug">{work.lead}</p>
                      <p className="mt-2 text-navy/50 text-xs tracking-wide">
                        {work.tags.join(" ／ ")}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* 進行インジケーター */}
          <div className="flex items-center justify-center gap-2 mt-8 px-5" aria-hidden="true">
            {works.map((work, index) => (
              <span
                key={work.no}
                className="h-px rounded-full transition-all duration-500 ease-out"
                style={{
                  width: index === active ? 44 : 20,
                  background: index === active ? "#7dd8ca" : "rgba(26,46,53,0.18)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      {/* ピン留め中は sticky（h-screen）の下側に余白が残るので、その分だけ上を詰める */}
      <div
        className={`max-w-[1180px] mx-auto px-5 pb-20 md:pb-24 text-center ${pinned ? "" : "pt-14"}`}
      >
        <p className="text-navy/70 text-sm leading-relaxed mb-6">
          用途・尺・納期に合わせて構成からご提案します。まずはご相談ください。
        </p>
        <Link
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-medium text-white transition-transform duration-150 ease-out active:scale-[0.97] hover:-translate-y-0.5"
        >
          クリエイティブ制作を相談する
        </Link>
      </div>
    </section>
  )
}
