"use client"

import { useEffect, useRef } from "react"

/**
 * AI活用研修のヒーローの背景の絵。暗い研修室で、講師がスクリーンのまえに立ち、映した「指示の型」を指して説明している。
 * 手前には受講者が5人（1社5名まで）、それぞれ自分のパソコンを開いて聞いている。
 * 天井のプロジェクターから出た光の中で、細かなほこりがゆっくり漂う（動きを減らす設定では止めた1枚にする）。
 * 写真は使わず図で描く（2026-09-30 ユーザー指示）。見出しの後ろに敷く飾りなので aria-hidden。
 *
 * 座標は 1600×900 の枠で決めてある。枠の比率は CSS（.tscene-art）で 16:9 に保ち、狭い画面では左右を切る
 */

const VB_W = 1600

// 映っている画面と、プロジェクターのレンズ
const IMG = { x: 548, y: 204, w: 504, h: 282 }
const LENS = { x: 900, y: 100 }

// 受講者。top は頭のてっぺん、s は大きさ（奥の列ほど小さい）、side はパソコンが体のどちらに見えるか
type Hair = "short" | "bun" | "long"
type Learner = { x: number; top: number; s: number; tilt: number; hair: Hair; side: -1 | 1 }

const FRONT: Learner[] = [
  { x: 706, top: 494, s: 1.08, tilt: -3, hair: "bun", side: -1 },
  { x: 884, top: 498, s: 1.1, tilt: 4, hair: "short", side: 1 },
  { x: 1062, top: 492, s: 1.06, tilt: 0, hair: "long", side: 1 },
]
const BACK: Learner[] = [
  { x: 468, top: 592, s: 1.6, tilt: 2, hair: "short", side: -1 },
  { x: 1176, top: 588, s: 1.62, tilt: -2, hair: "long", side: 1 },
]

// 後ろから見た、頭と肩（頭の幅 40・てっぺんが 0 の大きさで描き、translate と scale で置く）
const BUST =
  "M0 0C11.6 0 20 9.6 20 23.5C20 32.5 17.2 40.2 12.6 45.4L12.2 53.6C22.5 58 41 60.6 51.2 69.4C59.6 76.8 63.2 91.5 64 150H-64C-63.2 91.5 -59.6 76.8 -51.2 69.4C-41 60.6 -22.5 58 -12.2 53.6L-12.6 45.4C-17.2 40.2 -20 32.5 -20 23.5C-20 9.6 -11.6 0 0 0Z"
const LONG_HAIR = "M-20 20C-21.5 38 -23.5 55 -26 70H26C23.5 55 21.5 38 20 20Z"

// 講師。左手は下ろし、右手でスクリーンの2行目を指す
const PRESENTER =
  "M580 402H596L597 413C606 417 617 419 624 422L662 394C664 392.5 665 391 666 389.5L691 358C694 354 698 351 702 349L713 343C716 341.5 718.5 343 717.5 345.5C717 347 715.5 348 714 348.5L706 353C707 357.5 705 362 701 365C699 366.5 698 367 697 368L674 406C672 409 669 411 666 412L636 438C634 440 633 443 633 446C634 470 631 494 627 512C629 524 631 536 631 548C631 576 627 616 625 648L623 700H599L597 650C595 612 592 584 590 568H586C584 584 581 612 579 650L577 700H553L551 648C549 616 547 590 547 568L545 560C542 563 535 563 532 559C529 555 528 547 529 538L530 458C530 440 537 428 548 423C557 419 569 417 579 413Z"

// スクリーンに映す「指示の型」の行（左のラベル＋本文）。2行目を講師が指している
const ROWS = [
  { y: 306, w: 220 },
  { y: 340, w: 190 },
  { y: 374, w: 236 },
  { y: 408, w: 140 },
]

const INK = "#1a2e35"
const DARK = "#061014"
const RIM = "#d6f4ee"

function Hairdo({ hair }: { hair: Hair }) {
  if (hair === "bun") return <circle cx="3" cy="-2" r="9.5" />
  if (hair === "long") return <path d={LONG_HAIR} />
  return (
    <>
      <ellipse cx="0" cy="21" rx="21" ry="21.5" />
      <ellipse cx="-19.6" cy="28" rx="3.4" ry="6.4" />
      <ellipse cx="19.6" cy="28" rx="3.4" ry="6.4" />
    </>
  )
}

// 受講者1人。画面の光が当たる側（スクリーンの中心寄り・上）にだけ、輪郭の光を細く残す。
// 手前の列は体を枠の下まで伸ばす（輪郭の光は頭と肩だけ）。奥の列は切れ目を床の暗がりに溶かす
function Person({ p, extend = false }: { p: Learner; extend?: boolean }) {
  const shape = (
    <>
      <path d={BUST} />
      <Hairdo hair={p.hair} />
    </>
  )
  const dx = Math.sign(800 - p.x) * 1.4
  const place = (ox: number, oy: number) =>
    `translate(${p.x + ox} ${p.top + oy}) rotate(${p.tilt} 0 48) scale(${p.s})`
  return (
    <>
      <g transform={place(dx, -2.6)} fill={RIM} opacity="0.55" filter="url(#ts-soft)">
        {shape}
      </g>
      <g transform={place(0, 0)} fill={DARK}>
        {shape}
        {extend && <rect x="-64" y="149" width="128" height="160" />}
      </g>
    </>
  )
}

// 受講者のパソコン。こちらを向いた画面が、肩の横から少しのぞく
function Laptop({ p, deskY }: { p: Learner; deskY: number }) {
  const w = 68 * p.s
  const h = 44 * p.s
  const cx = p.x + p.side * 60 * p.s
  const x = cx - w / 2
  const y = deskY - h
  const line = (ly: number, lw: number, o: number) => (
    <rect x={x + w * 0.14} y={y + h * ly} width={w * lw} height={Math.max(1.6, h * 0.07)} rx="1" fill={INK} opacity={o} />
  )
  return (
    <g>
      <rect x={x - 10} y={y - 8} width={w + 20} height={h + 16} rx="10" fill="#7dd8ca" opacity="0.22" filter="url(#ts-glow)" />
      <rect x={x} y={y} width={w} height={h} rx="3" fill="url(#ts-laptop)" opacity="0.82" />
      {line(0.22, 0.34, 0.45)}
      {line(0.4, 0.62, 0.22)}
      {line(0.56, 0.5, 0.22)}
      {line(0.72, 0.56, 0.22)}
    </g>
  )
}

function Desk({ y, x1, x2 }: { y: number; x1: number; x2: number }) {
  return (
    <g>
      <rect x={x1} y={y} width={x2 - x1} height="34" fill="#0e1f25" />
      <rect x={x1} y={y} width={x2 - x1} height="1.6" fill="#9fe8dc" opacity="0.16" />
    </g>
  )
}

export function TrainingScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // プロジェクターの光の中を漂うほこり
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const TL = { x: IMG.x, y: IMG.y }
    const TR = { x: IMG.x + IMG.w, y: IMG.y }

    type Mote = { x: number; y: number; vx: number; vy: number; r: number; age: number; life: number; ph: number }
    const spawn = (m?: Mote): Mote => {
      // 光の三角の中に、偏りなく置く
      let a = Math.random()
      let b = Math.random()
      if (a + b > 1) {
        a = 1 - a
        b = 1 - b
      }
      const n = m ?? ({} as Mote)
      n.x = LENS.x + a * (TL.x - LENS.x) + b * (TR.x - LENS.x)
      n.y = LENS.y + a * (TL.y - LENS.y) + b * (TR.y - LENS.y)
      n.vx = (Math.random() - 0.5) * 7
      n.vy = (Math.random() - 0.62) * 5
      n.r = 0.7 + Math.random() * 1.5
      n.age = reduce ? Math.random() * 4 : 0
      n.life = 7 + Math.random() * 7
      n.ph = Math.random() * Math.PI * 2
      return n
    }

    const motes: Mote[] = Array.from({ length: 54 }, () => {
      const m = spawn()
      m.age = Math.random() * m.life
      return m
    })

    // 光の三角の中にいるか。縁に近いほど薄くする
    const inside = (x: number, y: number) => {
      if (y < LENS.y || y > IMG.y) return 0
      const t = (y - LENS.y) / (IMG.y - LENS.y)
      const left = LENS.x + t * (TL.x - LENS.x)
      const right = LENS.x + t * (TR.x - LENS.x)
      if (x < left || x > right) return 0
      const edge = Math.min(x - left, right - x, IMG.y - y)
      return Math.min(1, edge / 18)
    }

    let W = 0
    let scale = 1
    let raf = 0
    let last = 0
    let visible = true

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(rect.height * dpr)
      scale = W / VB_W
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0)
    }

    const render = (t: number) => {
      ctx.clearRect(0, 0, VB_W, 900)
      for (const m of motes) {
        const k = inside(m.x, m.y)
        if (k <= 0) continue
        const life = Math.min(1, m.age / 1.4, (m.life - m.age) / 1.4)
        // レンズに近いほど光が濃いので、ほこりもよく光る
        const near = 1 - 0.55 * ((m.y - LENS.y) / (IMG.y - LENS.y))
        const twinkle = 0.75 + 0.25 * Math.sin(t * 1.3 + m.ph)
        const a = 0.85 * k * life * near * twinkle
        if (a <= 0.01) continue
        ctx.fillStyle = `rgba(234, 250, 247, ${a})`
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let clock = 0
    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      clock += dt
      for (const m of motes) {
        m.age += dt
        m.x += (m.vx + Math.sin(clock * 0.45 + m.ph) * 2.2) * dt
        m.y += (m.vy + Math.cos(clock * 0.38 + m.ph) * 1.6) * dt
        if (m.age >= m.life || inside(m.x, m.y) <= 0) spawn(m)
      }
      render(clock)
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
    render(0)

    const ro = new ResizeObserver(() => {
      build()
      render(clock)
    })
    ro.observe(canvas)

    // 画面の外にある間と、タブが裏にある間は止める
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVisibility)

    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  const hi = ROWS[1]

  return (
    <div className="tscene" aria-hidden="true">
      <div className="tscene-art">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="none" focusable="false">
          <defs>
            <radialGradient
              id="ts-wall"
              cx="800"
              cy="345"
              r="760"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(800 345) scale(1 0.6) translate(-800 -345)"
            >
              <stop offset="0" stopColor="#7dd8ca" stopOpacity="0.2" />
              <stop offset="0.42" stopColor="#7dd8ca" stopOpacity="0.07" />
              <stop offset="1" stopColor="#7dd8ca" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ts-beam" x1={LENS.x} y1={LENS.y} x2="800" y2={IMG.y} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#eafaf7" stopOpacity="0.55" />
              <stop offset="0.25" stopColor="#eafaf7" stopOpacity="0.2" />
              <stop offset="1" stopColor="#eafaf7" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="ts-screen" x1="0" y1={IMG.y} x2="0" y2={IMG.y + IMG.h} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#e4f7f3" />
              <stop offset="1" stopColor="#c9ebe5" />
            </linearGradient>
            <radialGradient id="ts-hot" cx="830" cy="320" r="320" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ts-laptop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e6f8f5" stopOpacity="0.92" />
              <stop offset="1" stopColor="#b7e6de" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="ts-floor" x1="0" y1="596" x2="0" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#081317" stopOpacity="0" />
              <stop offset="0.14" stopColor="#081317" />
              <stop offset="1" stopColor="#060e11" />
            </linearGradient>
            <linearGradient id="ts-fall" x1="0" y1="606" x2="0" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#081317" stopOpacity="0" />
              <stop offset="0.2" stopColor="#081317" />
              <stop offset="1" stopColor="#060e11" />
            </linearGradient>
            <filter id="ts-haze" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="34" />
            </filter>
            <filter id="ts-beam-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <filter id="ts-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <filter id="ts-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.1" />
            </filter>
          </defs>

          {/* 部屋。スクリーンの光が壁にぼんやり広がる */}
          <rect width="1600" height="900" fill="#0b181d" />

          <g className="tscene-on">
            <rect width="1600" height="900" fill="url(#ts-wall)" />
            <rect x="500" y="170" width="600" height="350" rx="40" fill="#7dd8ca" opacity="0.28" filter="url(#ts-haze)" />

            {/* プロジェクターの光 */}
            <path
              d={`M${LENS.x - 7} ${LENS.y}L${IMG.x} ${IMG.y}H${IMG.x + IMG.w}L${LENS.x + 7} ${LENS.y}Z`}
              fill="url(#ts-beam)"
              filter="url(#ts-beam-blur)"
            />
            <g fill="#eafaf7" filter="url(#ts-beam-blur)">
              <path className="tscene-ray" d={`M${LENS.x} ${LENS.y}L640 ${IMG.y}H700Z`} opacity="0.1" />
              <path className="tscene-ray" style={{ animationDelay: "-2.4s" }} d={`M${LENS.x} ${LENS.y}L820 ${IMG.y}H900Z`} opacity="0.12" />
              <path className="tscene-ray" style={{ animationDelay: "-4.8s" }} d={`M${LENS.x} ${LENS.y}L960 ${IMG.y}H1010Z`} opacity="0.09" />
            </g>
          </g>

          {/* スクリーン（巻き上げ式。上に収納の箱） */}
          <rect x="536" y="194" width="528" height="302" rx="2" fill="#16262c" />
          <g className="tscene-on">
            <rect x={IMG.x} y={IMG.y} width={IMG.w} height={IMG.h} fill="url(#ts-screen)" />
            <rect x={IMG.x} y={IMG.y} width={IMG.w} height={IMG.h} fill="url(#ts-hot)" />

            {/* 映しているスライド。題名と、「指示の型」の4行 */}
            <rect x="590" y="236" width="164" height="12" rx="3" fill={INK} opacity="0.62" />
            <rect x="590" y="258" width="102" height="7" rx="2" fill={INK} opacity="0.26" />
            <rect x="718" y={hi.y - 9} width="332" height="32" rx="6" fill="#7dd8ca" opacity="0.34" />
            <rect x="718" y={hi.y - 9} width="332" height="32" rx="6" fill="none" stroke="#237e73" strokeOpacity="0.5" strokeWidth="1.4" />
            {ROWS.map((r, i) => (
              <g key={r.y}>
                <rect x="730" y={r.y} width="46" height="14" rx="3" fill={i === 1 ? "#237e73" : INK} opacity={i === 1 ? 0.9 : 0.5} />
                <rect x="786" y={r.y} width={r.w} height="14" rx="3" fill={INK} opacity={i === 1 ? 0.3 : 0.2} />
              </g>
            ))}
            <rect x="590" y="462" width="56" height="5" rx="2" fill={INK} opacity="0.16" />
            <rect x="1004" y="462" width="18" height="5" rx="2" fill={INK} opacity="0.16" />
          </g>
          <rect x="526" y="182" width="548" height="13" rx="3" fill="#132227" />
          <rect x="526" y="182" width="548" height="1.4" rx="0.7" fill="#9fe8dc" opacity="0.18" />

          {/* 天井のプロジェクター（こちらからは背面が見える） */}
          <rect x="897" y="0" width="6" height="84" fill="#10212a" />
          <rect x="882" y="82" width="36" height="6" rx="2" fill="#10212a" />
          <rect x="860" y="88" width="80" height="26" rx="6" fill="#0c1a20" />
          <rect x="864" y="88" width="72" height="1.4" rx="0.7" fill="#9fe8dc" opacity="0.22" />
          <circle cx="872" cy="106" r="1.6" fill="#7dd8ca" className="tscene-on" />

          {/* 講師 */}
          <g fill={DARK}>
            <path d={PRESENTER} />
            <ellipse cx="588" cy="384" rx="17" ry="21.5" />
            <ellipse cx="587.5" cy="380.5" rx="18.5" ry="19" />
          </g>

          {/* 前の列の机・パソコン・受講者3人 */}
          <rect x="0" y="596" width="1600" height="304" fill="url(#ts-floor)" />
          <Desk y={604} x1={500} x2={1230} />
          {FRONT.map((p) => (
            <Laptop key={p.x} p={p} deskY={628} />
          ))}
          {FRONT.map((p) => (
            <Person key={p.x} p={p} />
          ))}
          <rect x="0" y="606" width="1600" height="294" fill="url(#ts-fall)" />

          {/* 手前の列の机・パソコン・受講者2人 */}
          <Desk y={806} x1={180} x2={1420} />
          {BACK.map((p) => (
            <Laptop key={p.x} p={p} deskY={834} />
          ))}
          {BACK.map((p) => (
            <Person key={p.x} p={p} extend />
          ))}
        </svg>
        <canvas ref={canvasRef} className="tscene-motes" />
      </div>
      <div className="tscene-shade" />
    </div>
  )
}
