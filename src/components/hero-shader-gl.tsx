"use client"

import { useEffect, useRef } from "react"

const VERT = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`

const FRAG = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_mouse;
  varying vec2  v_uv;

  float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
  }

  float blob(vec2 uv, vec2 center, float r) {
    return length(uv - center) - r;
  }

  void main() {
    vec2 uv = v_uv;
    float t  = u_time * 0.4;

    // マウス反発（強め）
    vec2  md   = uv - u_mouse;
    float mdst = length(md);
    float push  = smoothstep(0.30, 0.0, mdst) * 0.22;
    uv += normalize(md + 0.0001) * push;

    // 3つのブロブがゆっくり動く（大きく・鮮やかに）
    vec2 b1 = vec2(0.2 + 0.3  * sin(t * 0.7),       0.3  + 0.25 * cos(t * 0.5));
    vec2 b2 = vec2(0.75 + 0.2 * cos(t * 0.6 + 1.0), 0.65 + 0.3  * sin(t * 0.8));
    vec2 b3 = vec2(0.5  + 0.3 * sin(t * 0.5 + 2.5), 0.85 + 0.2  * cos(t * 0.4));

    float d = smin(blob(uv, b1, 0.55), blob(uv, b2, 0.50), 0.35);
    d = smin(d, blob(uv, b3, 0.45), 0.30);

    float shape = smoothstep(0.12, -0.12, d);

    vec3 mint  = vec3(0.500, 0.890, 0.780); // 鮮やかなミント
    vec3 pink  = vec3(1.000, 0.650, 0.820); // 鮮やかなピンク
    vec3 lilac = vec3(0.720, 0.670, 0.960); // 鮮やかなライラック
    vec3 white = vec3(0.980, 0.980, 0.990);

    float mix1 = 0.5 + 0.5 * sin(uv.x * 2.5 + t);
    float mix2 = 0.5 + 0.5 * cos(uv.y * 2.0 + t * 0.8);
    vec3 blobCol = mix(mix(mint, pink, mix1), lilac, mix2 * 0.5);

    vec3 col = mix(white, blobCol, shape * 0.92);
    gl_FragColor = vec4(col, 1.0);
  }
`

export function HeroShaderGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse  = useRef({ x: 0.5, y: 0.5 })
  const smooth = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error("Shader error:", gl!.getShaderInfoLog(s))
      }
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

    const uTime  = gl.getUniformLocation(prog, "u_time")
    const uMouse = gl.getUniformLocation(prog, "u_mouse")
    const start  = performance.now()

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width  = (canvas!.offsetWidth  || window.innerWidth)  * dpr
      canvas!.height = (canvas!.offsetHeight || window.innerHeight) * dpr
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
    }

    function render() {
      const s = smooth.current, t = mouse.current
      s.x += (t.x - s.x) * 0.06
      s.y += (t.y - s.y) * 0.06
      gl!.uniform1f(uTime,  (performance.now() - start) / 1000)
      gl!.uniform2f(uMouse, s.x, s.y)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      // canvasの範囲内だけ反応
      if (e.clientX >= r.left && e.clientX <= r.right &&
          e.clientY >= r.top  && e.clientY <= r.bottom) {
        mouse.current = {
          x: (e.clientX - r.left) / r.width,
          y: 1 - (e.clientY - r.top) / r.height,
        }
      } else {
        mouse.current = { x: 0.5, y: 0.5 }
      }
    }
    window.addEventListener("mousemove", onMove)

    const ro = new ResizeObserver(() => resize())
    ro.observe(canvas)

    resize()
    render()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove", onMove)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
