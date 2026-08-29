"use client"

import { useEffect } from "react"

/**
 * URLのハッシュ（/#news など）でトップページを開いたときに、
 * 目的の区画まで確実にスクロールさせる。
 *
 * トップページには CreativeSection のように「マウント後にJSで高さを決める」区画があり、
 * ブラウザが最初にハッシュへスクロールする時点ではページ全体の高さがまだ確定していない。
 * その状態で html { scroll-behavior: smooth } のスムーズスクロールが走るため、
 * Creative より下にある #news / #blog / #about / #contact は手前で止まってしまう。
 * 画像やフォントの遅れ読み込みでも同じことが起きる。
 *
 * ここでは対象要素の位置を測り直しながら、位置が安定するまでスクロールをやり直す。
 * ユーザーが自分でスクロール操作をしたら即座に中断するので、操作を奪うことはない。
 */
export const SCROLL_TARGET_KEY = "allovv:scroll-target"

const MAX_DURATION_MS = 3000
const HASH_WAIT_MS = 800
const TICK_MS = 16
const STABLE_TICKS = 12

/**
 * トップページ内でナビをクリックしたときのスクロール。
 *
 * scrollIntoView({ behavior: "smooth" }) だと、CreativeSection のように
 * マウント後にJSで高さが決まる区画があるせいで、走っている最中に着地位置が
 * ずれて手前で止まる。ここでは毎フレーム目的地を測り直しながら自前で動かす。
 * ユーザーが自分でスクロールしたら即座に譲る。
 */
export function animateScrollTo(targetId: string, duration = 700) {
  if (!document.getElementById(targetId)) return

  const jumpTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({
      top: Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY)),
      behavior: "instant",
    })
  }

  // 非表示タブでは requestAnimationFrame が止まるのでアニメーションできない
  if (document.hidden) {
    jumpTo(targetId)
    return
  }

  const root = document.documentElement
  const prevScrollBehavior = root.style.scrollBehavior
  // CSSの scroll-behavior: smooth と綱引きになると毎回やり直しになるので切る
  root.style.scrollBehavior = "auto"

  const from = window.scrollY
  const start = performance.now()
  let raf = 0
  let cancelled = false

  const cancel = () => {
    cancelled = true
  }
  const opts = { passive: true } as const
  window.addEventListener("wheel", cancel, opts)
  window.addEventListener("touchstart", cancel, opts)

  const cleanup = () => {
    root.style.scrollBehavior = prevScrollBehavior
    window.removeEventListener("wheel", cancel)
    window.removeEventListener("touchstart", cancel)
    cancelAnimationFrame(raf)
  }

  const measure = () => {
    const el = document.getElementById(targetId)
    if (!el) return null
    const maxTop = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    )
    return Math.max(
      0,
      Math.min(Math.round(el.getBoundingClientRect().top + window.scrollY), maxTop)
    )
  }

  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

  let stableTicks = 0

  const step = (now: number) => {
    if (cancelled) return cleanup()
    const to = measure()
    if (to === null) return cleanup()

    const elapsed = now - start
    const t = Math.min(1, elapsed / duration)

    if (t < 1) {
      window.scrollTo({ top: Math.round(from + (to - from) * ease(t)), behavior: "instant" })
      raf = requestAnimationFrame(step)
      return
    }

    // 着いたあとも、下の区画が読み込まれて高さが伸びると位置がずれる。
    // ずれなくなるまで追い続ける（HashScroll と同じ考え方）。
    if (Math.abs(window.scrollY - to) > 2) {
      window.scrollTo({ top: to, behavior: "instant" })
      stableTicks = 0
    } else {
      stableTicks += 1
    }

    if (stableTicks >= STABLE_TICKS || elapsed > MAX_DURATION_MS) return cleanup()
    raf = requestAnimationFrame(step)
  }

  raf = requestAnimationFrame(step)
}

export function HashScroll() {
  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let targetId: string | null = null
    let stable = 0
    const start = performance.now()

    // ブラウザ自身のスムーズスクロール（高さが確定する前に誤った位置へ走ってしまう）
    // と綱引きにならないよう、追従している間だけ smooth を切る
    const root = document.documentElement
    const prevScrollBehavior = root.style.scrollBehavior
    root.style.scrollBehavior = "auto"

    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      root.style.scrollBehavior = prevScrollBehavior
    }

    const cancel = () => {
      cancelled = true
      finish()
    }

    // ユーザーが自分でスクロールし始めたら追従をやめる
    const opts = { passive: true } as const
    window.addEventListener("wheel", cancel, opts)
    window.addEventListener("touchstart", cancel, opts)
    window.addEventListener("keydown", cancel, opts)
    window.addEventListener("pointerdown", cancel, opts)

    // ハッシュ付きの遷移でハッシュが落ちることがあるため、ナビゲーション側が
    // 置いた行き先を控えとして使う。持ち越して誤爆しないよう必ずここで消費する。
    let stored: string | null = null
    try {
      stored = sessionStorage.getItem(SCROLL_TARGET_KEY)
      if (stored) sessionStorage.removeItem(SCROLL_TARGET_KEY)
    } catch {
      // sessionStorage が使えない環境では無視する
    }

    const readTarget = () => {
      const hash = window.location.hash
      if (hash && hash.length > 1) {
        try {
          return decodeURIComponent(hash.slice(1))
        } catch {
          return hash.slice(1)
        }
      }
      return stored
    }

    const step = () => {
      if (cancelled) return
      const elapsed = performance.now() - start

      // 遷移直後はURLの反映が一瞬遅れることがあるので少しだけ待つ
      if (targetId === null) {
        targetId = readTarget()
        if (targetId === null) {
          if (elapsed > HASH_WAIT_MS) return finish()
          timer = setTimeout(step, TICK_MS)
          return
        }
      }

      const el = document.getElementById(targetId)
      if (el) {
        const maxTop = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight
        )
        const top = Math.max(
          0,
          Math.min(Math.round(el.getBoundingClientRect().top + window.scrollY), maxTop)
        )
        if (Math.abs(window.scrollY - top) > 2) {
          // CSSの scroll-behavior: smooth に引きずられると
          // 毎回アニメーションが再開されて進まないので instant を明示する
          window.scrollTo({ top, behavior: "instant" })
          stable = 0
        } else {
          stable += 1
        }
      }

      if (stable >= STABLE_TICKS || elapsed > MAX_DURATION_MS) return finish()
      timer = setTimeout(step, TICK_MS)
    }

    step()

    return () => {
      cancelled = true
      finish()
      if (timer) clearTimeout(timer)
      window.removeEventListener("wheel", cancel)
      window.removeEventListener("touchstart", cancel)
      window.removeEventListener("keydown", cancel)
      window.removeEventListener("pointerdown", cancel)
    }
  }, [])

  return null
}
