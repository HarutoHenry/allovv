"use client"

import { useRef, useId } from "react"

interface Props {
  label: string
  onClick: () => void
}

export function LiquidNavItem({ label, onClick }: Props) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "")
  const filterId = `lnf${rawId}`
  const BASE_FILTER = `url(#lnf${rawId}) drop-shadow(0 2px 8px rgba(78,205,192,0.3))`

  const turbRef = useRef<SVGFETurbulenceElement>(null)
  const displRef = useRef<SVGFEDisplacementMapElement>(null)
  const btnRef  = useRef<HTMLButtonElement>(null)
  const rafRef  = useRef<number>(0)
  const startRef = useRef<number | null>(null)

  const runFrame = (now: number) => {
    if (startRef.current === null) startRef.current = now
    const t = Math.min((now - startRef.current) / 1000, 1)

    // ベル曲線：0 → ピーク → 0
    const wave = Math.sin(t * Math.PI)

    if (turbRef.current) {
      const bfx = (wave * 0.07).toFixed(5)
      const bfy = (wave * 0.04).toFixed(5)
      turbRef.current.setAttribute("baseFrequency", `${bfx} ${bfy}`)
      // シードをずらしてランダム感を出す
      turbRef.current.setAttribute("seed", String(5 + Math.floor(wave * 8)))
    }
    if (displRef.current) {
      displRef.current.setAttribute("scale", (wave * 18).toFixed(2))
    }

    // 色変化：hue-rotate でティール→パープルへシフト
    if (btnRef.current) {
      const hue = wave * 120
      btnRef.current.style.filter = `url(#${filterId}) hue-rotate(${hue.toFixed(1)}deg) drop-shadow(0 2px 8px rgba(78,205,192,0.3))`
    }

    if (t < 1) {
      rafRef.current = requestAnimationFrame(runFrame)
    } else {
      // アニメーション終了：リセット
      if (turbRef.current) turbRef.current.setAttribute("baseFrequency", "0 0")
      if (displRef.current) displRef.current.setAttribute("scale", "0")
      if (btnRef.current) btnRef.current.style.filter = BASE_FILTER
      startRef.current = null
    }
  }

  const handleMouseEnter = () => {
    cancelAnimationFrame(rafRef.current)
    startRef.current = null
    rafRef.current = requestAnimationFrame(runFrame)
  }

  return (
    <span className="relative inline-block">
      {/* SVG フィルター定義（非表示） */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", overflow: "visible", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              ref={turbRef}
              type="turbulence"
              baseFrequency="0 0"
              numOctaves="3"
              seed="5"
              result="noise"
            />
            <feDisplacementMap
              ref={displRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <button
        ref={btnRef}
        onMouseEnter={handleMouseEnter}
        onClick={onClick}
        className="liquid-nav-btn"
        style={{ filter: BASE_FILTER }}
      >
        {label}
      </button>
    </span>
  )
}
