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

    vec2 diff = uv - u_mouse;
    float dist = length(diff);
    float falloff = smoothstep(u_radius, 0.0, dist);
    vec2 dir = dist > 0.001 ? normalize(diff) : vec2(0.0);
    uv -= dir * falloff * u_strength;

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
  const visibleRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

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

  return (
    <>
      {/* テクスチャの元になる動画。透明にして隠してはいけない。
          iOS Safari は「画面に映っていない動画」を省電力のために再生しない
          （＝開いた瞬間は止まったまま、指が触れて初めて動き出す）ので、
          opacity-0 で消すとスマホでだけ背景が動かなくなる。
          代わりに canvas の下に普通に敷く。canvas は毎フレーム全面を塗るので
          上から完全に隠れて見えないが、ブラウザから見れば「映っている」ことに
          なるので再生が止められない。canvas がまだ1枚目を描く前の一瞬は
          この動画がそのまま見える＝黒が出ないという利点もある */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="bg-video absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </>
  )
}
