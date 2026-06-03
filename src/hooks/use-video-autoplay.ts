"use client"

import { useEffect, useRef } from "react"

export function useVideoAutoplay() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

    const tryPlay = () => vid.play().catch(() => {})

    // 再生できる状態になったら即再生
    vid.addEventListener("canplay", tryPlay)
    vid.addEventListener("loadeddata", tryPlay)
    // 止まったら再開
    vid.addEventListener("pause", tryPlay)

    // 画面に入った時だけ再生（省電力 + 確実な再開）
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) tryPlay() },
      { threshold: 0.1 }
    )
    io.observe(vid)

    // バックグラウンドから復帰した時
    const onVisibility = () => { if (!document.hidden) tryPlay() }
    document.addEventListener("visibilitychange", onVisibility)

    // 初回タッチでも再生（iOS Safari対策）
    const onTouch = () => tryPlay()
    document.addEventListener("touchstart", onTouch, { once: true })

    tryPlay()

    return () => {
      vid.removeEventListener("canplay", tryPlay)
      vid.removeEventListener("loadeddata", tryPlay)
      vid.removeEventListener("pause", tryPlay)
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      document.removeEventListener("touchstart", onTouch)
    }
  }, [])

  return videoRef
}
