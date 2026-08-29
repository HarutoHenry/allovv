"use client"

import { useEffect, useRef, useState } from "react"

/**
 * @param threshold 何割が画面に入ったら出すか
 * @param repeat    true にすると、画面から完全に外れた時に false へ戻る＝
 *                  上へ戻ってきた時にもう一度出る。既定の false は従来どおり
 *                  一度出したら二度と戻さない（他のセクションの挙動は変わらない）
 */
export function useScrollAnimation(threshold = 0.1, repeat = false) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!repeat) {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
          return
        }
        /* 出す条件と戻す条件をわざとずらしている（出す＝threshold まで入った時、
           戻す＝完全に外れた時）。同じ境目で出し入れすると、その一点で
           少し指を動かすたびにカードが降りたり上がったりする。
           ※ threshold ちょうどで判定しない。境目を跨いだ瞬間の ratio は
             小数の丸めで 0.19998 のように返ることがあり、== や >= だと取り逃す */
        if (entry.isIntersecting && entry.intersectionRatio >= threshold * 0.99) {
          setIsVisible(true)
        } else if (!entry.isIntersecting) {
          setIsVisible(false)
        }
      },
      // 戻す側の判定をするために 0 も見張る
      { threshold: repeat ? [0, threshold] : threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, repeat])

  return { ref, isVisible }
}
