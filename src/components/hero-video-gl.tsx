"use client"

import { useEffect, useRef, useState } from "react"

const VERT = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() {
    v_uv = vec2(a_pos.x * 0.5 + 0.5, a_pos.y * 0.5 + 0.5);
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`

const FRAG = `
  precision mediump float;
  uniform sampler2D u_tex;
  uniform vec2 u_mouse;
  uniform float u_strength;
  uniform float u_radius;
  uniform vec2 u_scale;
  uniform vec2 u_offset;
  varying vec2 v_uv;

  void main() {
    vec2 uv = v_uv;

    vec2 diff = uv - u_mouse;
    float dist = length(diff);
    float falloff = smoothstep(u_radius, 0.0, dist);
    vec2 dir = dist > 0.001 ? normalize(diff) : vec2(0.0);
    uv -= dir * falloff * u_strength;

    vec2 texUV = clamp(uv * u_scale + u_offset, 0.0, 1.0);
    gl_FragColor = texture2D(u_tex, texUV);
  }
`

/** 指で触る端末（スマホ・タブレット）。カーソルの揺らぎはここでは起きようがないので、
    WebGL を通さずに素材をそのまま流す。縦持ちは軽いスマホ用動画を使う */
const TOUCH = "(hover: none)"
/** そのうち縦持ちの時だけ、縦に切り出した軽い方を使う。iPad を横にした時まで
    縦長の素材を引き伸ばすと粗くなるので、横向きは元の動画をそのまま流す */
const TALL = "(hover: none) and (orientation: portrait)"
/** 1px の透明な GIF。<picture> の mp4 を選ばないブラウザでは、ここに何も映らない */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

type Props = {
  src: string
  poster: string
  /** スマホ用。縦長に切り出して軽くした同じ動画と、その1コマ目 */
  mobileSrc: string
  mobilePoster: string
}

export function HeroVideoGL({ src, poster, mobileSrc, mobilePoster }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const motionRef = useRef<HTMLImageElement>(null)
  // 再生を始めてから、余裕のあるタイミングでPCのカーソル演出を加える。
  const [enhance, setEnhance] = useState(false)
  const mouse = useRef({ x: 0.5, y: 0.5 })
  const smooth = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number>(0)
  const visibleRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!enhance || !canvas || !video) return
    // スマホではWebGLを使わず、動画またはMP4画像をそのまま見せる
    if (window.matchMedia(TOUCH).matches) return

    const gl = canvas.getContext("webgl")
    if (!gl) return // ネイティブ動画はそのまま再生できる

    const vid = video
    const cvs = canvas

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog)
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "a_pos")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    const uMouse    = gl.getUniformLocation(prog, "u_mouse")
    const uStrength = gl.getUniformLocation(prog, "u_strength")
    const uRadius   = gl.getUniformLocation(prog, "u_radius")
    const uScale    = gl.getUniformLocation(prog, "u_scale")
    const uOffset   = gl.getUniformLocation(prog, "u_offset")

    gl.uniform1f(uStrength, 0.07)
    gl.uniform1f(uRadius, 0.28)
    gl.uniform2f(uScale, 1, 1)
    gl.uniform2f(uOffset, 0, 0)

    function updateCover() {
      if (!vid.videoWidth) return
      const va = vid.videoWidth / vid.videoHeight
      const ca = cvs.width / cvs.height
      let su = 1, sv = 1, ou = 0, ov = 0
      if (ca > va) { sv = va / ca; ov = (1 - sv) / 2 }
      else         { su = ca / va; ou = (1 - su) / 2 }
      gl!.uniform2f(uScale, su, sv)
      gl!.uniform2f(uOffset, ou, ov)
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cvs.width  = cvs.offsetWidth  * dpr
      cvs.height = cvs.offsetHeight * dpr
      gl!.viewport(0, 0, cvs.width, cvs.height)
      updateCover()
    }

    let active = true
    let lastVideoTime = -1

    function render() {
      if (!active || !visibleRef.current) {
        rafRef.current = 0
        return
      }
      // テクスチャはビデオフレームが進んだ時だけ更新（GPU負荷削減）
      if (vid.readyState >= 2 && vid.currentTime !== lastVideoTime) {
        lastVideoTime = vid.currentTime
        gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true)
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, vid)
      }
      /* 1コマ目が届くまでは何も描かない。空のテクスチャは不透明な黒として読まれ、
         キャンバスは動画より上にあるので、ここで描くと開いた直後に画面が
         灰色に沈んでから動画に切り替わる（白40%の幕越しの黒）。描かなければ
         キャンバスは透明のままで、下のネイティブ動画がそのまま見えている */
      if (lastVideoTime < 0) {
        rafRef.current = requestAnimationFrame(render)
        return
      }
      const s = smooth.current, t = mouse.current
      s.x += (t.x - s.x) * 0.055
      s.y += (t.y - s.y) * 0.055
      gl!.uniform2f(uMouse, s.x, s.y)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }

    const onContextLost = () => {
      active = false
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      cvs.style.visibility = "hidden" // ネイティブ動画へ戻す
    }
    cvs.addEventListener("webglcontextlost", onContextLost)
    const parent = cvs.parentElement!
    const onMove = (e: MouseEvent) => {
      const r = cvs.getBoundingClientRect()
      mouse.current = {
        x: (e.clientX - r.left) / r.width,
        y: 1 - (e.clientY - r.top) / r.height,
      }
    }
    const onLeave = () => { mouse.current = { x: 0.5, y: 0.5 } }

    parent.addEventListener("mousemove", onMove)
    parent.addEventListener("mouseleave", onLeave)
    window.addEventListener("resize", resize)
    vid.addEventListener("loadedmetadata", updateCover)

    // ヒーローが画面外に出たらRAFを停止し、戻ったら再開
    const ioCanvas = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
      if (entry.isIntersecting && !rafRef.current) {
        rafRef.current = requestAnimationFrame(render)
      }
    }, { threshold: 0 })
    ioCanvas.observe(cvs)

    resize()
    render()

    return () => {
      active = false
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      ioCanvas.disconnect()
      cvs.removeEventListener("webglcontextlost", onContextLost)
      parent.removeEventListener("mousemove", onMove)
      parent.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("resize", resize)
      vid.removeEventListener("loadedmetadata", updateCover)
      gl.deleteTexture(tex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
  }, [src, enhance])

  useEffect(() => {
    const video = videoRef.current
    const img = motionRef.current
    if (!video || !img) return
    const touch = window.matchMedia(TOUCH).matches
    let imagePlayback = false
    let disposed = false
    let idle: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    let scheduled = false

    // SafariはMP4画像を初期HTMLから再生する。対応しないAndroidも、同じく
    // 初期HTMLにあるvideoを再生するので、Reactの起動まで取得を待たない。
    const selectImagePlayback = () => {
      if (imagePlayback || !touch || !/\.mp4(\?|$)/.test(img.currentSrc) || !img.complete || img.naturalWidth === 0) return
      imagePlayback = true
      img.style.visibility = "visible"
      video.pause()
      video.preload = "none"
      // 同じ動画を二重にデコードし続けない。静止画は下に常に残す。
      video.querySelectorAll("source").forEach(source => source.removeAttribute("src"))
      video.load()
      video.style.visibility = "hidden"
    }
    const restoreVideoPlayback = () => {
      imagePlayback = false
      img.style.visibility = "hidden"
      video.style.visibility = "visible"
      video.preload = "auto"
      const sources = video.querySelectorAll("source")
      sources[0]?.setAttribute("src", mobileSrc)
      sources[1]?.setAttribute("src", src)
      video.load()
      tryPlay()
    }
    const tryPlay = () => {
      if (!disposed && !imagePlayback && !document.hidden) {
        video.muted = true
        void video.play().catch(() => {})
      }
    }
    const afterPlaying = () => {
      if (touch || scheduled) return
      scheduled = true
      const enable = () => { if (!disposed) setEnhance(true) }
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(enable, { timeout: 1000 })
      else timer = setTimeout(enable, 0)
    }
    const onVisibility = () => { if (!document.hidden) tryPlay() }
    video.addEventListener("playing", afterPlaying)
    video.addEventListener("loadeddata", tryPlay)
    video.addEventListener("canplay", tryPlay)
    document.addEventListener("visibilitychange", onVisibility)
    document.addEventListener("pointerdown", tryPlay)
    if (touch) {
      selectImagePlayback()
      // Reactが起動する前に画像としての読込が失敗済みなら、videoを残す。
      if (img.complete && img.naturalWidth === 0) img.style.visibility = "hidden"
      img.addEventListener("load", selectImagePlayback)
      img.addEventListener("error", restoreVideoPlayback)
    }
    tryPlay()
    if (!video.paused && video.readyState >= 2) afterPlaying()
    return () => {
      disposed = true
      if (idle !== undefined) window.cancelIdleCallback(idle)
      if (timer !== undefined) clearTimeout(timer)
      video.removeEventListener("playing", afterPlaying)
      video.removeEventListener("loadeddata", tryPlay)
      video.removeEventListener("canplay", tryPlay)
      document.removeEventListener("visibilitychange", onVisibility)
      document.removeEventListener("pointerdown", tryPlay)
      img.removeEventListener("load", selectImagePlayback)
      img.removeEventListener("error", restoreVideoPlayback)
    }
  }, [src, mobileSrc])

  return (
    <>
      {/* 静止画は動画より下に置く。再生中の映像をReact起動まで覆わない。 */}
      <picture>
        <source media={TALL} srcSet={mobilePoster} />
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </picture>

      {/* PC・AndroidともにサーバーHTMLから動画を取得・自動再生する。
          WebGLや機種判定の完了を待たせない。縦持ちスマホは軽い素材を選ぶ。 */}
      <video
        ref={videoRef}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="bg-video absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src={mobileSrc} type="video/mp4" media={TALL} />
        <source src={src} type="video/mp4" />
      </video>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* スマホ：Safari はここで mp4 を選んで流す。それ以外は透明な1pxのまま */}
      <picture>
        <source media={TALL} type="video/mp4" srcSet={mobileSrc} />
        <source media={TOUCH} type="video/mp4" srcSet={src} />
        <img
          ref={motionRef}
          src={BLANK}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </picture>
    </>
  )
}
