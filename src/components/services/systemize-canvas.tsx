"use client"

import { useEffect, useRef } from "react"

/**
 * ヒーローの帯。「業務がAIの仕組みに整っていく」様子を、書類の束が3つの関門を通る流れで見せる。
 * 左端ではばらばらに漂っている書類が、
 *   1つ目の関門（業務設計）で列に並び、
 *   2つ目の関門（AI構築）でミントに色づいて中身が整い、
 *   3つ目の関門（標準化）で大きさと間隔が揃って、同じ歩調で右へ流れていく。
 * 関門の名前は HTML で重ねる（読み上げ・検索に残すため）。絵そのものは飾りなので aria-hidden。
 */

// 関門の位置（帯の幅に対する割合）。ラベルもこの値で置くので、絵と文字がずれない
const GATES = [0.29, 0.53, 0.77] as const

type Slip = {
  lane: number
  k: number
  dx: number
  dy: number
  rot: number
  ws: number
  hs: number
  ph: number
  lines: [number, number, number]
  ox: number
  oy: number
}

// 毎回同じ散らばり方にする（スクリーンショットや再描画で絵が変わらないように）
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}
const mix = (a: number, b: number, t: number) => a + (b - a) * t

export function SystemizeCanvas({ steps }: { steps: readonly string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let W = 0
    let H = 0
    let slips: Slip[] = []
    let lanes = 5
    let gap = 56
    let sw = 24
    let sh = 32
    let period = 0
    let bandTop = 0
    let bandH = 0
    const speed = 28
    let t = 18 // 最初の1枚目から、帯全体に書類が行き渡った状態で始める
    let raf = 0
    let last = 0
    let visible = true
    let pointer: { x: number; y: number } | null = null

    const build = () => {
      const rect = wrap.getBoundingClientRect()
      W = rect.width
      H = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const narrow = W < 640
      lanes = narrow ? 4 : 5
      gap = narrow ? 34 : Math.max(48, Math.min(62, W / 24))
      sw = narrow ? 15 : 22
      sh = narrow ? 20 : 29
      bandTop = H * 0.1
      bandH = H * 0.8
      const count = Math.ceil((W + gap * 3) / gap)
      period = count * gap

      const rand = mulberry32(20260930)
      slips = []
      for (let lane = 0; lane < lanes; lane++) {
        for (let k = 0; k < count; k++) {
          slips.push({
            lane,
            k,
            dx: (rand() - 0.5) * gap * 0.7,
            dy: (rand() - 0.5) * bandH * 0.95,
            rot: (rand() - 0.5) * 1.3,
            ws: 0.7 + rand() * 0.7,
            hs: 0.72 + rand() * 0.6,
            ph: rand() * Math.PI * 2,
            lines: [0.3 + rand() * 0.6, 0.25 + rand() * 0.65, 0.2 + rand() * 0.5],
            ox: 0,
            oy: 0,
          })
        }
      }
    }

    const laneY = (lane: number) => bandTop + ((lane + 0.5) * bandH) / lanes

    const drawGates = () => {
      for (const g of GATES) {
        const x = Math.round(g * W) + 0.5
        const grad = ctx.createLinearGradient(0, 0, 0, H)
        grad.addColorStop(0, "rgba(125,216,202,0)")
        grad.addColorStop(0.18, "rgba(125,216,202,0.34)")
        grad.addColorStop(0.82, "rgba(125,216,202,0.34)")
        grad.addColorStop(1, "rgba(125,216,202,0)")
        ctx.fillStyle = grad
        ctx.fillRect(x - 0.5, 0, 1, H)
        // 関門を通る瞬間が分かるよう、線の手前にだけ薄い光を敷く
        const halo = ctx.createLinearGradient(x - 26, 0, x + 26, 0)
        halo.addColorStop(0, "rgba(125,216,202,0)")
        halo.addColorStop(0.5, "rgba(125,216,202,0.06)")
        halo.addColorStop(1, "rgba(125,216,202,0)")
        ctx.fillStyle = halo
        ctx.fillRect(x - 26, bandTop - 8, 52, bandH + 16)
      }
      // 1つ目の関門から先にだけ、列のガイドを引く
      const g1 = GATES[0] * W
      ctx.fillStyle = "rgba(255,255,255,0.045)"
      for (let lane = 0; lane < lanes; lane++) {
        ctx.fillRect(g1, Math.round(laneY(lane)) + 0.5, W - g1, 1)
      }
    }

    const drawSlip = (s: Slip) => {
      const base = ((t * speed + s.k * gap) % period) - gap * 1.5
      const p0 = base / W
      const a1 = smooth(GATES[0] - 0.07, GATES[0] + 0.04, p0)
      const a2 = smooth(GATES[1] - 0.05, GATES[1] + 0.03, p0)
      const a3 = smooth(GATES[2] - 0.06, GATES[2] + 0.03, p0)
      const loose = 1 - a1

      const wob = reduce ? 0 : Math.sin(t * 0.9 + s.ph)
      const x = base + s.dx * (1 - a3) + s.ox * loose
      const y = laneY(s.lane) + (s.dy + wob * 9) * loose + s.oy * loose
      const p = x / W
      const edge = smooth(-0.02, 0.07, p) * (1 - smooth(0.93, 1.0, p))
      if (edge <= 0.001) return

      const w = sw * mix(s.ws, 1, a3)
      const h = sh * mix(s.hs, 1, a3)
      const rot = (s.rot + wob * 0.1) * loose

      // 色：白い線（散らばった書類）→ ミントの線（AIが下書きを用意）→ ミントの面（揃った書類）
      const tail = smooth(GATES[2], 1, p)
      const fr = mix(125, mix(159, 255, 0.5), tail * a3)
      const fg = mix(216, mix(232, 214, 0.5), tail * a3)
      const fb = mix(202, mix(220, 231, 0.5), tail * a3)
      const sr = mix(255, fr, a2)
      const sg = mix(255, fg, a2)
      const sb = mix(255, fb, a2)
      const strokeA = mix(0.3, 0.85, a2) * mix(1, 0, a3 * 0.6)
      const fillA = mix(0.025, mix(0.1, 0.92, a3), a2)

      ctx.save()
      ctx.globalAlpha = edge
      ctx.translate(x, y)
      if (rot) ctx.rotate(rot)
      ctx.beginPath()
      if (ctx.roundRect) ctx.roundRect(-w / 2, -h / 2, w, h, 2.5)
      else ctx.rect(-w / 2, -h / 2, w, h)
      ctx.fillStyle = `rgba(${fr | 0},${fg | 0},${fb | 0},${fillA})`
      ctx.fill()
      ctx.strokeStyle = `rgba(${sr | 0},${sg | 0},${sb | 0},${strokeA})`
      ctx.lineWidth = 1
      ctx.stroke()

      // 中の行。散らばっている間は長さがばらばら、AI構築のあとは揃った長さになる
      const tidy = [0.7, 0.54, 0.62]
      const inner = w - 7
      const lineA = mix(0.3, 0.7, a2)
      const lr = mix(sr, 15, a3)
      const lg = mix(sg, 30, a3)
      const lb = mix(sb, 36, a3)
      ctx.fillStyle = `rgba(${lr | 0},${lg | 0},${lb | 0},${mix(lineA, 0.55, a3)})`
      const rows = h < 24 ? 2 : 3
      for (let i = 0; i < rows; i++) {
        const len = inner * mix(s.lines[i], tidy[i], a2)
        const ly = -h / 2 + 6 + i * ((h - 10) / rows)
        ctx.fillRect(-w / 2 + 3.5, ly, len, 1.2)
      }
      ctx.restore()
    }

    const render = () => {
      ctx.clearRect(0, 0, W, H)
      drawGates()
      for (const s of slips) drawSlip(s)
    }

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now
      t += dt
      // カーソルの近くにある、まだ散らばっている書類だけを少し押しのける
      for (const s of slips) {
        let tx = 0
        let ty = 0
        if (pointer) {
          const base = ((t * speed + s.k * gap) % period) - gap * 1.5
          const cx = base + s.dx
          const cy = laneY(s.lane) + s.dy
          const ddx = cx - pointer.x
          const ddy = cy - pointer.y
          const d = Math.hypot(ddx, ddy)
          if (d < 110 && d > 0.01) {
            const f = (1 - d / 110) * 26
            tx = (ddx / d) * f
            ty = (ddy / d) * f
          }
        }
        s.ox += (tx - s.ox) * 0.08
        s.oy += (ty - s.oy) * 0.08
      }
      render()
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (reduce || raf || !visible || document.hidden) return
      last = 0
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    build()
    render()

    const ro = new ResizeObserver(() => {
      build()
      render()
    })
    ro.observe(wrap)

    // 画面の外にある間と、タブが裏にある間は止める
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(wrap)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVisibility)

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onLeave = () => {
      pointer = null
    }
    if (fine && !reduce) {
      wrap.addEventListener("pointermove", onMove)
      wrap.addEventListener("pointerleave", onLeave)
    }

    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      wrap.removeEventListener("pointermove", onMove)
      wrap.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <div className="relative">
      {/* 関門の名前。絵の関門と同じ位置に置き、あいだに進む向きの矢印を挟む */}
      <ol className="relative h-7 md:h-8 text-white text-[13px] md:text-[15px] font-bold tracking-[0.04em]">
        {steps.map((step, i) => (
          <li
            key={step}
            className="absolute top-0 -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${GATES[i] * 100}%` }}
          >
            {step}
          </li>
        ))}
        {GATES.slice(1).map((g, i) => (
          <li
            key={g}
            aria-hidden="true"
            className="absolute top-0 -translate-x-1/2 text-[#7dd8ca]/70 font-normal"
            style={{ left: `${((GATES[i] + g) / 2) * 100}%` }}
          >
            →
          </li>
        ))}
      </ol>
      <div ref={wrapRef} className="relative h-[190px] sm:h-[240px] md:h-[280px] lg:h-[300px]">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  )
}
