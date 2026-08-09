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
