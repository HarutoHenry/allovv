"use client"

import { useEffect, useRef } from "react"

/**
 * 料金の1行。普段は暗い面のまま。カーソルを乗せると、入った位置から淡いミント→ピンクの面が広がり、
 * 離れるとその場で素早く消える（見た目は globals.css の .svc-plan）。
 * カーソルの無い端末では、画面の真ん中に来た行に色を付ける
 */
export function PlanRow({ featured, children }: { featured: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia("(hover: none)").matches) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 画面の真ん中の高さから広げる
          el.style.setProperty("--x", "50%")
          el.style.setProperty("--y", `${window.innerHeight / 2 - entry.boundingClientRect.top}px`)
          el.dataset.lit = ""
        } else {
          delete el.dataset.lit
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const track = (e: React.PointerEvent<HTMLLIElement>, lit: boolean) => {
    if (e.pointerType !== "mouse") return
    const el = e.currentTarget
    if (!lit) {
      delete el.dataset.lit
      return
    }
    const r = el.getBoundingClientRect()
    el.style.setProperty("--x", `${e.clientX - r.left}px`)
    el.style.setProperty("--y", `${e.clientY - r.top}px`)
    el.dataset.lit = ""
  }

  return (
    <li
      ref={ref}
      className={`svc-plan${featured ? " svc-plan--featured" : ""}`}
      onPointerEnter={(e) => track(e, true)}
      onPointerLeave={(e) => track(e, false)}
    >
      {children}
    </li>
  )
}
