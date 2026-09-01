"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

type Slide = {
  num: string
  label: string
  /** 和文は語中で折れるので、意味の切れ目で分けて折り返し位置を固定する。
      スマホは1要素＝1行、PCは横に並んで1行になる（読み上げ用に join して使う） */
  title: string[]
  /** 和文は語中で折れるので、文節ごとに分けて折り返し位置を固定する */
  statement: string[]
  /** 着手順。この順でしか進まないので、間の矢印が意味を持つ。持たないカードもある */
  steps?: string[]
  price: string
  cta: string
  href: string
  external?: boolean
  /** カードの中で動く素材と、背景のぼかしに使う静止画 */
  video: string
  still: string
  /** 白地に線画の素材だけは、下に色を敷いて乗算で重ねないとカードが消えてしまう */
  tint?: string
  /** 素材ごとに展開の速さが違うので、再生速度で他のカードに合わせる */
  rate?: number
}

const slides: Slide[] = [
  {
    num: "01",
    label: "SYSTEMIZE",
    title: ["AI仕組み化"],
    statement: ["毎日の事務作業を、", "AIが下書きします。"],
    steps: ["業務設計", "AI構築", "標準化"],
    price: "1業務 ¥50,000〜（税別・1ヶ月サポート付き）",
    cta: "業務ごとの料金を見る",
    href: "/services/ai-consulting",
    video: "/videos/philosophy-bg.mp4",
    still: "/images/business/02.jpg",
    rate: 0.72,
  },
  {
    num: "02",
    label: "WEB",
    title: ["ホームページ制作"],
    statement: ["伝えたいことが、", "伝わる形に。"],
    price: "¥50,000〜（税別）",
    cta: "制作の流れと料金を見る",
    href: "/services/web",
    video: "/videos/hero-bg.mp4",
    still: "/images/business/04.jpg",
    rate: 0.72,
  },
  {
    num: "03",
    label: "STARTUP",
    title: ["AIにおまかせ起業"],
    statement: ["会社をつくるまでを、", "順番にご案内します。"],
    price: "設立の手続きから、専門家への相談まで",
    cta: "詳しく見る",
    href: "https://ainiomakasekigyou.com",
    external: true,
    video: "/videos/creative-bg.mp4",
    still: "/images/business/03.jpg",
    rate: 0.95,
  },
  {
    num: "04",
    label: "CREATIVE",
    title: ["AIクリエイティブ", "制作"],
    statement: ["広告の案を、", "何通りでも出します。"],
    price: "お見積り（画像・動画・広告コピー）",
    cta: "制作の例を見る",
    href: "#creative",
    video: "/videos/business-bg.mp4",
    still: "/images/business/01.jpg",
    tint: "linear-gradient(140deg, #c5f5e8 0%, #e8f4fb 45%, #ffe4ef 100%)",
    // 4本の速さはこの04を基準に合わせている。全体をもう少し速く／遅くしたい時は、
    // 4つの rate を同じ倍率で掛け直せば釣り合いは崩れない
    rate: 0.8,
  },
]

/** 隣のカードを画面の中に残しておく幅。指で押せる最小寸法（Appleの44pt）に
    少しだけ余裕を足した値。ここを削ると、カードは見えているのに押せない飾りになる */
const PEEK = 50

/** カードの寸法を画面幅から出す。参考サイトと同じく3枚で画面幅をちょうど埋める。
   カテゴリが4つしかないので、4枚目が画面に入ると同じカテゴリが左右に二度出てしまう。
   それを避ける条件が activeW/2 + pillW + gap*2 >= 画面幅/2 で、下の比率はそれを満たしている */
function sizeFor(w: number) {
  if (w >= 768) {
    const activeW = w * 0.5
    const activeH = Math.min(activeW / 1.44, 600)
    return { activeW, activeH, pillW: w * 0.24, pillH: activeH * 0.9, gap: w * 0.01 }
  }
  const gap = w * 0.022
  /* 隣のカードが画面に見えている幅は (画面幅 - activeW) / 2 - gap で決まる。
     真ん中を 0.82 のまま置くと、iPhone（390px）ではこれが 23px しか残らない。
     指で押せる幅ではないので、スマホでは「押せるだけ残す」ほうを上限にして
     真ん中を細める。左右に PEEK ぶん覗いていること自体が、横に続きがある合図にもなる。
     ※ここを広げすぎると隣の隣（＝反対側と同じカテゴリ）が画面に入る。上の条件は
       activeW を細くするほど余裕が出る向きなので、この式では崩れない */
  const activeW = Math.min(w * 0.82, w - 2 * (PEEK + gap))
  const activeH = activeW / 1.2
  return { activeW, activeH, pillW: w * 0.3, pillH: activeH * 0.9, gap }
}

/** カードの素材。<video autoPlay> に任せきりだと、たまに止まったまま静止画だけが残る。
    原因は3つとも「失敗しても例外が飛ばない」たちのもので、気づきようがない：
      ①play() は Promise を返す。カードが差し替わる途中や、まだ画面外にいるうちに
        呼ばれると AbortError／NotAllowedError で静かに reject して、そのまま止まる
      ②タブを離れて戻ってくると、iOS は自分から再生を再開しない
      ③同時に再生できる本数には端末ごとの上限があり、超えた分は無言で失敗する
    なので「掛かるまで掛け直す」側に寄せる。読み込みが進んだ時とタブに戻った時に
    もう一度 play() を試し、画面の外にいる間は止めて本数の枠を空けておく。 */
function CardVideo({ slide, playing }: { slide: Slide; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    /* muted は属性ではなくプロパティで持たせる。無音でない動画は自動再生を許されず、
       属性だけだと差し替えのタイミングで外れることがある */
    el.muted = true
    el.playbackRate = slide.rate ?? 1

    let tries = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    /* 「いま再生しているべきか」を毎回そのまま当てに行く。片道（play するだけ）に
       すると、画面外で勝手に走り出した分を止められない。
       失敗した時は間を空けて掛け直す。1バイトも届いていない（readyState 0）なら
       読み込みごと止まっているので、取得からやり直す。回数を切ってあるのは、
       本当に端末が断っている時（低電力モード等）に延々と叩き続けないため */
    const sync = () => {
      clearTimeout(timer)
      if (!playing || document.visibilityState === "hidden") {
        el.pause()
        return
      }
      el.play().then(
        () => { tries = 0 },
        () => {
          if (tries >= 6) return
          tries += 1
          if (el.readyState === 0) el.load()
          timer = setTimeout(sync, 300 * tries)
        }
      )
    }
    sync()

    el.addEventListener("canplay", sync)
    el.addEventListener("loadeddata", sync)
    /* 取得が詰まった・こけた時にも掛け直す。読み込み中にスクロールで入ってくると、
       ページ本体の読み込みと取り合いになってここに落ちる */
    el.addEventListener("stalled", sync)
    el.addEventListener("error", sync)
    document.addEventListener("visibilitychange", sync)
    /* 指が触れた瞬間にも掛け直す。低電力モードなどで自動再生を断られている時でも、
       「人が触った流れの中から呼んだ play()」は許される。触った時に動き出すのは
       自然に見えるし、触らなければ静止画のままで、どちらでも破綻しない */
    document.addEventListener("pointerdown", sync)
    return () => {
      clearTimeout(timer)
      el.removeEventListener("canplay", sync)
      el.removeEventListener("loadeddata", sync)
      el.removeEventListener("stalled", sync)
      el.removeEventListener("error", sync)
      document.removeEventListener("visibilitychange", sync)
      document.removeEventListener("pointerdown", sync)
    }
  }, [playing, slide.rate])

  return (
    <video
      ref={ref}
      /* autoPlay 属性は付けない。付けると、このセクションがまだ画面のはるか下に
         いる時点で7枚ぶんの動画が一斉に取りに行き、ページ本体の読み込みと
         回線を取り合う。読み込みの途中でここまでスクロールされると、その
         取り合いのまっただ中で再生を求めることになり、たいてい間に合わない。
         再生は下の useEffect が「画面に入ってから」掛ける。preload="none" と
         合わせて、ここへ来るまで動画は1バイトも取りに行かない。
         その間に見えているのは poster の静止画なので、絵が欠けることはない */
      loop
      muted
      playsInline
      preload="none"
      poster={slide.still}
      src={slide.video}
      className="bg-video absolute inset-0 w-full h-full object-cover"
      style={slide.tint ? { mixBlendMode: "multiply" } : undefined}
    />
  )
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 5l7 7-7 7" />
    </svg>
  )
}

/** 動きを2段に分ける。①畳んで真ん中まで運ぶ → ②着いてから横に広げる。
    同時にやると「大きくなりながら滑っていく」だけで、どこへ移ったのかも
    どこが伸びたのかも読み取れない。順番に起きると、目が1つずつ追える。
    ※下の 640ms と必ず揃えること。Tailwind はソースの文字列をそのまま読むので、
      duration-[...] をテンプレートリテラルで組み立てるとクラスが生成されず動きが消える */
const PHASE_MS = 640
/** ①が終わってから②を始めるまでの間。0 にすると、タイマーの誤差で
    まだ移動し終わっていない位置から広がり始めることがあり、そこがカクつく。
    真ん中で一度止まって見えるので、動きの意図も伝わりやすい */
const HOLD_MS = 90

/** 速さと曲線は全部そろえる（easeInOutSine）。
    transition-all は「動かしうる全プロパティ」を毎フレーム見に行くので、
    実際に変える分だけを名指しする。ここが効くのは②の広がりの滑らかさ。

    曲線を easeInOutCubic（0.65,0,0.35,1）から easeInOutSine（0.37,0,0.63,1）へ
    落としてある。カクつきは「1フレームでどれだけ飛ぶか」で決まり、真ん中の
    いちばん速い瞬間の速度は cubic が平均の3倍、sine は1.57倍。同じ640msでも
    最速フレームの移動量が半分になるので、スマホのように毎フレーム間に合わない
    端末ほど効く。キビキビ感を戻したい時はここを 0.65,0,0.35,1 に返せばいい */
const EASE = "duration-[640ms] ease-[cubic-bezier(0.37,0,0.63,1)] motion-reduce:transition-none"
/** カード本体：位置は transform（描画のやり直しが要らない）／大きさと角丸だけ実寸で動かす */
const MOVE_BOX = `transition-[transform,width,height,border-radius] ${EASE}`
const MOVE_EDGE = `transition-[border-radius,border-color] ${EASE}`
const MOVE_TEXT = `transition-[width,padding] ${EASE}`
const MOVE_TYPE = `transition-[font-size,color] ${EASE}`
/** 文字が奥から前へ飛び込んでくる時の曲線。終わりぎわに等倍を少し超えてから戻る
    （overshoot）。奥から出てくる動きをそのまま等速で止めると、板が壁に貼り付いた
    ように見えて、飛び込んだ感じが出ない。行き過ぎて戻ると、勢いを持って
    着地したように読める。
    畳むのはスマホだけなので、この曲線もスマホだけ。PCは md: で元の
    easeInOutSine に戻す（PCの見出しは常に出ていて、大きさが変わるだけなので、
    そこが跳ねると落ち着かない）
    ※Tailwind v4 の scale-* は transform ではなく単独の scale プロパティを出す。
      transition の名指しも scale と書く（transform と書くと動かない） */
const DIVE = "duration-[520ms] ease-[cubic-bezier(0.2,1.25,0.4,1)] md:duration-[640ms] md:ease-[cubic-bezier(0.37,0,0.63,1)] motion-reduce:transition-none"
/** 見出し（和文）。スマホでは待機中に畳んでしまうので、大きさと色に加えて
    濃さ・高さ・上の余白・奥行き（scale）も動かす。
    PCでは畳まないので font-size と color しか変わらない */
const MOVE_TITLE = `transition-[font-size,color,opacity,max-height,margin-top,scale] ${DIVE}`
const MOVE_BODY = `transition-[opacity,max-height,margin-top,scale] ${DIVE}`
const MOVE_FILM = `transition-opacity ${EASE}`

/* ── 登場（スクロールで画面に入った時）─────────────────────────────
   動かすのはカテゴリのカードそのもの。棚（カルーセルの外枠）は動かさない。
     ①カードが1枚ずつ、外側から順に下から立ち上がる（DEAL）
     ②真ん中が着地しきる前に、01 が開き始める（OPEN_MS）
   外枠ごと持ち上げると、中身が一緒に上がるだけで「カテゴリが出てきた」ようには
   見えない。1枚ずつ別々に上がって初めて、4つあることが動きで伝わる。

   ②がこの節の肝。カルーセル本来の「広がる」動きを登場のうちに一度見せておくと、
   丸いカードが押せるものだと説明なしで伝わる。ラベルも矢印も足さずに済む。

   曲線は easeOutQuint。カルーセルの中の動き（640ms / easeInOutCubic）より
   長く・別の曲線にして、「現れる」と「運ぶ」を速さでも区別する。

   ※動かす対象は transform ではなく translate。Tailwind v4 の translate-y-* は
     transform ではなく単独の translate プロパティを出すので、transform と書くと
     濃さだけ変わって位置は一瞬で飛ぶ（＝持ち上がりが消える）
   ※duration は必ずリテラルで書く。テンプレートリテラルで組み立てると Tailwind が
     ソースを文字列として読めずクラスが生成されず、動きが黙って消える。
     間隔と待ち時間だけは数値が要るので、下の定数から style で渡している */
const CURVE = "ease-[cubic-bezier(0.22,1,0.36,1)]"
/** カードが1枚ずつ立ち上がる間隔。外側が先、真ん中が最後 */
const DEAL_STEP = 55
/** 01 が開き始めるまで。真ん中のカードが完全に止まるのを待たず、まだ最後の数pxを
    詰めている途中で開き始める。着地を待ってから開くと、そこで一拍空いて
    「動きが終わった、と思ったらまた始まった」に見える。
    ※これ以上は詰めない。真ん中のカードが上へ動いている最中に開き始めると、
      台紙側の移動（transform・GPU）と幅の変化（レイアウト・メインスレッド）が
      重なる。以前カルーセルがカクついていたのが正にこの重なりだった */
const OPEN_MS = 600

/* motion-reduce:opacity-100 / translate-y-0 を必ず添える。transition だけ切ると、
   濃さ0・位置ずれのまま固まって中身が読めなくなる */
const REST = "motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0"
/** 見出しの外側・操作列。カードとは別に、自分が画面に入った時に持ち上がる */
const RISE = `transition-[opacity,translate] duration-[1000ms] ${CURVE} ${REST}`
/** ①カテゴリのカード。64px 下から立ち上げる。この距離を出すために
    カルーセル外枠の overflow-hidden を外してある（横の切り取りは section 側が持つ） */
const DEAL = `transition-[opacity,translate] duration-[900ms] ${CURVE} ${REST}`
/** 見出しは幕。濃さを変えずに、下に隠れていた文字が枠の中へ入ってくる。
    薄い文字が宙に浮いて出るのと違って、輪郭が最初から最後まではっきりしている */
const VEIL = `transition-[translate] duration-[1000ms] ${CURVE} motion-reduce:transition-none motion-reduce:translate-y-0`

export function BusinessSection() {
  /* 第2引数の true ＝ 画面から完全に外れたら戻す。上へスクロールして戻ってきた時に
     もう一度、同じ順序で立ち上がる。ここだけの指定で、他のセクションは従来どおり
     一度きり（既定は false） */
  const { ref, isVisible } = useScrollAnimation(0.1, true)
  /* 見出し・カルーセル・操作列は縦に700px以上離れているので、それぞれ自分が画面に
     入った時に持ち上げる。導入文の ref を3つで共有すると、カルーセルはまだ画面の
     外にいるうちに動き終わってしまい、スクロールして辿り着いた時には出た後になる */
  const { ref: stageRef, isVisible: stageIn } = useScrollAnimation(0.2, true)
  const { ref: toolsRef, isVisible: toolsIn } = useScrollAnimation(0.1, true)
  /** 通し番号。端で止めずに増減させて、04 の次は 01 に戻す */
  const [active, setActive] = useState(0)
  /** 広がっている1枚。active から PHASE_MS だけ遅れて追いつく（null＝全部が丸のまま移動中）。
      最初は null＝畳んだ状態で置いておき、登場しきってから 01 が自分で開く */
  const [expanded, setExpanded] = useState<number | null>(null)
  /** 素材を載せているカード。畳んでいる間も前の絵を残して、消えるところまで見せる */
  const [film, setFilm] = useState(0)
  const [size, setSize] = useState(() => sizeFor(1440))
  const touchX = useRef<number | null>(null)
  /** 直前の指が「払った」のか「押した」のか。カード全面がリンクなので、横に払った時に
      touchend のあと click が続けて飛んで、めくったつもりが別ページへ行ってしまう。
      払ったと判定した回だけリンク側で止める */
  const swiped = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    // clientWidth はスクロールバーを除いた実際の描画幅
    const apply = () => setSize(sizeFor(document.documentElement.clientWidth))
    apply()
    window.addEventListener("resize", apply)
    return () => window.removeEventListener("resize", apply)
  }, [])

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  /* 登場の締めくくり。カードが立ち上がりきる手前で 01 が自分で開く。
     タイマーは timers に積むので、途中で来訪者が別のカードを押したら goTo 側で
     まとめて止まる＝勝手に 01 へ戻されることがない */
  useEffect(() => {
    /* 画面から完全に外れたら、開く前の状態まで巻き戻す。カードは画面の外で
       静かに畳まれ、次に上から降りてきた時にまた 01 が開くところから見られる。
       expanded だけ戻して active を残すと、2回目は 03 を選んだまま 01 が開いて
       別のカードへ飛ぶ動きになる */
    if (!stageIn) {
      timers.current.forEach(clearTimeout)
      timers.current = []
      setActive(0)
      setExpanded(null)
      setFilm(0)
      return
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setExpanded(0)
      return
    }
    const t = setTimeout(() => setExpanded(0), OPEN_MS)
    timers.current.push(t)
    return () => clearTimeout(t)
  }, [stageIn])

  /** ①広がっている1枚を丸に畳む＋目的のカードを中央へ運ぶ → ②着いてから横に広げる */
  const goTo = useCallback((v: number) => {
    if (v === active) return
    timers.current.forEach(clearTimeout)
    timers.current = [
      // ② 移動しきって、少し置いてから広げる
      setTimeout(() => setExpanded(v), PHASE_MS + HOLD_MS),
      // 前の素材を外すのは動きが全部終わってから。広がり始めと同時に <video> を
      // 捨てると、その瞬間だけフレームが飛ぶ（＝広がり方がカクつく）
      setTimeout(() => setFilm(v), PHASE_MS + HOLD_MS + PHASE_MS + 60),
    ]
    setExpanded(null)
    setActive(v)
  }, [active])

  // 両脇を空けないため、実際のカテゴリ数より多く並べて剰余で中身を決める
  const at = (v: number) => slides[((v % slides.length) + slides.length) % slides.length]
  const band = Array.from({ length: 7 }, (_, k) => active - 3 + k)

  /** i番目のカテゴリへ、いまの位置から近い方向へ動く通し番号 */
  const nearest = (i: number) => {
    const n = slides.length
    const here = ((active % n) + n) % n
    const half = Math.floor(n / 2)
    return active + ((i - here + n + half) % n) - half
  }

  /* カードは「左端」ではなく「中心」で置く。ここが引っかかりの元だった：
     左端で置くと、②で広がるときに幅（レイアウト計算・メインスレッド）と
     台紙の移動（transform・GPU）を打ち消し合わせて中心を保つ必要があり、
     この2つは別々のタイミングで進むので、中央のカードが1フレームごとに
     数pxずれる＝カクついて見える。中心で置けば、幅が増えれば勝手に左右へ
     均等に開くので、②で台紙を動かす必要そのものが無くなる */
  const pillCenter = (v: number) => v * (size.pillW + size.gap) + size.pillW / 2
  const grow = size.activeW - size.pillW
  /** 広がっている1枚に押しのけられた後の中心。広がる本人の中心は動かない */
  const centerOf = (v: number) => {
    if (expanded === null || v === expanded) return pillCenter(v)
    return pillCenter(v) + (v > expanded ? grow / 2 : -grow / 2)
  }
  /** 台紙は①でしか動かない。②のあいだは完全に静止する */
  const trackShift = -pillCenter(active)

  const current = at(active)

  return (
    <section id="business" className="relative overflow-hidden pt-20 md:pt-24 pb-16 md:pb-20">
      <div>

        {/* 背景：選択中のカテゴリの絵を大きくぼかしたもの */}
        <div className="absolute inset-0 bg-white">
          {slides.map((slide) =>
            slide.tint ? (
              <div
                key={slide.num}
                aria-hidden
                className="absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none"
                style={{ background: slide.tint, opacity: at(active) === slide ? 1 : 0 }}
              />
            ) : (
              <img
                key={slide.num}
                src={slide.still}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 motion-reduce:transition-none"
                style={{ filter: "blur(56px)", transform: "scale(1.25)", opacity: at(active) === slide ? 1 : 0 }}
              />
            )
          )}
          <div className="absolute inset-0 bg-white/70" />
        </div>

        {/* 導入 */}
        <div ref={ref} className="relative z-10 max-w-[900px] mx-auto px-5 mb-8 md:mb-10">
          {/* 枠で切り取っておいて、中身を自分の高さ分だけ下へ隠す（translate-y-full）。
              入ってくるのは位置だけで、濃さは最初から1。文字の輪郭が途中でぼやけない */}
          <div className="overflow-hidden mb-4">
            <p className={`text-center font-display font-light text-xs tracking-[0.2em] uppercase text-[#5fb8ab] leading-[1.6] ${VEIL} ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
              BUSINESS
            </p>
          </div>
          <div className="overflow-hidden">
            <h2
              className={`text-center text-navy font-bold text-2xl md:text-3xl leading-relaxed ${VEIL} ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
              style={{ transitionDelay: "120ms" }}
            >
              Allovvは4つの領域で<br className="md:hidden" />
              AIを社会に実装します。
            </h2>
          </div>
        </div>

        <div
          ref={stageRef}
          /* この外枠は動かさない。登場は中のカード1枚ずつが受け持つ（DEAL）。
             overflow-hidden も付けない。付けるとカードが立ち上がる途中で下端を
             切られる。横にはみ出す分は section 側の overflow-hidden が切っている */
          className="relative z-10 w-full"
          style={{ height: size.activeH + 16 }}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; swiped.current = false }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(dx) > 50) {
              swiped.current = true
              goTo(active + (dx < 0 ? 1 : -1))
            }
            touchX.current = null
          }}
        >
          <div
            /* 台紙が動くのは①だけ。目的のカードを中央へ運んだら、あとは静止する。
               ②で台紙とカードの幅が同時に動くと、GPU側とレイアウト側で進み方がズレる */
            className="absolute top-1/2 left-1/2 transition-transform duration-[640ms] ease-[cubic-bezier(0.37,0,0.63,1)] motion-reduce:transition-none"
            /* will-change でこの層をGPU側に預けておく。付けないと動き出しの1フレーム目で
               レイヤーを作り直すので、スマホでは最初のひと押しだけ引っかかる */
            style={{ transform: `translate(${trackShift}px, -50%)`, willChange: "transform" }}
          >
            {band.map((v, k) => {
              const slide = at(v)
              /* 外側から内側へ順に決まる。真ん中（k=3）が最後で、そこから 01 が開く。
                 内側から先に出すと、真ん中がとっくに決まった後で外側がまだ動いていて、
                 目がどこを見ていればいいのか分からない */
              const dealDelay = (3 - Math.abs(k - 3)) * DEAL_STEP
              /* 広がるかどうかは active ではなく expanded で決める。
                 移動中は選択済みのカードもまだ丸のまま＝①と②が混ざらない */
              const isActive = v === expanded
              /* rounded-full だと半径が高さの半分で頭打ちになり、両端が丸いカプセルになる。
                 参考サイトは上下左右に直線が残る角丸なので、横と縦の半径を別々に指定する */
              const radius = isActive ? "30% / 35%" : "48% / 34%"
              /* 中心を transform で置き、最後の translateX(-50%) で自分の幅の半分だけ戻す。
                 この -50% は幅から計算されるので、幅が変わればブラウザが同じ工程で
                 位置も計算し直す＝幅と位置がズレようがない。px で書くとこの2つが
                 別々に進んでしまい、広がるあいだ中心が小刻みに揺れる */
              const box = {
                borderRadius: radius,
                transform: `translate(${centerOf(v)}px, -50%) translateX(-50%)`,
                width: isActive ? size.activeW : size.pillW,
                height: isActive ? size.activeH : size.pillH,
                /* 移動はGPU側に預ける。7枚とも毎回 transform が変わるので、
                   1枚ずつレイヤーを持たせたほうが総量では軽い */
                willChange: "transform",
                /* このカードの中で起きたレイアウトと描画を、カードの外へ波及させない。
                   幅と高さを毎フレーム動かしているので、これが無いと1フレームごとに
                   ページ側まで計算し直しになる */
                contain: "layout paint" as const,
              }

              /* どのカードも同じ形（div）で、中の文字も同じ並びで置く。
                 選択中だけ別の要素にすると、メインに来た瞬間にカードごと作り直しになり、
                 文字がいったん消えてから出てくる。それを避けて、そのまま大きくする */
              return (
                <div
                  key={v}
                  /* 登場だけを受け持つ外枠。位置は中の transform、登場はこちらの translate と、
                     別のプロパティに分けてある（CSS は translate → transform の順に適用するので
                     混ざらない）。同じ transform に相乗りさせると、カードが中央へ運ばれるたびに
                     登場のぶんだけ位置がずれる */
                  className={`absolute top-0 left-0 ${DEAL} ${stageIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                  style={{ transitionDelay: `${dealDelay}ms` }}
                >
                <div
                  className={`absolute top-0 left-0 overflow-hidden ${MOVE_BOX}`}
                  style={box}
                >
                  {/* 素材は「いま広がっている1枚」と「これから広がる1枚」の両方を置いておき、
                      濃さだけ入れ替える。①で前の絵が消えていき、②で新しい絵が現れる。
                      出す瞬間に <video> を作ると、その場でパッと絵が出てしまう */}
                  {(v === active || v === film) && (
                    <div
                      /* 素材の入れ物は最初から広がったときの大きさで置いておき、
                         カード側の overflow-hidden で切り取る。inset-0 で追従させると
                         広がるあいだ毎フレーム動画を拡大し直すことになり、そこが重い */
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${MOVE_FILM}`}
                      style={{ width: size.activeW, height: size.activeH, opacity: isActive ? 1 : 0 }}
                      aria-hidden={!isActive}
                    >
                      {slide.tint && <div className="absolute inset-0" style={{ background: slide.tint }} />}
                      <CardVideo key={slide.video} slide={slide} playing={stageIn} />
                      {/* 素材は沈めず、文字が乗る分だけ白を薄くかける */}
                      <div className={slide.tint ? "absolute inset-0 bg-white/20" : "absolute inset-0 bg-white/35"} />
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 border ${MOVE_EDGE}`}
                    style={{ borderRadius: radius, borderColor: isActive ? "rgba(15,30,36,0.10)" : "rgba(15,30,36,0.25)" }}
                  />

                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center ${MOVE_TEXT} ${isActive ? 'px-6 md:px-20 select-text' : 'px-5 md:px-8'}`}
                    style={{ width: isActive ? size.activeW : size.pillW }}
                  >
                    {/* 文字も箱と同じ速さで大きくなる。クラスを入れ替えるだけだと文字サイズが
                        0秒で切り替わり、箱がまだ小さいうちに大きい文字が入って見切れる。
                        ＝「文字が消えて、あとから出てくる」ように見えていた原因 */}
                    <span className={`font-display text-[11px] tracking-[0.22em] ${MOVE_TYPE} ${isActive ? 'text-[#0b6b4f]' : 'text-navy/45'}`}>
                      {slide.num}
                    </span>
                    <span className={`mt-3 font-display tracking-[0.28em] ${MOVE_TYPE} ${isActive ? 'text-[11px] md:text-xs text-navy/45' : 'text-[9px] md:text-[10px] text-navy/35'}`}>
                      {slide.label}
                    </span>
                    {/* 折り返しはブラウザ任せにしない。「AIクリエイティブ制作」を
                        スマホ幅に流し込むと「AIクリエイティ／ブ制作」のように語中で切れる。
                        意味の切れ目で1要素ずつ置いて、スマホは1行ずつ・PCは横に並べて1行。
                        1要素だけの title（AI仕組み化・ホームページ制作）はそのまま1行 */}
                    {/* スマホでは、横で待っているカードに和文を載せない。小さい丸の中で
                        13px の日本語は読めるほどの大きさが無く、読めない文字が3枚ぶん
                        並ぶと画面がただ混む。番号と英字だけにすると、待機中は「何が何番か」
                        だけを示す標識になり、開いた1枚に和文が集まる。
                        出るのは箱が広がりきってから（delay）。広がりながら文字も出ると
                        2つの動きが重なって、どちらも読み取れない。
                        PCは畳まない（md: で元に戻す）。横幅に余裕があり、待機中の
                        カードも十分な大きさで和文が読めるため */}
                    <span
                      className={`block overflow-hidden text-navy font-bold leading-[1.5] tracking-[0.06em] ${MOVE_TITLE} ${isActive
                        ? 'text-[21px] md:text-[30px] opacity-100 max-h-[140px] mt-3 scale-100 delay-[380ms] md:delay-0'
                        : 'text-[13px] md:text-[15px] opacity-0 max-h-0 mt-0 scale-[0.7] md:scale-100 delay-0 md:opacity-100 md:max-h-[140px] md:mt-3'}`}
                    >
                      {slide.title.map((part) => (
                        <span key={part} className="block md:inline">{part}</span>
                      ))}
                    </span>
                    {/* 待機中も同じ要素を残しておき、高さと濃さだけ動かす。
                        display:none で出し入れすると、移動が始まる前に文字が消える／現れる */}
                    <span
                      /* 本文も見出しと同じで、スマホでは箱が広がりきってから出す。
                         見出しより少し遅らせて、番号→見出し→本文の順に目が動くようにする */
                      className={`block overflow-hidden text-navy/65 text-[14px] md:text-[16px] leading-[1.9] tracking-[0.04em] ${MOVE_BODY} ${isActive ? 'scale-100 delay-[500ms] md:delay-0' : 'scale-[0.82] md:scale-100 delay-0'}`}
                      style={isActive
                        ? { opacity: 1, maxHeight: 240, marginTop: 16 }
                        : { opacity: 0, maxHeight: 0, marginTop: 0 }}
                      aria-hidden={!isActive}
                    >
                      {slide.statement.map((clause) => (
                        <span key={clause} className="block whitespace-nowrap">{clause}</span>
                      ))}
                    </span>

                    {/* 着手順。本文よりさらに一拍おいて出し、番号→見出し→本文→順番の流れにする。
                        主役は本文なので、語は navy/55・矢印は navy/30 まで下げて線として敷く。
                        矢印は読み上げから外す（「→」を読み上げても順番は伝わらない） */}
                    {slide.steps && (
                      <span
                        className={`flex flex-wrap items-center justify-center gap-x-2 overflow-hidden text-navy/55 text-[12px] md:text-[13px] tracking-[0.08em] font-medium ${MOVE_BODY} ${isActive ? 'scale-100 delay-[600ms] md:delay-0' : 'scale-[0.82] md:scale-100 delay-0'}`}
                        style={isActive
                          ? { opacity: 1, maxHeight: 60, marginTop: 14 }
                          : { opacity: 0, maxHeight: 0, marginTop: 0 }}
                        aria-hidden={!isActive}
                      >
                        {slide.steps.map((step, i) => (
                          <span key={step} className="flex items-center gap-x-2 whitespace-nowrap">
                            {i > 0 && <span aria-hidden="true" className="text-navy/30">→</span>}
                            {step}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>

                  {/* 待機中のカードは全面を押せるようにする。文字の上に透明なボタンを重ねるので、
                      文字そのものは作り直されない */}
                  {!isActive && (
                    <button
                      type="button"
                      onClick={() => goTo(v)}
                      aria-label={`${slide.num} ${slide.title.join("")}`}
                      className="absolute inset-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f1e24] focus-visible:ring-offset-2"
                      style={{ borderRadius: radius }}
                    />
                  )}

                  {/* 開いているカードは、スマホだけ全面が行き先へのリンクになる。
                      指にはホバーが無いので、カードを押しても何も起きず、下のCTAまで
                      下りて小さい文字を狙うしか行き先に触れる方法が無かった。
                      PC側には付けない（md:hidden）。カードの本文は選択できるようにして
                      あるので、透明なリンクを重ねるとそれを潰してしまう */}
                  {isActive && (
                    <Link
                      href={slide.href}
                      {...(slide.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      aria-label={`${slide.title.join("")}｜${slide.cta}`}
                      onClick={(e) => { if (swiped.current) e.preventDefault() }}
                      className="md:hidden absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f1e24]"
                      style={{ borderRadius: radius }}
                    />
                  )}
                </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 操作と、選択中のカテゴリの行き先 */}
        <div
          ref={toolsRef}
          className={`relative z-10 max-w-[1200px] w-full mx-auto px-5 mt-10 md:mt-12 flex flex-col md:flex-row md:items-center gap-5 ${RISE} ${toolsIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >

          <div className="flex items-center gap-5 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              {[-1, 1].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => goTo(active + d)}
                  aria-label={d < 0 ? "前のカテゴリ" : "次のカテゴリ"}
                  className="w-9 h-9 rounded-full border border-[#0f1e24]/20 text-navy/70 flex items-center justify-center hover:bg-[#0f1e24] hover:text-white hover:border-[#0f1e24] transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f1e24] focus-visible:ring-offset-2"
                >
                  <span className={d < 0 ? "rotate-180" : ""}><ArrowIcon /></span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              {slides.map((slide, i) => (
                <button
                  key={slide.num}
                  type="button"
                  onClick={() => goTo(nearest(i))}
                  aria-label={slide.title.join("")}
                  aria-current={slide === current}
                  className="p-1.5 -m-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f1e24]"
                >
                  <span
                    className={`block w-1.5 h-1.5 rounded-full transition-colors motion-reduce:transition-none ${slide === current ? 'bg-[#0f1e24]' : 'bg-[#0f1e24]/25'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="md:ml-auto flex flex-col md:flex-row md:items-center gap-2 md:gap-8 text-center md:text-right">
            <p className="text-navy/55 text-xs">{current.price}</p>
            <Link
              href={current.href}
              {...(current.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex items-center justify-center md:justify-end gap-2 text-navy text-sm font-medium border-b border-[#0f1e24]/25 pb-2 hover:gap-3 hover:border-[#0f1e24] transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f1e24] focus-visible:ring-offset-2"
            >
              {current.cta}
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
