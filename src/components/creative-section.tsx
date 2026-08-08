"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useVideoAutoplay } from "@/hooks/use-video-autoplay"
import { ParticleHeading } from "@/components/particle-heading"

/** 見出しと中身の間隔。他セクションの mb-16 に合わせる */
const HEAD_GAP = 64

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
  const bgRef = useVideoAutoplay()

  const sectionRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  // 再生状態を今の見え方に合わせ直す関数。横スワイプ版のスクロールは window まで
  // 上がってこないので、そちらからも呼べるよう ref 越しに公開しておく。
  const syncPlaybackRef = useRef<() => void>(() => {})

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
      if (wrapperRef.current) {
        wrapperRef.current.style.height = ""
        wrapperRef.current.style.marginTop = ""
      }
      return
    }

    const wrapper = wrapperRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    const sticky = stickyRef.current
    if (!wrapper || !viewport || !track || !sticky) return

    let distance = 0
    let frame = 0

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - viewport.clientWidth)
      wrapper.style.height = `${window.innerHeight + distance}px`

      // ピン留め中は中身が画面の中央に来るので、ピン留め前の1枚目は
      // 「sticky の上端から余白ぶん下」に置かれ、見出しとの間が開きすぎる。
      // その余りだけラッパーを引き上げて、他セクション（mb-16）と同じ間隔にする。
      // sticky 内での位置は動かさないので、ピン留め中の見え方は変わらない。
      wrapper.style.marginTop = "0px"
      const offset =
        viewport.getBoundingClientRect().top - sticky.getBoundingClientRect().top
      wrapper.style.marginTop = `${Math.min(0, Math.round(HEAD_GAP - offset))}px`
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

  // 見えている動画だけを再生し続ける。
  //
  // play() は「まだデータが無い」「省電力モード」「タブが裏」などで簡単に拒否され、
  // 一度こぼすとポスター画像のまま固まってしまう。なので再生状態は持たず、
  // 「今どう見えているか」から毎回あるべき状態を出し直して合わせる方式にしてある。
  // 合わせ直すきっかけ: スクロール・タブ復帰・読み込み完了・勝手に止まった時・読み込み失敗。
  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[]
    const section = sectionRef.current
    if (videos.length === 0 || !section) return

    /** 再生させたい動画。出入りの境目でパタつかないよう、入り 0.4 / 抜け 0.2 とずらす */
    const wanted = new Set<HTMLVideoElement>()
    /** 勝手に止まった時の再開までの待ち。粘りすぎないよう倍にしていく */
    const backoff = new WeakMap<HTMLVideoElement, number>()
    /** 読み込み失敗の再試行回数 */
    const retries = new WeakMap<HTMLVideoElement, number>()
    const timers = new Set<number>()
    let frame = 0

    // 「見えているか」は毎回その場で測る。IntersectionObserver の通知待ちにすると、
    // 通知が来ないまま（タブが凍っている等）ポスターで固まることがあるため。
    const sync = () => {
      const viewport = viewportRef.current
      if (!viewport) return
      const box = viewport.getBoundingClientRect()
      const area = section.getBoundingClientRect()
      const margin = window.innerHeight * 0.1
      // セクションごと画面の外なら全部止める（見えない動画を回さない）
      const near = area.bottom > -margin && area.top < window.innerHeight + margin

      for (const video of videos) {
        const rect = video.getBoundingClientRect()
        const overlap =
          Math.min(rect.right, box.right) - Math.max(rect.left, box.left)
        const seen = rect.width > 0 ? overlap / rect.width : 0
        const enough = wanted.has(video) ? seen > 0.2 : seen > 0.4

        if (near && !document.hidden && enough) {
          wanted.add(video)
          if (video.paused) video.play().catch(() => {})
        } else {
          wanted.delete(video)
          if (!video.paused) video.pause()
        }
      }
    }
    syncPlaybackRef.current = sync

    const later = (wait: number, run: () => void) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer)
        run()
      }, wait)
      timers.add(timer)
    }

    // こちらが止めたのでなければ、端末側の都合で落ちている。間隔を空けて掛け直す
    const onPause = (event: Event) => {
      const video = event.currentTarget as HTMLVideoElement
      if (!wanted.has(video)) return
      const wait = backoff.get(video) ?? 300
      backoff.set(video, Math.min(5000, wait * 2))
      later(wait, sync)
    }
    // ちゃんと進んでいるなら、次に止まった時はまた短い間隔から試す
    const onProgress = (event: Event) => backoff.delete(event.currentTarget as HTMLVideoElement)

    // 読み込みに失敗したまま静止画で固まるのを防ぐ。無限に叩かないよう2回まで
    const onError = (event: Event) => {
      const video = event.currentTarget as HTMLVideoElement
      const count = retries.get(video) ?? 0
      if (count >= 2) return
      retries.set(video, count + 1)
      later(500 * (count + 1), () => {
        video.load()
        sync()
      })
    }

    for (const video of videos) {
      video.addEventListener("canplay", sync)
      video.addEventListener("loadeddata", sync)
      video.addEventListener("pause", onPause)
      video.addEventListener("timeupdate", onProgress)
      video.addEventListener("error", onError)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        sync()
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    document.addEventListener("visibilitychange", sync)
    // iOS Safari は最初のタップまで再生を渋ることがある
    document.addEventListener("touchstart", sync, { passive: true })

    sync()

    return () => {
      syncPlaybackRef.current = () => {}
      for (const video of videos) {
        video.removeEventListener("canplay", sync)
        video.removeEventListener("loadeddata", sync)
        video.removeEventListener("pause", onPause)
        video.removeEventListener("timeupdate", onProgress)
        video.removeEventListener("error", onError)
      }
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      document.removeEventListener("visibilitychange", sync)
      document.removeEventListener("touchstart", sync)
      timers.forEach((timer) => window.clearTimeout(timer))
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
    syncPlaybackRef.current()
  }, [pinned])

  return (
    <section ref={sectionRef} id="creative" className="relative bg-soft-bg">
      {/* ── 背景動画 ──
          セクションが画面より遥かに高いので、sticky で画面サイズに留めて引き伸ばしを防ぐ。
          section 側に overflow-hidden は付けない（中の横スクロールの sticky が効かなくなる） */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <video
            ref={bgRef}
            className="w-full h-full object-cover"
            src="/videos/creative-bg.mp4"
            poster="/videos/creative-bg-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
          {/* 素材自体が淡いので白は薄めに。上下だけ強めて、見出しと CTA の文字を読ませる */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(248,252,251,0.92) 0%, rgba(248,252,251,0.46) 9%, rgba(248,252,251,0.34) 45%, rgba(248,252,251,0.44) 78%, rgba(248,252,251,0.96) 100%)",
            }}
          />
        </div>
      </div>

      {/* ── 見出し ── */}
      <div
        ref={headRef}
        className="relative z-10 max-w-[1180px] mx-auto px-5 pt-20 md:pt-24 text-center"
      >
        <p
          className={`font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          CREATIVE
        </p>
        {/* 短い一文なので、字間を少し開けて見出しとしての重心を持たせる。
            登場はドットが集まって文字になる演出（スクロールを戻すと散る） */}
        <ParticleHeading
          text="―想像を映像に―"
          className="text-navy font-bold leading-tight tracking-[0.04em]"
          style={{ fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)" }}
        />
      </div>

      {/* ── 横スライド ── */}
      <div ref={wrapperRef} className={`relative z-10 ${pinned ? "" : "pt-16"}`}>
        {/* pt-16 は固定ナビの分。中央寄せのままだと上が詰まって見え、下に余白が余る */}
        <div
          ref={stickyRef}
          className={pinned ? "sticky top-0 h-screen flex flex-col justify-center pt-16" : ""}
        >
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
                  {/* preload: none だと再生の合図が来てから読み始めるので出だしを落としやすい。
                      1枚目だけ auto にして、セクションに着いた時点で待たせずに動かす */}
                  <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-navy-dark shadow-[0_24px_60px_-32px_rgba(26,46,53,0.55)]">
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el
                      }}
                      className="block aspect-video w-full lg:w-auto lg:h-[min(66svh,640px)] object-cover"
                      src={work.src}
                      poster={work.poster}
                      muted
                      loop
                      playsInline
                      preload={index === 0 ? "auto" : "metadata"}
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
        className={`relative z-10 max-w-[1180px] mx-auto px-5 pb-20 md:pb-24 text-center ${pinned ? "" : "pt-14"}`}
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
