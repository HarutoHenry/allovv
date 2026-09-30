"use client"

import { useEffect, useRef } from "react"

/**
 * ヒーローの帯。「パソコン・スマホ・タブレットのどれで見ても崩れない」を、1枚のページの枠が
 * パソコン → タブレット → スマホの幅へ縮み、そのたびに中身が組み替わる様子で見せる。
 * 中身は枠の幅にぴったり付いてきて、幅の区切りをまたいだ時だけ、各部品が新しい位置へすべり込む。
 * すべり込みは部品ごとのばね（上の部品ほど早く落ち着く）なので、途中で引き返しても今いる位置から戻る。
 * PC ではカーソルで枠の左右の端をつかんで、自分で幅を変えられる。
 * 絵は飾りなので aria-hidden。下の端末名は HTML で置く（読み上げ・検索に残すため）
 */

type Mode = 0 | 1 | 2 // 0: パソコン / 1: タブレット / 2: スマホ
type Box = { x: number; y: number; w: number; h: number; a: number }
type Layout = Record<string, Box>
type Style = "ink" | "text" | "soft" | "mint" | "pastel" | "image" | "card"

const DEVICES = ["パソコン", "タブレット", "スマホ"] as const
const KEYS = ["x", "y", "w", "h", "a"] as const
const RADII = [10, 12, 20] as const
const PHONE_MIN = 132
const HOLD = 2600
const MOVE = 1400
const RULER = 34

// 描く順（上から下）。上の部品ほどばねを硬くして、上から組み替わっていくように見せる
const ITEMS: [string, Style][] = [
  ["logo", "mint"],
  ["brand", "text"],
  ["m0", "soft"],
  ["m1", "soft"],
  ["m2", "soft"],
  ["m3", "soft"],
  ["navBtn", "pastel"],
  ["g0", "text"],
  ["g1", "text"],
  ["g2", "text"],
  ["h0", "ink"],
  ["h1", "ink"],
  ["h2", "ink"],
  ["b0", "soft"],
  ["b1", "soft"],
  ["b2", "soft"],
  ["heroBtn", "pastel"],
  ["img", "image"],
  ["c0", "card"],
  ["ci0", "mint"],
  ["cl0", "text"],
  ["cm0", "soft"],
  ["c1", "card"],
  ["ci1", "mint"],
  ["cl1", "text"],
  ["cm1", "soft"],
  ["c2", "card"],
  ["ci2", "mint"],
  ["cl2", "text"],
  ["cm2", "soft"],
  ["f0", "soft"],
  ["f1", "soft"],
]

// ばねの硬さ（1秒あたり）。臨界減衰なので行き過ぎずに止まる
const omega = (i: number) => 12 - i * 0.16

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const mix = (a: number, b: number, t: number) => a + (b - a) * t
// 画面の中で形が変わる動きなので、ゆっくり出てゆっくり止まる
const inOut = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2)

/** ある組み方・ある枠の幅での、各部品の位置（枠の左上が原点・ヘッダーの下からがページの中身） */
function layout(mode: Mode, fw: number, u: number) {
  const L: Layout = {}
  const put = (id: string, x: number, y: number, w: number, h: number, a = 1) => {
    L[id] = { x, y, w, h, a }
  }
  const phone = mode === 2
  const pad = (phone ? 14 : mode === 1 ? 22 : 28) * u
  const cw = fw - pad * 2
  const right = pad + cw
  const y = (phone ? 16 : 22) * u

  // ナビ。PC とタブレットはメニューを右から並べ、入りきらない項目は薄れて消える。スマホは三本線にたたむ
  put("logo", pad, y, 14 * u, 14 * u)
  put("brand", pad + 20 * u, y + 4 * u, 44 * u, 6 * u)
  const brandEnd = pad + 76 * u
  const burgX = right - 16 * u
  const mw = [32, 38, 30, 34]
  if (!phone) {
    const bw = 62 * u
    put("navBtn", right - bw, y - 3 * u, bw, 20 * u)
    let x = right - bw - 18 * u
    for (let i = 0; i < 4; i++) {
      const w = mw[i] * u
      x -= w
      put(`m${i}`, x, y + 4 * u, w, 6 * u, clamp01((x - brandEnd) / (14 * u)))
      x -= 16 * u
    }
    for (let i = 0; i < 3; i++) put(`g${i}`, burgX, y + (2 + i * 5) * u, 16 * u, 2 * u, 0)
  } else {
    put("navBtn", burgX, y, 16 * u, 14 * u, 0)
    for (let i = 0; i < 4; i++) put(`m${i}`, burgX, y + 4 * u, 16 * u, 6 * u, 0)
    for (let i = 0; i < 3; i++) put(`g${i}`, burgX, y + (2 + i * 5) * u, 16 * u, 2 * u, 1)
  }
  const top = y + 14 * u + (phone ? 24 : 36) * u

  // ヒーロー。PC は文と写真を横に、タブレットは文の下に写真、スマホは見出しが3行になって全部縦に
  let heroBottom: number
  if (mode === 0) {
    const colW = cw * 0.46
    const imgH = 170 * u
    let ty = top + 10 * u
    put("h0", pad, ty, colW * 0.96, 13 * u)
    put("h1", pad, ty + 21 * u, colW * 0.74, 13 * u)
    put("h2", pad + colW * 0.74, ty + 21 * u, 0, 13 * u, 0)
    ty += 21 * u + 13 * u + 18 * u
    const bl = [0.94, 0.88, 0.58]
    for (let i = 0; i < 3; i++) put(`b${i}`, pad, ty + i * 11 * u, colW * bl[i], 5 * u)
    ty += 2 * 11 * u + 5 * u + 20 * u
    put("heroBtn", pad, ty, 80 * u, 22 * u)
    put("img", pad + cw * 0.52, top, cw * 0.48, imgH)
    heroBottom = Math.max(top + imgH, ty + 22 * u)
  } else if (mode === 1) {
    const tw = Math.min(cw, 440 * u)
    let ty = top
    put("h0", pad, ty, tw * 0.92, 13 * u)
    put("h1", pad, ty + 21 * u, tw * 0.66, 13 * u)
    put("h2", pad + tw * 0.66, ty + 21 * u, 0, 13 * u, 0)
    ty += 21 * u + 13 * u + 18 * u
    const bl = [0.96, 0.9, 0.6]
    for (let i = 0; i < 3; i++) put(`b${i}`, pad, ty + i * 11 * u, tw * bl[i], 5 * u)
    ty += 2 * 11 * u + 5 * u + 20 * u
    put("heroBtn", pad, ty, 80 * u, 22 * u)
    ty += 22 * u + 24 * u
    put("img", pad, ty, cw, 120 * u)
    heroBottom = ty + 120 * u
  } else {
    let ty = top
    const hl = [0.94, 0.86, 0.5]
    for (let i = 0; i < 3; i++) put(`h${i}`, pad, ty + i * 18 * u, cw * hl[i], 11 * u)
    ty += 2 * 18 * u + 11 * u + 16 * u
    const bl = [0.98, 0.92, 0.64]
    for (let i = 0; i < 3; i++) put(`b${i}`, pad, ty + i * 10 * u, cw * bl[i], 5 * u)
    ty += 2 * 10 * u + 5 * u + 18 * u
    put("heroBtn", pad, ty, cw, 24 * u)
    ty += 24 * u + 20 * u
    put("img", pad, ty, cw, 96 * u)
    heroBottom = ty + 96 * u
  }

  // カード。3列 → 2列 → 1列
  const cols = [3, 2, 1][mode]
  const gap = (phone ? 10 : 14) * u
  const cardW = (cw - gap * (cols - 1)) / cols
  const cardH = (phone ? 66 : 76) * u
  const cardsY = heroBottom + (phone ? 22 : 30) * u
  for (let i = 0; i < 3; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const cx = pad + col * (cardW + gap)
    const cy = cardsY + row * (cardH + gap)
    put(`c${i}`, cx, cy, cardW, cardH)
    put(`ci${i}`, cx + 12 * u, cy + 12 * u, 14 * u, 14 * u)
    put(`cl${i}`, cx + 12 * u, cy + 38 * u, cardW * 0.56, 6 * u)
    put(`cm${i}`, cx + 12 * u, cy + 50 * u, cardW * 0.38, 5 * u)
  }
  const rows = Math.ceil(3 / cols)
  const fy = cardsY + rows * cardH + (rows - 1) * gap + 26 * u
  put("f0", pad, fy, cw * 0.3, 5 * u)
  put("f1", right - cw * 0.2, fy, cw * 0.2, 5 * u)

  return { L, bottom: fy + 5 * u }
}

export function ReflowCanvas() {
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
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches

    let W = 0
    let H = 0
    let D = 0 // パソコンの枠の幅
    let FH = 0 // 枠の高さ
    let u = 1

    // 枠の幅はパソコンの幅に対する割合で持つ（画面の幅が変わっても同じ場面のまま）。
    // タブレットとスマホの幅は、帯の高さに対して本物の端末に近い縦横比になるよう build で決める
    const ratios = [1, 0.62, 0.3]
    const breaks = [0.8, 0.46]
    let r = 1
    let step = 0
    let phase: "hold" | "move" = "hold"
    let phaseStart = 0
    let fromR = 1
    let firstHold = true
    let pausedAt = 0

    // 今の組み方と、各部品が本来の位置からどれだけずれているか（ばねで 0 へ戻す）
    let cur: Mode = 0
    const off = ITEMS.map(() => ({ x: 0, y: 0, w: 0, h: 0, a: 0 }))
    const vel = ITEMS.map(() => ({ x: 0, y: 0, w: 0, h: 0, a: 0 }))
    let ph = 0 // スマホらしさ（0〜1）。上の帯の形に使う
    let rad: number = RADII[0]

    let scroll = 0
    let dragging = false
    let hot = false
    let resumeAt = 0
    let raf = 0
    let last = 0
    let visible = true

    const modeOf = (x: number): Mode => (x > breaks[0] ? 0 : x > breaks[1] ? 1 : 2)

    const setLabels = (m: Mode) => {
      labelRefs.current.forEach((el, i) => {
        if (!el) return
        if (i === m) el.dataset.on = ""
        else delete el.dataset.on
      })
    }

    // 組み方が変わった瞬間、見た目の位置はそのままに、ずれとして持ち替える
    const setMode = (m: Mode) => {
      if (m === cur) return
      const fw = D * r
      const A = layout(cur, fw, u).L
      const B = layout(m, fw, u).L
      ITEMS.forEach(([id], i) => {
        for (const k of KEYS) {
          if (reduce) {
            off[i][k] = 0
            vel[i][k] = 0
          } else {
            off[i][k] = A[id][k] + off[i][k] - B[id][k]
          }
        }
      })
      cur = m
      if (reduce) {
        ph = m === 2 ? 1 : 0
        rad = RADII[m]
      }
      setLabels(m)
    }

    const build = () => {
      const rect = wrap.getBoundingClientRect()
      W = rect.width
      H = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      D = Math.min(W - (fine ? 36 : 0), 980)
      FH = H - RULER
      u = Math.min(1, Math.max(0.4, Math.min(FH / 420, D / 420)))
      const phoneW = Math.max(PHONE_MIN, Math.min(D * 0.3, FH * 0.52))
      const tabW = Math.min(D * 0.62, FH * 1.3)
      ratios[1] = tabW / D
      ratios[2] = Math.min(phoneW / D, ratios[1] * 0.7)
      breaks[0] = (ratios[0] + ratios[1]) / 2
      breaks[1] = (ratios[1] + ratios[2]) / 2
      if (phase === "hold" || reduce) r = ratios[step]
    }

    const rr = (x: number, y: number, w: number, h: number, radius: number) => {
      ctx.beginPath()
      if (ctx.roundRect) ctx.roundRect(x, y, Math.max(0, w), Math.max(0, h), Math.max(0, Math.min(radius, h / 2, w / 2)))
      else ctx.rect(x, y, Math.max(0, w), Math.max(0, h))
    }

    const scrollFor = (bottom: number) => {
      const view = FH - mix(26, 22, ph) * u
      return cur > 0 ? Math.max(0, bottom - view + 18 * u) * 0.85 : 0
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const fw = D * r
      const cx = W / 2
      const x0 = cx - fw / 2
      const y0 = 0.5
      const B = layout(cur, fw, u)
      const chromeH = mix(26, 22, ph) * u

      // 物差し。3つの幅の目盛りと、今の枠の幅（ミント）
      const ry = FH + 18
      ctx.fillStyle = "rgba(255,255,255,0.1)"
      ctx.fillRect(cx - D / 2, ry, D, 1)
      for (const m of [0, 1, 2]) {
        const hw = (D * ratios[m]) / 2
        ctx.fillStyle = m === cur ? "rgba(125,216,202,0.7)" : "rgba(255,255,255,0.28)"
        ctx.fillRect(Math.round(cx - hw), ry - 3, 1, 7)
        ctx.fillRect(Math.round(cx + hw) - 1, ry - 3, 1, 7)
      }
      ctx.fillStyle = "#7dd8ca"
      ctx.fillRect(x0, ry - 0.5, fw, 2)

      // 枠
      rr(x0, y0, fw, FH - 1, rad)
      ctx.fillStyle = "#13282f"
      ctx.fill()

      ctx.save()
      rr(x0, y0, fw, FH - 1, rad)
      ctx.clip()

      // 中身。本来の位置にばねのずれを足して描く
      const oy = y0 + chromeH - scroll
      ITEMS.forEach(([id, style], i) => {
        const b = B.L[id]
        const o = off[i]
        const x = x0 + b.x + o.x
        const y = oy + b.y + o.y
        const w = b.w + o.w
        const h = b.h + o.h
        const al = clamp01(b.a + o.a)
        if (al < 0.01 || w < 0.5 || h < 0.5 || y > FH || y + h < y0 + chromeH) return
        ctx.globalAlpha = al
        switch (style) {
          case "ink":
            ctx.fillStyle = "rgba(255,255,255,0.86)"
            rr(x, y, w, h, h / 2)
            ctx.fill()
            break
          case "text":
            ctx.fillStyle = "rgba(255,255,255,0.55)"
            rr(x, y, w, h, h / 2)
            ctx.fill()
            break
          case "soft":
            ctx.fillStyle = "rgba(255,255,255,0.24)"
            rr(x, y, w, h, h / 2)
            ctx.fill()
            break
          case "mint":
            ctx.fillStyle = "#7dd8ca"
            rr(x, y, w, h, 3 * u)
            ctx.fill()
            break
          case "pastel": {
            const g = ctx.createLinearGradient(x, y, x + w, y + h)
            g.addColorStop(0, "#c5f5e8")
            g.addColorStop(1, "#ffe4ef")
            ctx.fillStyle = g
            rr(x, y, w, h, h / 2)
            ctx.fill()
            break
          }
          case "image": {
            const g = ctx.createLinearGradient(x, y, x + w, y + h)
            g.addColorStop(0, "#c5f5e8")
            g.addColorStop(1, "#ffe4ef")
            ctx.fillStyle = g
            rr(x, y, w, h, 6 * u)
            ctx.fill()
            ctx.fillStyle = "rgba(255,255,255,0.6)"
            ctx.beginPath()
            ctx.arc(x + w * 0.74, y + h * 0.34, Math.min(w, h) * 0.13, 0, Math.PI * 2)
            ctx.fill()
            break
          }
          case "card":
            rr(x, y, w, h, 6 * u)
            ctx.fillStyle = "rgba(255,255,255,0.035)"
            ctx.fill()
            ctx.strokeStyle = "rgba(255,255,255,0.1)"
            ctx.lineWidth = 1
            ctx.stroke()
            break
        }
      })
      ctx.globalAlpha = 1

      // ブラウザの上の帯。PC とタブレットは3つの丸とアドレス欄、スマホは細い帯と短いアドレス欄に変わる
      ctx.fillStyle = "#18313a"
      ctx.fillRect(x0, y0, fw, chromeH)
      ctx.fillStyle = "rgba(255,255,255,0.06)"
      ctx.fillRect(x0, y0 + chromeH - 1, fw, 1)
      if (ph < 0.99) {
        ctx.globalAlpha = 1 - ph
        ctx.fillStyle = "rgba(255,255,255,0.22)"
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.arc(x0 + (15 + i * 10) * u, y0 + chromeH / 2, 3 * u, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }
      const addrW = mix(Math.min(fw * 0.4, 280 * u), fw * 0.36, ph)
      const addrH = mix(12, 8, ph) * u
      ctx.fillStyle = "rgba(255,255,255,0.08)"
      rr(cx - addrW / 2, y0 + chromeH / 2 - addrH / 2, addrW, addrH, addrH / 2)
      ctx.fill()
      ctx.restore()

      // 枠の線
      rr(x0, y0, fw, FH - 1, rad)
      ctx.strokeStyle = "rgba(255,255,255,0.18)"
      ctx.lineWidth = 1
      ctx.stroke()

      // つまみ（PC だけ）。枠の左右の外側に置き、つかめる時はミントに光る
      if (fine) {
        ctx.fillStyle = hot || dragging ? "rgba(125,216,202,0.95)" : "rgba(255,255,255,0.3)"
        const hy = FH / 2 - 14
        rr(x0 - 10, hy, 3, 28, 1.5)
        ctx.fill()
        rr(x0 + fw + 7, hy, 3, 28, 1.5)
        ctx.fill()
      }

      return B.bottom
    }

    // 動きを減らす設定では、ばねも送りも使わず、その場の形をすぐ描く
    const drawStill = () => {
      scroll = scrollFor(layout(cur, D * r, u).bottom)
      draw()
    }

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now

      // 自動で幅を変える（つかんでいる間と、離してしばらくは止める）
      if (!dragging && now >= resumeAt) {
        if (!phaseStart) phaseStart = now
        const t = now - phaseStart
        if (phase === "hold") {
          r = ratios[step]
          if (t > (firstHold ? 1400 : HOLD)) {
            firstHold = false
            phase = "move"
            phaseStart = now
            fromR = r
            step = (step + 1) % 3
          }
        } else {
          const k = clamp01(t / MOVE)
          r = mix(fromR, ratios[step], inOut(k))
          if (k >= 1) {
            phase = "hold"
            phaseStart = now
          }
        }
      }
      setMode(modeOf(r))

      // 部品ごとのばね（臨界減衰）。ずれと速さを、経過時間ぶんだけ厳密に進める
      ITEMS.forEach((_, i) => {
        const w = omega(i)
        const e = Math.exp(-w * dt)
        const o = off[i]
        const v = vel[i]
        for (const k of KEYS) {
          const p = o[k]
          const s = v[k]
          if (Math.abs(p) < 0.01 && Math.abs(s) < 0.01) {
            o[k] = 0
            v[k] = 0
            continue
          }
          const c = s + w * p
          o[k] = (p + c * dt) * e
          v[k] = (s - w * c * dt) * e
        }
      })
      const s = 1 - Math.exp(-dt * 7)
      ph += ((cur === 2 ? 1 : 0) - ph) * s
      rad += (RADII[cur] - rad) * s

      const bottom = draw()
      // タブレットとスマホの幅では縦に長くなるので、少し下まで送って中身を見せる
      scroll += (scrollFor(bottom) - scroll) * (1 - Math.exp(-dt * 1.6))

      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (raf || reduce || !visible || document.hidden) return
      // 止まっていた間の時間は、再生の時計から抜く
      if (pausedAt) {
        const gap = performance.now() - pausedAt
        if (phaseStart) phaseStart += gap
        if (resumeAt) resumeAt += gap
        pausedAt = 0
      }
      last = 0
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      if (!raf) return
      cancelAnimationFrame(raf)
      raf = 0
      pausedAt = performance.now()
    }

    build()
    setLabels(0)
    // 動きを減らす設定では、自動では動かさずパソコンの形で止めておく（つかめば幅は変えられる）
    if (reduce) drawStill()

    const ro = new ResizeObserver(() => {
      build()
      setMode(modeOf(r))
      if (reduce) drawStill()
      else if (!raf) draw()
    })
    ro.observe(wrap)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(wrap)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVisibility)

    // 枠の端をつかんで幅を変える
    const nearEdge = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const half = (D * r) / 2
      const d = Math.abs(Math.abs(x - W / 2) - half)
      return d < 18 && y > 0 && y < FH
    }
    const widthFrom = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      const x = e.clientX - rect.left
      return Math.min(D, Math.max(PHONE_MIN, Math.abs(x - W / 2) * 2)) / D
    }
    const onDown = (e: PointerEvent) => {
      // 2本目の指や、すでにつかんでいる時は無視する
      if (dragging || !nearEdge(e)) return
      dragging = true
      wrap.setPointerCapture(e.pointerId)
      e.preventDefault()
      if (reduce) draw()
    }
    const onMove = (e: PointerEvent) => {
      if (dragging) {
        r = widthFrom(e)
        if (reduce) {
          setMode(modeOf(r))
          drawStill()
        }
        return
      }
      const h = nearEdge(e)
      if (h !== hot) {
        hot = h
        wrap.style.cursor = h ? "ew-resize" : ""
        if (reduce) draw()
      }
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (wrap.hasPointerCapture(e.pointerId)) wrap.releasePointerCapture(e.pointerId)
      // 離した幅にいちばん近い場面へ、少し待ってからすべらせて続きを再生する
      const near = [0, 1, 2].reduce((best, m) => (Math.abs(ratios[m] - r) < Math.abs(ratios[best] - r) ? m : best), 0)
      step = near
      phase = "move"
      fromR = r
      resumeAt = performance.now() + 2400
      phaseStart = resumeAt
      if (reduce) draw()
    }
    const onLeave = () => {
      if (dragging) return
      hot = false
      wrap.style.cursor = ""
      if (reduce) draw()
    }
    if (fine) {
      wrap.addEventListener("pointerdown", onDown)
      wrap.addEventListener("pointermove", onMove)
      wrap.addEventListener("pointerup", onUp)
      wrap.addEventListener("pointercancel", onUp)
      wrap.addEventListener("pointerleave", onLeave)
    }

    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      wrap.removeEventListener("pointerdown", onDown)
      wrap.removeEventListener("pointermove", onMove)
      wrap.removeEventListener("pointerup", onUp)
      wrap.removeEventListener("pointercancel", onUp)
      wrap.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <div className="relative">
      <div ref={wrapRef} className="relative h-[300px] sm:h-[360px] md:h-[420px] lg:h-[460px] touch-pan-y select-none">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full" />
      </div>
      {/* 今の幅がどの端末か。枠の組み方が切り替わると、ここの印も移る */}
      <ul className="mt-2 flex justify-center gap-7 md:gap-10 text-[13px] md:text-[14px] font-bold tracking-[0.04em]">
        {DEVICES.map((name, i) => (
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
