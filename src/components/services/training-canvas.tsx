"use client"

import { useEffect, useRef } from "react"

/**
 * ヒーローの帯。「社内の型づくり」を、5人（1社5名まで）の指示文が1つの型に揃っていく流れで見せる。
 *   5人がそれぞれの書き方で指示文を書く（行の長さも区切りもばらばら）→
 *   共通の「指示の型」の枠が現れ、書いた中身がその枠に揃う →
 *   揃った型が1枚の社内マニュアルに綴じられ、右の束に重なる。これを繰り返す。
 * カーソルのある端末では、書いている途中でもカーソルの周りだけ型の枠が透けて見える。
 * 場面の名前は HTML で下に並べる（読み上げ・検索に残すため）。絵そのものは飾りなので aria-hidden。
 */

const LABELS = ["指示文", "指示の型", "社内マニュアル"] as const

type Rgb = [number, number, number]

// 5人ぶん。左の点の色で、誰が書いた行かを見分ける
const LEARNERS: Rgb[] = [
  [125, 216, 202],
  [255, 179, 204],
  [255, 255, 255],
  [197, 245, 232],
  [255, 228, 239],
]
// 指示の型の枠（行の幅に対する割合）。どの行も同じ位置に揃う
const SLOTS: [number, number][] = [
  [0, 0.11],
  [0.14, 0.44],
  [0.47, 0.63],
  [0.66, 0.86],
]

// 1巡の時間割（秒）
const CYCLE = 10
const T_TEMPLATE = 4 // ここまでに書き終え、型の枠が現れはじめる
const T_SNAP = 4.9 // 書いた中身が枠に揃いはじめる
const T_FILE = 8 // 綴じはじめる
const FILE_DUR = 1.3
const STILL = 7 // 動きを減らす設定では、型に揃った場面で止める

const mix = (a: number, b: number, t: number) => a + (b - a) * t
function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]
}
const css = (c: Rgb, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`

const BG: Rgb = [15, 30, 36]
const MINT: Rgb = [125, 216, 202]
const INKED: Rgb = [196, 205, 207] // 書いたばかりの行
const FIELD: Rgb = mixRgb(BG, MINT, 0.55) // 型の枠に入った中身
const BAR: Rgb = mixRgb(MINT, BG, 0.6) // マニュアルの紙の上の行

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}
// 画面の上を動くものは、ゆっくり出てゆっくり止まる
const inOut = (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2)

// 巡ごとに違う書き方にする（同じ巡なら毎回同じ絵になる）
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

// x, w は行の幅に対する割合。t0〜t1 のあいだにその塊を書く
type Chunk = { x: number; w: number; t0: number; t1: number }
type Row = { chunks: Chunk[]; end: number }

function makeRows(cycle: number): Row[] {
  const rand = mulberry32(20260930 + cycle)
  return LEARNERS.map((_, r) => {
    const n = 3 + Math.floor(rand() * 4)
    const gap = 0.014
    const total = 0.5 + rand() * 0.42
    const weights = Array.from({ length: n }, () => 0.35 + rand())
    const sum = weights.reduce((a, b) => a + b, 0)
    const inner = total - gap * (n - 1)
    const pauses = weights.map(() => 0.15 + rand() * 0.5)
    const start = 0.2 + r * 0.16 + rand() * 0.3
    const end = 3.45 + rand() * 0.4
    // 書く時間は塊の長さに比例させ、塊のあいだで少し手を止める
    const units = 1 + pauses.slice(0, -1).reduce((a, b) => a + b * 0.25, 0)
    const scale = (end - start) / units
    const chunks: Chunk[] = []
    let x = 0
    let t = start
    weights.forEach((wt, i) => {
      const w = (inner * wt) / sum
      const dur = (wt / sum) * scale
      chunks.push({ x, w, t0: t, t1: t + dur })
      x += w + gap
      t += dur + (i < n - 1 ? pauses[i] * 0.25 * scale : 0)
    })
    return { chunks, end }
  })
}

export function TrainingCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let W = 0
    let H = 0
    let narrow = false
    // 紙（左）と、行の置き場所
    let sx = 0
    let sy = 0
    let sw = 0
    let sh = 0
    let rowsTop = 0
    let pitch = 0
    let dotX = 0
    let tx = 0
    let tw = 0
    let ch = 8
    // 綴じたマニュアルの束（右）
    let pw = 0
    let ph = 0
    let px = 0
    let py = 0
    // 5行ぶんのかたまり。綴じるときは、これを1枚の紙の大きさへ縮める
    let bx = 0
    let by = 0
    let bw = 0
    let bh = 0

    let clock = reduce ? STILL : 0
    let cycle = -1
    let rows: Row[] = []
    let phase = -1
    let raf = 0
    let last = 0
    let visible = true
    const pointer = { x: 0, y: 0, on: false }
    const spot = { x: 0, y: 0, a: 0 }

    const setLabels = (p: number) => {
      if (p === phase) return
      phase = p
      labelRefs.current.forEach((el, i) => {
        if (!el) return
        if (i === p) el.dataset.on = ""
        else delete el.dataset.on
      })
    }

    const build = () => {
      const rect = wrap.getBoundingClientRect()
      W = rect.width
      H = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      narrow = W < 640
      sx = 0.5
      sy = narrow ? 8.5 : 12.5
      sw = Math.round(W * (narrow ? 0.7 : 0.66))
      sh = Math.round(H - sy * 2)
      const padY = narrow ? 14 : 26
      rowsTop = sy + padY
      pitch = (sh - padY * 2) / 5
      dotX = sx + (narrow ? 14 : 24)
      tx = sx + (narrow ? 28 : 46)
      tw = sw - (tx - sx) - (narrow ? 14 : 30)
      ch = Math.max(6, Math.min(11, pitch * 0.26))

      pw = narrow ? 34 : Math.max(48, Math.min(80, W * 0.07))
      ph = pw * 1.32
      px = W * (narrow ? 0.86 : 0.84) - pw / 2 - 5
      py = H / 2 - ph / 2 - 6

      bx = tx - tw * 0.08
      bw = tw * 1.02
      by = rowsTop - pitch * 0.3
      bh = pitch * 5.6
    }

    const rowY = (r: number) => rowsTop + pitch * (r + 0.5)
    const slotX = (s: number) => tx + SLOTS[s][0] * tw
    const slotW = (s: number) => (SLOTS[s][1] - SLOTS[s][0]) * tw

    const pill = (x: number, y: number, w: number, h: number, c: Rgb, a = 1) => {
      if (w <= 0.3 || h <= 0.3) return
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, Math.min(h / 2, w / 2))
      ctx.fillStyle = css(c, a)
      ctx.fill()
    }

    // 綴じたマニュアルの1枚。行は型の枠と同じ位置に並ぶ
    const drawPage = (x: number, y: number, depth: number, a: number) => {
      if (a <= 0.001) return
      ctx.globalAlpha = a
      ctx.beginPath()
      ctx.roundRect(x, y, pw, ph, 3)
      ctx.fillStyle = css(mixRgb(MINT, BG, Math.min(depth * 0.2, 0.85)))
      ctx.fill()
      ctx.lineWidth = 1.5
      ctx.strokeStyle = css(BG)
      ctx.stroke()
      const k = ph / bh
      const hh = ch * k
      for (let r = 0; r < 5; r++) {
        const yy = y + (rowY(r) - by) * k - hh / 2
        for (let s = 0; s < 4; s++) {
          const xx = x + ((slotX(s) - bx) / bw) * pw
          pill(xx, yy, (slotW(s) / bw) * pw, hh, BAR)
        }
      }
      ctx.globalAlpha = 1
    }

    const render = () => {
      ctx.clearRect(0, 0, W, H)
      const c = Math.floor(clock / CYCLE)
      if (c !== cycle) {
        cycle = c
        rows = makeRows(reduce ? 0 : c)
      }
      const t = clock - c * CYCLE
      setLabels(t < T_TEMPLATE ? 0 : t < T_FILE ? 1 : 2)

      // 紙
      ctx.beginPath()
      ctx.roundRect(sx, sy, sw, sh, 12)
      ctx.fillStyle = "rgba(255,255,255,0.02)"
      ctx.fill()
      ctx.lineWidth = 1
      ctx.strokeStyle = "rgba(255,255,255,0.12)"
      ctx.stroke()

      const f = inOut(smooth(T_FILE, T_FILE + FILE_DUR, t))
      const filed = t >= T_FILE + FILE_DUR

      // 束。新しい1枚が届くあいだに、下の紙が1枚ぶん奥へずれ、いちばん奥の1枚が消える
      const shift = filed ? 0 : smooth(0.45, 1, f)
      for (let k = 3; k >= 0; k--) {
        const d = k + shift
        drawPage(px + d * 3, py + d * 4, d, 1 - smooth(3, 4, d))
      }

      // 書き手の点
      const dotR = narrow ? 2.5 : 3.5
      LEARNERS.forEach((col, r) => {
        ctx.beginPath()
        ctx.arc(dotX, rowY(r), dotR, 0, Math.PI * 2)
        ctx.fillStyle = css(col, 0.9)
        ctx.fill()
      })

      // 型の枠。書いている間はカーソルの周りだけ透けて見え、綴じはじめると消える
      const slotBase = (s: number) => smooth(T_TEMPLATE + s * 0.14, T_TEMPLATE + s * 0.14 + 0.32, t)
      const showSpot = spot.a > 0.01 && (t < T_SNAP || filed)
      const slotH = ch + 8
      ctx.setLineDash([3, 3])
      ctx.lineWidth = 1
      for (let r = 0; r < 5; r++) {
        const y = rowY(r) - slotH / 2
        for (let s = 0; s < 4; s++) {
          const x = slotX(s) - 4
          const w = slotW(s) + 8
          let a = filed ? 0 : slotBase(s) * 0.55 * (1 - smooth(0, 0.25, f))
          if (showSpot) {
            const dx = Math.max(x - spot.x, 0, spot.x - (x + w))
            const dy = Math.max(y - spot.y, 0, spot.y - (y + slotH))
            const v = Math.max(0, 1 - Math.hypot(dx, dy) / 130)
            a = Math.max(a, v * v * spot.a * 0.6)
          }
          if (a <= 0.01) continue
          ctx.beginPath()
          ctx.roundRect(x, y, w, slotH, slotH / 2)
          ctx.strokeStyle = css(MINT, a)
          ctx.stroke()
        }
      }
      ctx.setLineDash([])

      if (filed) return

      // 綴じるときの行き先。5行のかたまりを、少し持ち上げながら束のいちばん上の紙へ縮める
      const rx = mix(bx, px, f)
      const ry = mix(by, py, f) - Math.sin(Math.PI * f) * H * 0.06
      const rw = mix(bw, pw, f)
      const rh = mix(bh, ph, f)
      const mx = (x: number) => rx + ((x - bx) / bw) * rw
      const my = (y: number) => ry + ((y - by) / bh) * rh
      const kx = rw / bw
      const ky = rh / bh

      if (f > 0) {
        ctx.globalAlpha = smooth(0.08, 0.45, f)
        ctx.beginPath()
        ctx.roundRect(rx, ry, rw, rh, mix(12, 3, f))
        ctx.fillStyle = css(MINT)
        ctx.fill()
        ctx.lineWidth = 1.5
        ctx.strokeStyle = css(BG, f)
        ctx.stroke()
        ctx.globalAlpha = 1
      }
      const toBar = smooth(0.1, 0.5, f)
      const glyph = ch * 0.9 // 1文字ぶんの幅。書いている行は1文字ずつ伸びる

      rows.forEach((row, r) => {
        const n = row.chunks.length
        const cy = rowY(r)
        const filledSlots = new Set<number>()
        let caret = tx
        let busy = false
        row.chunks.forEach((chk, i) => {
          const s = Math.floor((i * 4) / n)
          filledSlots.add(s)
          const full = chk.w * tw
          let w = full
          if (t < chk.t1) {
            if (t <= chk.t0) return
            const p = (t - chk.t0) / (chk.t1 - chk.t0)
            w = Math.min(full, Math.ceil((p * full) / glyph) * glyph)
            busy = true
          }
          const x0 = tx + chk.x * tw
          caret = x0 + w
          const k = inOut(smooth(T_SNAP + s * 0.1 + r * 0.05, T_SNAP + s * 0.1 + r * 0.05 + 0.85, t))
          const x = mix(x0, slotX(s), k)
          const ww = mix(w, slotW(s), k)
          const col = mixRgb(mixRgb(INKED, s === 0 ? MINT : FIELD, k), BAR, toBar)
          pill(mx(x), my(cy - ch / 2), ww * kx, ch * ky, col)
        })
        // 書いた中身が足りない枠は、型のほうから埋まる
        for (let s = 0; s < 4; s++) {
          if (filledSlots.has(s)) continue
          const k = inOut(smooth(T_SNAP + s * 0.1 + r * 0.05, T_SNAP + s * 0.1 + r * 0.05 + 0.85, t))
          const col = mixRgb(FIELD, BAR, toBar)
          pill(mx(slotX(s)), my(cy - ch / 2), slotW(s) * k * kx, ch * ky, col)
        }

        // 書き手のカーソル。手を止めている間は点滅し、書き終えると消える
        const ca = 1 - smooth(T_TEMPLATE, T_TEMPLATE + 0.35, t)
        if (ca > 0.01) {
          const blink = busy || reduce ? 1 : (clock * 1.8) % 1 < 0.6 ? 1 : 0.15
          const hgt = ch + 8
          ctx.fillStyle = css(LEARNERS[r], ca * blink)
          ctx.fillRect(caret + 2, cy - hgt / 2, 1.5, hgt)
          ctx.fillRect(caret + 2, cy - hgt / 2 - 3, 5, 3)
        }
      })
    }

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now
      clock += dt
      const e = Math.min(1, dt * 14)
      spot.x += (pointer.x - spot.x) * e
      spot.y += (pointer.y - spot.y) * e
      spot.a += ((pointer.on ? 1 : 0) - spot.a) * Math.min(1, dt * 7)
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
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      // 入った瞬間は、光がその場から広がるようにする
      if (!pointer.on && spot.a < 0.05) {
        spot.x = pointer.x
        spot.y = pointer.y
      }
      pointer.on = true
    }
    const onLeave = () => {
      pointer.on = false
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
      <div ref={wrapRef} className="relative h-[190px] sm:h-[240px] md:h-[280px] lg:h-[300px]">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full" />
      </div>
      {/* 場面の名前。いまの場面だけ白くなり、左にミントの点が付く */}
      <ul className="mt-4 flex justify-center gap-5 md:gap-10 text-[13px] md:text-[14px] font-bold tracking-[0.04em]">
        {LABELS.map((name, i) => (
          <li
            key={name}
            ref={(el) => {
              labelRefs.current[i] = el
            }}
            data-on={i === 0 ? "" : undefined}
            className="svc-device"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}
