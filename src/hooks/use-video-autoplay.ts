"use client"

import { useEffect, useRef } from "react"
import { isAutoplayRefused, loadVideoAsImage } from "@/lib/video-as-image"

/** 背景動画を流し続ける。videoRef は <video> に、imageRef はその上に重ねる
    隠した <img> に付ける。自動再生を断られた時（低電力モードの Safari）は、
    同じ mp4 をその <img> に画像として読ませて流す（src/lib/video-as-image.ts） */
export function useVideoAutoplay() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const vid = videoRef.current
    const img = imageRef.current
    if (!vid) return

    /** 画像として流しているか。一度切り替えたら動画には戻さない */
    let asImage = false
    let cancelImage: (() => void) | undefined

    const toImage = () => {
      if (!img || cancelImage) return
      cancelImage = loadVideoAsImage(img, vid.currentSrc || vid.src, () => {
        // 読み込みを待つあいだにクリックなどで動き出したなら、動画のままにする
        if (!vid.paused) return
        asImage = true
        img.hidden = false
        vid.pause()
        vid.style.visibility = "hidden"
      })
    }

    const tryPlay = () => {
      if (asImage) return
      vid.play().catch((error) => {
        if (isAutoplayRefused(error)) toImage()
      })
    }

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
      cancelImage?.()
      vid.removeEventListener("canplay", tryPlay)
      vid.removeEventListener("loadeddata", tryPlay)
      vid.removeEventListener("pause", tryPlay)
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      document.removeEventListener("touchstart", onTouch)
    }
  }, [])

  return { videoRef, imageRef }
}
