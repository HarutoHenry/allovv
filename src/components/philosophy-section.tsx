"use client"

import { useEffect, useRef, type ReactNode, type Ref } from "react"
import { Quicksand } from "next/font/google"
import { useVideoAutoplay } from "@/hooks/use-video-autoplay"
import s from "./philosophy.module.css"

// 構成・英字の添え書き・左の本文は 2026-10-06 にユーザーから受け取った参考画像のとおり
// （「Philosophyのところをこれと同じにしてください／真ん中は動いてるといい」）。
// 見出し・3つの与える・Our Belief の日本語は、以前からこのセクションにある文。
// 参考画像の左下にあった数字の欄（3 VALUES / 100+ POSSIBILITIES / ∞）は外した（同日「これいらないね」）
// 3つの与えるの見出しは英語に（2026-10-06 ユーザー指定「Give Ai / Give Time / Give Possibility」。AI は大文字にそろえた）

/* 真ん中の「Allovv」はロゴ（public/logo.png）と同じ字形に（2026-10-06「真ん中のフォントをロゴと同じに」）。
   ロゴの文字は丸みのある幾何学的な書体で、並べて比べると Quicksand の 600 がいちばん近い。
   この一語にしか使わないので先読みはしない */
const logoFont = Quicksand({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  preload: false,
})

/** 1要素＝1行。行の中は語のまとまりごとに区切り、狭い画面でも言葉の途中では折り返さない */
type Lines = string[][]

const lead: Lines = [
  ["Allovvは、", "テクノロジーの力で"],
  ["すべての人に", "「時間」と", "「可能性」を", "届け、"],
  ["誰もが本当に", "生きたい人生を", "選べる"],
  ["世界をつくります。"],
]

// 本文の句は 8 字まで。スマホでは3つを横に並べて列が細くなるので、句の途中で割れないように細かく切ってある（文は変えていない）
const values: { no: string; title: string; text: Lines }[] = [
  {
    no: "01",
    title: "Give AI",
    text: [["専門知識は不要。"], ["最先端のAIを、", "すぐに、", "誰の手にも", "届ける。"], ["それがAllovvの", "スタートライン", "です。"]],
  },
  {
    no: "02",
    title: "Give Time",
    text: [["繰り返しの", "作業を", "AIに任せ、"], ["人にしか", "できない", "ことへの", "時間を", "取り戻す。"], ["AIは最高の", "贈り物です。"]],
  },
  {
    no: "03",
    title: "Give Possibility",
    text: [["AIが新たな", "扉を開く。"], ["これまで", "諦めていた", "挑戦が、"], ["今日から", "現実に", "なります。"]],
  },
]

const belief: Lines = [["AIが与える時間と可能性で、"], ["誰もが本当に", "生きたい人生を", "選べる世界へ。"]]

function Text({ lines }: { lines: Lines }) {
  return lines.map((phrases) => (
    <span key={phrases.join("")} className="block">
      {phrases.map((p) => (
        <span key={p} className="inline-block">
          {p}
        </span>
      ))}
    </span>
  ))
}

/** 英字の一行。句ごとに広めの間をあけ、折り返すときは句の切れ目で折る */
function Phrases({ parts, className }: { parts: string[]; className: string }) {
  return (
    <p lang="en" className={className}>
      {parts.map((p) => (
        <span key={p} className={s.phrase}>
          {p}
        </span>
      ))}
    </p>
  )
}

/* ── 図の中のアイコン（Tabler の線画。線は青緑から薄紫へのグラデーション）── */
function Icon({ id, children }: { id: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={`url(#${id})`} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className={s.icon}>
      <defs>
        <linearGradient id={id} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5fcabb" />
          <stop offset="1" stopColor="#a68fe6" />
        </linearGradient>
      </defs>
      {children}
    </svg>
  )
}

// ja はスマホで泡の中に出す題の一行（2026-10-06「スマホ版にしたら、下の図形の一つ一つにこの言葉をいれて」）
const bubbles = [
  {
    key: "ai",
    label: "AI",
    sub: "Give AI",
    ja: "AIを与える。",
    className: s.bubbleAi,
    icon: (
      <Icon id="philo-icon-ai">
        <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
        <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
        <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
        <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
        <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
        <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
      </Icon>
    ),
  },
  {
    key: "time",
    label: "Time",
    sub: "Give time",
    ja: "時間を与える。",
    className: s.bubbleTime,
    icon: (
      <Icon id="philo-icon-time">
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
        <path d="M12 7v5l3 3" />
      </Icon>
    ),
  },
  {
    key: "possibility",
    label: "Possibility",
    sub: "Give possibility",
    ja: "可能性を与える。",
    className: s.bubblePossibility,
    icon: (
      <Icon id="philo-icon-seed">
        <path d="M12 10a6 6 0 0 0 -6 -6h-3v2a6 6 0 0 0 6 6h3" />
        <path d="M12 14a6 6 0 0 1 6 -6h3v1a6 6 0 0 1 -6 6h-3" />
        <path d="M12 20l0 -10" />
      </Icon>
    ),
  },
]

/* ── 真ん中の球を回る2本の輪（座標は図の枠 720×640 の中）──
   輪の奥の半分は球の後ろ、手前の半分は球の前に描く。手前の層は同じ輪を下半分だけ切り抜いて重ねる */
const rings = [
  { id: "philo-ring-a", cx: 336, cy: 372, rx: 336, ry: 150, tilt: 17 },
  { id: "philo-ring-b", cx: 352, cy: 318, rx: 318, ry: 212, tilt: -58 },
]

// 輪の上を回る小さな球。ring は rings の何番目か、begin は最初にどこにいるか（負の秒数だけ先に進めておく）
const spheres = [
  { ring: 0, r: 15, dur: 46, begin: -6, fill: "philo-sph-lav" },
  { ring: 0, r: 19, dur: 46, begin: -27, fill: "philo-sph-violet" },
  { ring: 1, r: 18, dur: 58, begin: -4, fill: "philo-sph-teal" },
  { ring: 1, r: 31, dur: 58, begin: -33, fill: "philo-sph-glass" },
]

const ellipsePath = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`

function Sphere({ r, fill }: { r: number; fill: string }) {
  return (
    <>
      <circle r={r} fill={`url(#${fill})`} stroke="rgba(255,255,255,0.85)" strokeWidth={1} />
      <ellipse cx={-r * 0.34} cy={-r * 0.42} rx={r * 0.32} ry={r * 0.2} fill="rgba(255,255,255,0.9)" transform={`rotate(-28 ${-r * 0.34} ${-r * 0.42})`} />
    </>
  )
}

function Orbits({ front, svgRef }: { front?: boolean; svgRef: Ref<SVGSVGElement> }) {
  return (
    <svg ref={svgRef} viewBox="0 0 720 640" className={front ? s.orbitFront : s.orbitBack} overflow="visible">
      {!front && (
        <defs>
          {rings.map((r) => (
            <path key={r.id} id={r.id} d={ellipsePath(r.cx, r.cy, r.rx, r.ry)} />
          ))}
          {rings.map((r) => (
            <clipPath key={r.id} id={`${r.id}-front`} clipPathUnits="userSpaceOnUse">
              <rect x={r.cx - r.rx - 60} y={r.cy} width={r.rx * 2 + 120} height={r.ry + 60} />
            </clipPath>
          ))}
          <linearGradient id="philo-ring-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#bfe9e6" stopOpacity="0.85" />
            <stop offset="0.5" stopColor="#d9cdf6" stopOpacity="0.8" />
            <stop offset="1" stopColor="#f1cbe9" stopOpacity="0.85" />
          </linearGradient>
          {[
            ["philo-sph-lav", "#efe6fd", "#c7b1f0"],
            ["philo-sph-violet", "#eadcfb", "#a98ae4"],
            ["philo-sph-teal", "#def6f6", "#7fcfd3"],
            ["philo-sph-glass", "#f4fbfd", "#b9d3ee"],
          ].map(([id, mid, edge]) => (
            <radialGradient key={id} id={id} cx="0.38" cy="0.32" r="0.75">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.45" stopColor={mid} stopOpacity="0.95" />
              <stop offset="1" stopColor={edge} stopOpacity="0.95" />
            </radialGradient>
          ))}
        </defs>
      )}
      {rings.map((r, i) => (
        <g
          key={r.id}
          transform={`rotate(${r.tilt} ${r.cx} ${r.cy})`}
          clipPath={front ? `url(#${r.id}-front)` : undefined}
        >
          <use href={`#${r.id}`} fill="none" stroke="#ffffff" strokeOpacity={0.55} strokeWidth={9} className={s.ringGlow} />
          <use href={`#${r.id}`} fill="none" stroke="url(#philo-ring-stroke)" strokeWidth={4} />
          <use href={`#${r.id}`} fill="none" stroke="#ffffff" strokeOpacity={0.9} strokeWidth={1.2} />
          {spheres
            .filter((sp) => sp.ring === i)
            .map((sp) => (
              <g key={sp.fill}>
                <Sphere r={sp.r} fill={sp.fill} />
                <animateMotion dur={`${sp.dur}s`} begin={`${sp.begin}s`} repeatCount="indefinite">
                  <mpath href={`#${r.id}`} />
                </animateMotion>
              </g>
            ))}
        </g>
      ))}
    </svg>
  )
}

export function PhilosophySection() {
  const videoRef = useVideoAutoplay()
  const sectionRef = useRef<HTMLElement>(null)
  const backRef = useRef<SVGSVGElement>(null)
  const frontRef = useRef<SVGSVGElement>(null)

  // 画面の外にあるあいだと、動きを減らす設定のときは、球も輪も止めておく
  useEffect(() => {
    const section = sectionRef.current
    const back = backRef.current
    const front = frontRef.current
    if (!section || !back || !front) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)")
    let visible = false
    const apply = () => {
      const run = visible && !still.matches
      section.dataset.paused = String(!run)
      // 奥と手前の輪は別々の svg なので、時計をそろえてから動かす
      front.setCurrentTime(back.getCurrentTime())
      for (const svg of [back, front]) {
        if (run) svg.unpauseAnimations()
        else svg.pauseAnimations()
      }
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        apply()
      },
      { rootMargin: "160px 0px" }
    )
    io.observe(section)
    still.addEventListener("change", apply)
    apply()
    return () => {
      io.disconnect()
      still.removeEventListener("change", apply)
    }
  }, [])

  return (
    <section ref={sectionRef} id="philosophy" className={`${s.section} ${logoFont.variable}`}>
      {/* 背景動画。明るいまま、白い幕を厚めにかけて淡い色の気配だけを残す */}
      <div aria-hidden className={s.media}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="bg-video"
          src="/videos/philosophy-bg.mp4"
        />
      </div>
      <div aria-hidden className={s.veil} />

      <div className={s.stage}>
        {/* 左。見出しと、Allovv が目指すこと。
            スマホでは見出し（introHead）と本文（introBody）のあいだに真ん中の図を挟むので、二つに分けてある */}
        <div className={s.intro}>
          <div className={s.introHead}>
            <p lang="en" className={s.eyebrow}>
              Philosophy
            </p>
            <h2 className={s.title}>
              <span className="block">AIを与える。</span>
              <span className="block">時間を与える。</span>
              <span className="block">可能性を与える。</span>
            </h2>
            <Phrases parts={["Give AI.", "Give time.", "Give possibility."]} className={s.give} />
          </div>
          <div className={s.introBody}>
            <p className={s.lead}>
              <Text lines={lead} />
            </p>
            <span aria-hidden className={s.dash} />
            <Phrases parts={["Allow AI.", "Allow You.", "Allow a Better Tomorrow."]} className={s.allow} />
          </div>
        </div>

        {/* 真ん中。形を変えながら色が巡る球と、そのまわりを回る輪と、3つの泡 */}
        <div aria-hidden className={s.art}>
          <Orbits svgRef={backRef} />
          <div className={s.orb}>
            <span className={s.orbHalo} />
            {/* 形の違う2枚を逆向きに回して、輪郭がゆっくり変わって見えるようにする。
                中の色は回転を打ち消して、青緑が左・桃色が右のまま漂う */}
            <span className={`${s.orbShape} ${s.orbShapeA}`}>
              <span className={s.orbColor} />
            </span>
            <span className={`${s.orbShape} ${s.orbShapeB}`}>
              <span className={s.orbColor} />
            </span>
            <span className={s.orbGloss} />
            <span className={s.orbDots} />
            <span className={s.orbSpot} />
            <span className={s.orbText}>
              <span className={s.orbName}>Allovv</span>
              <span className={s.orbLine}>Give you</span>
              <span className={s.orbLine}>A brighter</span>
              <span className={s.orbLine}>Tomorrow</span>
            </span>
          </div>
          <Orbits front svgRef={frontRef} />
          {bubbles.map((b) => (
            <span key={b.key} className={`${s.bubble} ${b.className}`}>
              <span className={s.bubbleBody}>
                {b.icon}
                <span className={s.bubbleLabel}>{b.label}</span>
                <span className={s.bubbleSub}>{b.sub}</span>
                <span className={s.bubbleJa}>{b.ja}</span>
              </span>
            </span>
          ))}
          <span className={`${s.speck} ${s.speck1}`} />
          <span className={`${s.speck} ${s.speck2}`} />
          <span className={`${s.speck} ${s.speck3}`} />
          <span className={`${s.speck} ${s.speck4}`} />
        </div>

        {/* 右。3つの与える */}
        <ol className={s.values}>
          {values.map((v) => (
            <li key={v.no} className={s.value}>
              <span aria-hidden className={s.no}>
                {v.no}
              </span>
              <h3 lang="en" className={s.valueTitle}>
                {v.title}
              </h3>
              <span aria-hidden className={s.rail} />
              <p className={s.valueText}>
                <Text lines={v.text} />
              </p>
            </li>
          ))}
        </ol>

        {/* 下の真ん中。Allovv が信じていること */}
        <div className={s.belief}>
          <p lang="en" className={s.beliefLabel}>
            Our Belief
          </p>
          <p className={s.beliefText}>
            <Text lines={belief} />
          </p>
          <span aria-hidden className={s.dash} />
          <Phrases parts={["More human time.", "A brighter tomorrow."]} className={s.beliefEn} />
        </div>

        {/* 右下。ガラスの札と、そこに重なる小さな球 */}
        <div aria-hidden className={s.card}>
          <div className={s.cardGlass}>
            <p lang="en" className={s.cardText}>
              Technology
              <br />
              For a more human tomorrow.
            </p>
            <span className={s.cardRule} />
          </div>
          <span className={s.cardBlob}>
            <span className={s.cardBlobInner} />
          </span>
        </div>
      </div>
    </section>
  )
}
