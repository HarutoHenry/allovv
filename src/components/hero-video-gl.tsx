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
    WebGL を通さずに素材をそのまま流す。PC用の動画もこの条件では1バイトも取りに行かない */
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
  /** Safari 以外のスマホ（Android など）だけ、画像の代わりに <video> で流す */
  const [mobileVideo, setMobileVideo] = useState(false)
  const mouse = useRef({ x: 0.5, y: 0.5 })
  const smooth = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number>(0)
  const visibleRef = useRef(true)
  /* キャンバスが最初の1枚を描くまでは、下の動画ではなく静止画を見せる。
     iOS は「まだ再生されていない動画」に起動ボタン（▶）を重ねてくるので、
     その一瞬でも生の動画が見えていると押せそうなボタンが出てしまう */
  const [painted, setPainted] = useState(false)
  const paintedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    // スマホは下の別の effect が受け持つ。こちらは静止画を残したまま何もしない
    if (window.matchMedia(TOUCH).matches) return

    const gl = canvas.getContext("webgl")
    if (!gl) {
      /* WebGL が使えない端末ではキャンバスが永久に透明のままなので、
         静止画を退けて動画そのものを見せる */
      paintedRef.current = true
      setPainted(true)
      return
    }

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
      const s = smooth.current, t = mouse.current
      s.x += (t.x - s.x) * 0.055
      s.y += (t.y - s.y) * 0.055
      gl!.uniform2f(uMouse, s.x, s.y)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      /* 1枚目が載って初めて静止画を外す。texImage2D 前に外すと、
         中身の無いキャンバス＝黒が一瞬出る */
      if (!paintedRef.current && lastVideoTime >= 0) {
        paintedRef.current = true
        setPainted(true)
      }
      rafRef.current = requestAnimationFrame(render)
    }

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

    /* muted は属性ではなくプロパティでも立てておく。無音でない動画は自動再生を
       許されず、属性だけだと差し替えの拍子に外れることがある */
    vid.muted = true
    const tryPlay = () => vid.play().catch(() => {})
    vid.addEventListener("canplay", tryPlay)
    vid.addEventListener("loadeddata", tryPlay)
    tryPlay()

    const onVisibility = () => { if (!document.hidden) tryPlay() }
    document.addEventListener("visibilitychange", onVisibility)
    /* 低電力モードなどで自動再生を断られた時の逃げ道。once を付けない＝
       最初の1回だけでなく、触られるたびに掛け直す。1回きりだと、その1回が
       まだ動画の届く前だった場合にもう機会が無くなる */
    const onInteraction = () => tryPlay()
    document.addEventListener("pointerdown", onInteraction)
    vid.addEventListener("pause", tryPlay)

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
      parent.removeEventListener("mousemove", onMove)
      parent.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("resize", resize)
      vid.removeEventListener("canplay", tryPlay)
      vid.removeEventListener("loadeddata", tryPlay)
      vid.removeEventListener("pause", tryPlay)
      document.removeEventListener("visibilitychange", onVisibility)
      document.removeEventListener("pointerdown", onInteraction)
    }
  }, [src])

  /* スマホ。iPhone の低電力モードは <video> の自動再生を一切許さず、
     何度 play() を掛け直しても、指が触れるまで止まったままになる。
     ここは動画を「画像」として出して、その制限の外に置く。
     Safari は <img>／<picture> に mp4 を渡すと GIF と同じ扱いで勝手に流す
     （WebKit の仕様。音が無い前提なので自動再生の制限がかからず、▶ も出ない）。
     mp4 を画像として読めないブラウザ（Android の Chrome など）は <picture> の
     mp4 を飛ばして透明な GIF を選ぶので、その時だけ <video> に切り替える。
     Android は無音の動画なら低電力でも自動再生を通す */
  useEffect(() => {
    if (!window.matchMedia(TOUCH).matches) return
    const img = motionRef.current
    if (!img) return
    const decide = () => {
      if (!img.currentSrc) return false
      if (!/\.mp4(\?|$)/.test(img.currentSrc)) setMobileVideo(true)
      return true
    }
    // どちらを選んだかは読み込みの手前で決まる。まだ決まっていなければ待つ
    if (decide()) return
    img.addEventListener("load", decide, { once: true })
    img.addEventListener("error", decide, { once: true })
    return () => {
      img.removeEventListener("load", decide)
      img.removeEventListener("error", decide)
    }
  }, [])

  return (
    <>
      {/* PC：テクスチャの元になる動画。透明にして隠してはいけない。
          Safari は「画面に映っていない動画」を省電力のために再生しないので、
          opacity-0 や display:none で消すと背景が動かなくなる。
          代わりに全面のまま下に敷いて、上から静止画とキャンバスで覆う。
          覆われているだけなら「映っている」扱いなので再生は止まらない。
          media でPCだけに渡す。スマホは下の <picture> が受け持つので、
          ここでは1バイトも取りに行かせない（二重に読むと縦持ちで 3MB を超える） */}
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
        <source src={src} type="video/mp4" media="(hover: hover)" />
      </video>

      {/* 動画の1コマ目そのもの。PCではキャンバスが描き始めるまでの間、スマホでは
          下の動画が届くまでの間、ここが見えている。中身は動画の先頭フレームと
          同じ絵なので、入れ替わりは目に見えない。
          スマホは縦に切り出した方を出す（横長の静止画を縦の画面に引き伸ばすと
          粗くなる）。自動再生がどうしても掛からない端末では、これがそのまま残る */}
      <picture>
        <source media={TALL} srcSet={mobilePoster} />
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-[450ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          style={{ opacity: painted ? 0 : 1 }}
        />
      </picture>

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
      {mobileVideo && (
        <MobileVideo src={src} poster={poster} mobileSrc={mobileSrc} mobilePoster={mobilePoster} />
      )}
    </>
  )
}

/** mp4 を画像として流せないスマホ向け。掛からなかった時は触れた瞬間に掛け直す。
    効果の中でしか作られない（サーバーでは描かれない）ので、向きはその場で読んでよい */
function MobileVideo({ src, poster, mobileSrc, mobilePoster }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [tall] = useState(() => window.matchMedia(TALL).matches)

  useEffect(() => {
    const vid = ref.current
    if (!vid) return
    vid.muted = true
    const tryPlay = () => vid.play().catch(() => {})
    const onVisibility = () => { if (!document.hidden) tryPlay() }
    vid.addEventListener("canplay", tryPlay)
    document.addEventListener("visibilitychange", onVisibility)
    document.addEventListener("pointerdown", tryPlay)
    tryPlay()
    return () => {
      vid.removeEventListener("canplay", tryPlay)
      document.removeEventListener("visibilitychange", onVisibility)
      document.removeEventListener("pointerdown", tryPlay)
    }
  }, [])

  return (
    <video
      ref={ref}
      src={tall ? mobileSrc : src}
      poster={tall ? mobilePoster : poster}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="bg-video absolute inset-0 w-full h-full object-cover pointer-events-none"
    />
  )
}
