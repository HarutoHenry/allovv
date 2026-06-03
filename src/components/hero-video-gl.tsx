"use client"

import { useEffect, useRef } from "react"

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

    // カーソルからの距離でディスプレイスメント
    vec2 diff = uv - u_mouse;
    float dist = length(diff);
    float falloff = smoothstep(u_radius, 0.0, dist);
    vec2 dir = dist > 0.001 ? normalize(diff) : vec2(0.0);
    uv -= dir * falloff * u_strength;

    // object-fit: cover と同等のUV変換
    vec2 texUV = clamp(uv * u_scale + u_offset, 0.0, 1.0);
    gl_FragColor = texture2D(u_tex, texUV);
  }
`

export function HeroVideoGL({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mouse = useRef({ x: 0.5, y: 0.5 })
  const smooth = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    // null チェック済みの参照（クロージャ内でTS型エラー回避）
    const vid = video
    const cvs = canvas

    // シェーダーコンパイル
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

    // フルスクリーンクワッド
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "a_pos")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    // テクスチャ
    const tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    // Uniform locations
    const uMouse    = gl.getUniformLocation(prog, "u_mouse")
    const uStrength = gl.getUniformLocation(prog, "u_strength")
    const uRadius   = gl.getUniformLocation(prog, "u_radius")
    const uScale    = gl.getUniformLocation(prog, "u_scale")
    const uOffset   = gl.getUniformLocation(prog, "u_offset")

    gl.uniform1f(uStrength, 0.07)
    gl.uniform1f(uRadius, 0.28)
    gl.uniform2f(uScale, 1, 1)
    gl.uniform2f(uOffset, 0, 0)

    // object-fit: cover 相当のUV計算
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

    // リサイズ
    function resize() {
      const dpr = window.devicePixelRatio || 1
      cvs.width  = cvs.offsetWidth  * dpr
      cvs.height = cvs.offsetHeight * dpr
      gl!.viewport(0, 0, cvs.width, cvs.height)
      updateCover()
    }

    // レンダーループ（常時起動）
    let active = true
    function render() {
      if (!active) return
      if (vid.readyState >= 2) {
        gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true)
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, vid)
      }
      const s = smooth.current, t = mouse.current
      s.x += (t.x - s.x) * 0.055
      s.y += (t.y - s.y) * 0.055
      gl!.uniform2f(uMouse, s.x, s.y)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }

    // マウスイベントは親要素から取得（canvasはpointer-events:none）
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

    // 再生を確実に開始させる（iOS Safariはページ読み込み直後にplay()が失敗することがある）
    const tryPlay = () => vid.play().catch(() => {})
    vid.addEventListener("canplay", tryPlay)
    vid.addEventListener("loadeddata", tryPlay)
    tryPlay()

    // バックグラウンドから復帰した時・タッチ・クリックでも再生
    const onVisibility = () => { if (!document.hidden) tryPlay() }
    document.addEventListener("visibilitychange", onVisibility)
    const onInteraction = () => tryPlay()
    document.addEventListener("touchstart", onInteraction, { once: true })
    document.addEventListener("click", onInteraction, { once: true })

    // 停止した場合は自動再開
    vid.addEventListener("pause", tryPlay)

    resize()
    render()

    return () => {
      active = false
      cancelAnimationFrame(rafRef.current)
      parent.removeEventListener("mousemove", onMove)
      parent.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("resize", resize)
      vid.removeEventListener("canplay", tryPlay)
      vid.removeEventListener("loadeddata", tryPlay)
      vid.removeEventListener("pause", tryPlay)
      document.removeEventListener("visibilitychange", onVisibility)
      document.removeEventListener("touchstart", onInteraction)
      document.removeEventListener("click", onInteraction)
    }
  }, [src])

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </>
  )
}
