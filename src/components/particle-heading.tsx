"use client"

import { useEffect, useRef } from "react"

type Particle = {
  /** 散らばっている時の位置 */
  sx: number
  sy: number
  /** 文字を形づくる位置 */
  tx: number
  ty: number
  r: number
  a: number
  /** 到着のばらつき（0〜STAGGER） */
  d: number
  /** 着地の行き過ぎ量。粒ごとに変えて機械的に見せない */
  s: number
}

/** 粒の到着タイミングのばらつき幅 */
const STAGGER = 0.34
/** ここまでで文字が組み上がり、以降は本物のテキストへの入れ替えに使う */
const FORM_END = 0.84
/** 粒1つぶんの移動に割り当てる進捗の長さ */
const SPAN = FORM_END - STAGGER
/** 移動が終わってバウンスに入るタイミング（粒の進捗 t） */
const ARRIVE = 0.72
/** キャンバスが文字の上下に確保する余白 */
const PAD_Y = 56
const MAX_PARTICLES = 2600

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** 0→1 の間で滑らかに立ち上げる */
const smoothstep = (from: number, to: number, v: number) => {
  const t = clamp01((v - from) / (to - from))
  return t * t * (3 - 2 * t)
}

// 移動そのものは smoothstep で進捗に素直に対応させ（スクロール量＝移動量に見える）、
// 着地したあとだけ行き過ぎ→戻りの揺れを足す。
// ease-out 系の曲線を全域に使うと t=0.5 で到着してしまい、動きが見えないため。
const settle = (t: number, s: number) => {
  if (t >= 1) return 1
  if (t < ARRIVE) {
    const u = t / ARRIVE
    return u * u * (3 - 2 * u)
  }
  const k = (t - ARRIVE) / (1 - ARRIVE)
  return 1 + s * Math.sin(k * Math.PI * 1.5) * (1 - k)
}

export function ParticleHeading({
  text,
  className,
  style,
}: {
  text: string
  className?: string
  style?: React.CSSProperties
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const heading = textRef.current
    const canvas = canvasRef.current
    if (!wrap || !heading || !canvas) return

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (calm.matches) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: Particle[] = []
    let dpr = 1
    let width = 0
    let height = 0
    let frame = 0
    let visible = false
    let rendered = -1
    let disposed = false

    // 文字を一度オフスクリーンに描いて、その塗りつぶし画素を粒の目標地点にする。
    // フォント指定は実際の h2 から読むので、見た目とズレない。
    const build = () => {
      const cs = getComputedStyle(heading)
      const box = heading.getBoundingClientRect()
      width = wrap.clientWidth
      height = box.height + PAD_Y * 2
      if (width < 40 || box.height < 10) return

      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      // canvas.width への代入でコンテキストの状態が初期化されるので、この順で設定する
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = cs.color

      const off = document.createElement("canvas")
      off.width = canvas.width
      off.height = canvas.height
      const octx = off.getContext("2d", { willReadFrequently: true })
      if (!octx) return
      octx.setTransform(dpr, 0, 0, dpr, 0, 0)
      octx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      if ("letterSpacing" in octx) octx.letterSpacing = cs.letterSpacing
      octx.textAlign = "center"
      octx.textBaseline = "middle"
      octx.fillStyle = "#000"
      octx.fillText(text, width / 2, height / 2)

      const metrics = octx.measureText(text)
      const textW = Math.min(width, metrics.width)
      const textH = box.height

      const image = octx.getImageData(0, 0, off.width, off.height).data
      const step = Math.max(2, Math.round((width < 640 ? 3.4 : 2.8) * dpr))
      const jitter = step / dpr / 2

      const found: Particle[] = []
      const bandW = Math.min(width, textW * 2.6)
      const bandH = textH * 2
      const cx = width / 2
      const cy = height / 2

      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (image[(y * off.width + x) * 4 + 3] < 140) continue
          const tx = x / dpr + (Math.random() - 0.5) * jitter
          const ty = y / dpr + (Math.random() - 0.5) * jitter
          // 散らばりは横に広い帯。完全なランダムだと散り方が均一に見えるので、
          // 目標地点の位置を少しだけ引き継がせる。
          const bx = cx + (Math.random() - 0.5) * bandW
          const by = cy + (Math.random() - 0.5) * bandH
          found.push({
            sx: bx + (tx - bx) * 0.3,
            sy: by + (ty - by) * 0.3,
            tx,
            ty,
            r: 0.55 + Math.random() * 0.85,
            a: 0.45 + Math.random() * 0.5,
            d: Math.random() * STAGGER,
            s: 0.05 + Math.random() * 0.06,
          })
        }
      }

      if (found.length > MAX_PARTICLES) {
        const keep = MAX_PARTICLES / found.length
        particles = found.filter(() => Math.random() < keep)
      } else {
        particles = found
      }
      rendered = -1
    }

    const progress = () => {
      const r = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.92
      const end = vh * 0.42
      return clamp01((start - r.top) / (start - end))
    }

    const draw = (p: number) => {
      ctx.clearRect(0, 0, width, height)

      // 粒が出来上がったら本物のテキストに入れ替える（粒のままだとザラつくため）
      const solid = smoothstep(FORM_END, 1, p)
      heading.style.opacity = `${solid}`
      canvas.style.opacity = `${1 - smoothstep(FORM_END + 0.04, 1, p)}`
      if (solid >= 1) return

      for (let i = 0; i < particles.length; i++) {
        const q = particles[i]
        const t = clamp01((p - q.d) / SPAN)
        if (t <= 0) continue
        const e = settle(t, q.s)
        const x = q.sx + (q.tx - q.sx) * e
        const y = q.sy + (q.ty - q.sy) * e
        ctx.globalAlpha = q.a * clamp01(t * 1.7)
        ctx.beginPath()
        ctx.arc(x, y, q.r * (0.7 + 0.3 * t), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const tick = () => {
      frame = 0
      if (disposed || particles.length === 0) return
      const p = progress()
      if (p !== rendered) {
        rendered = p
        draw(p)
      }
      if (visible) frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (frame || disposed) return
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
      },
      { rootMargin: "20% 0px" }
    )
    observer.observe(wrap)

    let resizeTimer = 0
    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        build()
        start()
      }, 120)
    })

    const init = () => {
      if (disposed) return
      build()
      resizeObserver.observe(wrap)
      start()
    }

    if (document.fonts?.status === "loaded") init()
    else document.fonts?.ready.then(init) ?? init()

    return () => {
      disposed = true
      if (frame) cancelAnimationFrame(frame)
      window.clearTimeout(resizeTimer)
      observer.disconnect()
      resizeObserver.disconnect()
      heading.style.opacity = ""
    }
  }, [text])

  return (
    <div ref={wrapRef} className="relative">
      <h2 ref={textRef} className={className} style={style}>
        {text}
      </h2>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 w-full"
        style={{ top: -PAD_Y }}
      />
    </div>
  )
}
