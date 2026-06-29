"use client"

import { useState } from "react"

const GOLD = "#c9a84c"
const GOLD_LIGHT = "#e8c87a"
const DARK_BG = "#0d0d0d"
const CARD_BG = "#161616"
const CARD_BG2 = "#1c1c1c"

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <nav style={{ background: DARK_BG }} className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4">
      <div>
        <div className="text-white font-bold text-sm tracking-widest leading-none">CREATE YOUR STORY.</div>
        <div className="text-white/50 text-[9px] tracking-[0.3em] mt-0.5">PROFESSIONAL WEBSITE</div>
      </div>
      <button onClick={() => setOpen(!open)} className="flex flex-col gap-1.5 p-2" aria-label="メニュー">
        <span className="block w-6 h-0.5 bg-white" />
        <span className="block w-6 h-0.5 bg-white" />
        <span className="block w-4 h-0.5 bg-white" />
      </button>
      {open && (
        <div style={{ background: "#0d0d0dee" }} className="fixed inset-0 top-14 flex flex-col items-center justify-center gap-8 z-50">
          {["TOP","サービス","料金","よくある質問","お問い合わせ"].map(item => (
            <button key={item} onClick={() => setOpen(false)} style={{ color: GOLD }} className="text-xl tracking-widest font-light">{item}</button>
          ))}
        </div>
      )}
    </nav>
  )
}

function CTAButton({ label = "無料相談はこちら", sub }: { label?: string; sub?: string }) {
  return (
    <a href="#contact" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #a87d2a 100%)` }}
      className="flex items-center justify-between w-full max-w-sm mx-auto rounded-full px-7 py-4 text-white font-bold text-base shadow-lg active:scale-95 transition-transform">
      <span>{label}</span>
      {sub && <span className="text-xs text-white/70 ml-2 text-right leading-tight">{sub}</span>}
      <svg className="ml-2 shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 10h12M10 4l6 6-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  )
}

/* ── 1. FV ── */
function HeroSection() {
  return (
    <section style={{ background: DARK_BG }} className="relative min-h-screen flex flex-col pt-16 overflow-hidden">
      {/* Top 3 photos grid */}
      <div className="grid grid-cols-3 h-64">
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(160deg,#1a1a1a,#2a2320)" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
            <div style={{ background: "linear-gradient(180deg,transparent 40%,rgba(0,0,0,.8))" }} className="absolute inset-0" />
            <div className="relative z-10 text-center">
              <div className="text-white text-xs tracking-[0.2em] font-light">ACTOR</div>
              <div className="text-white/60 text-[10px] tracking-wider">俳優</div>
            </div>
          </div>
          <div className="w-full h-full" style={{ background: "linear-gradient(160deg,#1e1812,#2d2419,#1a1510)" }} />
        </div>
        <div className="relative overflow-hidden border-x border-white/10" style={{ background: "linear-gradient(160deg,#1a1a1a,#2a2320)" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
            <div style={{ background: "linear-gradient(180deg,transparent 40%,rgba(0,0,0,.8))" }} className="absolute inset-0" />
            <div className="relative z-10 text-center">
              <div className="text-white text-xs tracking-[0.2em] font-light">MODEL</div>
              <div className="text-white/60 text-[10px] tracking-wider">モデル</div>
            </div>
          </div>
          <div className="w-full h-full" style={{ background: "linear-gradient(160deg,#1a1612,#232019,#181410)" }} />
        </div>
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(160deg,#0e1520,#1a2235)" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
            <div style={{ background: "linear-gradient(180deg,transparent 40%,rgba(0,0,0,.8))" }} className="absolute inset-0" />
            <div className="relative z-10 text-center">
              <div className="text-white text-xs tracking-[0.2em] font-light">SINGER</div>
              <div className="text-white/60 text-[10px] tracking-wider">シンガー</div>
            </div>
          </div>
          <div className="w-full h-full" style={{ background: "linear-gradient(160deg,#0e1525,#1b2540,#0d1020)" }} />
        </div>
      </div>

      {/* Hero copy */}
      <div className="px-6 pt-10 pb-8 text-center">
        <h1 className="text-white text-3xl font-bold leading-snug tracking-tight mb-2">
          あなたの魅力を、<br />
          <span style={{ color: GOLD }} className="text-4xl">「伝わるカタチ」</span>に。
        </h1>
        <div className="mt-4 text-white/60 text-sm tracking-wide border border-white/20 inline-block px-4 py-2 rounded">
          フリーランスのための、戦略的ホームページ制作
        </div>
      </div>

      {/* Mockup */}
      <div className="px-6 pb-8 flex justify-center">
        <div className="relative w-full max-w-xs">
          <div style={{ background: "#1a1a1a", border: "1px solid #333" }} className="rounded-lg p-4 shadow-2xl">
            <div className="flex gap-1 mb-3">
              {["HOME","PROFILE","WORKS","NEWS","CONTACT"].map(t => (
                <span key={t} className="text-[7px] text-white/40 font-light">{t}</span>
              ))}
            </div>
            <div style={{ background: "linear-gradient(160deg,#1e1812,#2d2419)" }} className="rounded h-28 flex flex-col justify-end p-3">
              <div className="text-white font-bold text-base tracking-widest">KENJI MIZUNO</div>
              <div style={{ color: GOLD }} className="text-xs tracking-widest">ACTOR</div>
            </div>
          </div>
          <div style={{ background: "#1a1a1a", border: "1px solid #333" }} className="absolute -right-4 bottom-4 rounded-lg p-3 shadow-2xl w-28">
            <div style={{ background: "linear-gradient(160deg,#1a1612,#232019)" }} className="rounded h-20 flex flex-col justify-between p-2">
              <div className="text-white font-bold text-[10px] tracking-wider">ANNA<br />MIZUKI</div>
              <div style={{ color: GOLD }} className="text-[9px] tracking-widest">MODEL</div>
            </div>
            <div className="mt-2 text-white/60 text-[8px] text-center">PROFILE</div>
          </div>
        </div>
      </div>

      {/* 3 icons */}
      <div style={{ background: "#111" }} className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
        {[
          { icon: "★", text: "あなたの魅力を\n最大限に表現" },
          { icon: "▣", text: "スマホ対応で\nいつでもどこでも" },
          { icon: "⚇", text: "オーディション・\nキャスティングに強い" },
        ].map(({ icon, text }) => (
          <div key={text} className="flex flex-col items-center gap-2 py-4 px-2 text-center">
            <span style={{ color: GOLD }} className="text-xl">{icon}</span>
            <span className="text-white/70 text-[10px] leading-relaxed whitespace-pre-line">{text}</span>
          </div>
        ))}
      </div>

      {/* 90% data teaser */}
      <div style={{ background: CARD_BG }} className="mx-4 my-6 rounded-xl p-6">
        <p className="text-white text-sm text-center leading-relaxed mb-1">
          「 ホームページは<span style={{ color: GOLD }} className="font-bold">本気度を伝えるツール</span>だ。 」
        </p>
        <p className="text-white/50 text-xs text-center leading-relaxed">
          キャスティングや監督が適役を見つける時に大きく左右されるのが、<br />
          HPができていて、あなたの本気度、表現力で決めると答えた人は
        </p>
        <div className="flex items-baseline justify-center gap-2 mt-4">
          <span style={{ color: GOLD }} className="text-5xl font-bold">90</span>
          <span style={{ color: GOLD }} className="text-2xl">%</span>
          <div className="text-right ml-2">
            <p className="text-white font-bold text-lg leading-tight">どうせやるなら、<br />早い方がいい。</p>
          </div>
        </div>
        <p className="text-white/40 text-[10px] text-center mt-1">アンケート調べ</p>
      </div>

      {/* Price + CTA */}
      <div className="px-6 pb-4 text-center">
        <p className="text-white/50 text-xs mb-1">\ 対象者限定 ／</p>
        <p className="text-white text-sm mb-0.5">ホームページ制作</p>
        <p style={{ color: GOLD }} className="text-3xl font-bold mb-6">5万円〜</p>
        <CTAButton label="まずは無料で相談する" sub="あなたの魅力を最大限に\n引き出すご提案をします" />
      </div>
    </section>
  )
}

/* ── 2. 共感（問題提起）── */
function PainSection() {
  const items = [
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="8" y="4" width="24" height="32" rx="3" stroke={GOLD} strokeWidth="1.5"/>
          <circle cx="20" cy="28" r="2" fill={GOLD}/>
          <path d="M15 12h10M15 17h7" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M24 8l4 4-4 4" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      text: "オーディションで\n手応えがあったのに、\nなぜか落選してしまう…",
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="10" y="6" width="20" height="28" rx="3" stroke={GOLD} strokeWidth="1.5"/>
          <path d="M16 16c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" stroke={GOLD} strokeWidth="1.5"/>
          <path d="M15 28h10" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      text: "SNS発信\n（InstagramやX）は\n頑張っているけれど、\nプロとしての仕事に\n繋がらない…",
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="7" y="8" width="26" height="24" rx="3" stroke={GOLD} strokeWidth="1.5"/>
          <circle cx="15" cy="18" r="4" stroke={GOLD} strokeWidth="1.5"/>
          <path d="M23 16h7M23 21h5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M9 27h22" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      text: "自分の過去の実績や\n「本当の表現力」を、\n１箇所にまとめて\nアピールできる\n場所がない…",
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <circle cx="20" cy="16" r="7" stroke={GOLD} strokeWidth="1.5"/>
          <path d="M10 34c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="30" cy="12" r="4" stroke={GOLD} strokeWidth="1.5"/>
          <text x="27" y="15" fill={GOLD} fontSize="6" fontWeight="bold">?</text>
        </svg>
      ),
      text: "キャスティング担当者に、\n自分の「本気度」が\n本当に伝わっているか\n不安…",
    },
  ]

  return (
    <section style={{ background: DARK_BG }} className="pb-10 overflow-hidden">
      {/* Header with image overlay */}
      <div className="relative h-52 flex flex-col justify-center px-6" style={{ background: "linear-gradient(160deg,#1a1510,#0d0d0d)" }}>
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 80% 50%,#c9a84c22,transparent 70%)" }} />
        <p className="text-white/50 text-xs tracking-[0.3em] mb-2">DO YOU HAVE ANY OF THESE CONCERNS?</p>
        <h2 className="text-white text-2xl font-bold leading-tight">
          こんな<span style={{ color: GOLD }}>不安</span>や<br />
          <span style={{ color: GOLD }}>悔しい経験</span>、<br />
          ありませんか？
        </h2>
      </div>

      <div className="flex flex-col gap-3 px-4 mt-4">
        {items.map(({ icon, text }, i) => (
          <div key={i} style={{ background: CARD_BG, borderLeft: `3px solid ${GOLD}` }}
            className="rounded-xl overflow-hidden flex items-center gap-4 p-4">
            <div className="shrink-0">{icon}</div>
            <p style={{ color: GOLD }} className="font-bold text-sm leading-relaxed whitespace-pre-line">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── 3. 事実の提示（危機感）── */
function FactSection() {
  return (
    <section style={{ background: DARK_BG }} className="overflow-hidden">
      {/* Bold headline with image */}
      <div className="relative h-64 flex flex-col justify-center px-6 overflow-hidden" style={{ background: "linear-gradient(160deg,#1a1510,#0d0d0d)" }}>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30" style={{ background: "linear-gradient(to right,transparent,#1a1a1a)" }} />
        <h2 className="text-white text-4xl font-bold leading-tight tracking-tight relative z-10">
          本気じゃないなら、<br />
          <span style={{ color: GOLD }}>見もしない。</span>
        </h2>
        <p className="text-white/60 text-sm mt-4 relative z-10 leading-relaxed">
          キャスティング・監督の90%が断言。<br />
          あなたの合否を最後に決めるのは、<br />「公式ホームページ」の有無だった。
        </p>
      </div>

      {/* 90% circle */}
      <div style={{ background: CARD_BG }} className="mx-4 my-6 rounded-2xl p-6 flex gap-5 items-center">
        <div className="shrink-0 relative w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" stroke="#2a2a2a" strokeWidth="8" fill="none"/>
            <circle cx="50" cy="50" r="42" stroke={GOLD} strokeWidth="8" fill="none"
              strokeDasharray="263.9" strokeDashoffset="26.4" strokeLinecap="round"/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span style={{ color: GOLD }} className="text-3xl font-bold leading-none">90</span>
            <span style={{ color: GOLD }} className="text-sm">%</span>
            <span className="text-white/50 text-[9px] text-center leading-tight mt-1">クリエイター・<br />監督が回答</span>
          </div>
        </div>
        <div>
          <p className="text-white/70 text-sm leading-relaxed">
            独自のアンケート調査では、<br />実に9割のクリエイター・監督が<br />
            <span style={{ color: GOLD }} className="font-bold">「公式HPの完成度が、<br />適役を見つける（採用する）<br />最大の決め手になる」</span>と回答。
          </p>
        </div>
      </div>

      {/* Middle text */}
      <div className="px-6 py-6 text-center">
        <p className="text-white/70 text-sm leading-relaxed mb-4">
          どんなにオーディションで熱弁しても、<br />
          彼らが裏でチェックしているのは、
        </p>
        <h3 className="text-white text-2xl font-bold leading-snug">
          あなたの「<span style={{ color: GOLD }}>本気度</span>」と<br />
          「<span style={{ color: GOLD }}>表現力の証明</span>」です。
        </h3>
      </div>

      {/* 3 images */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-6">
        {[
          { label: "本気度を伝える", sub: "プロフィールや想いで、\nあなたの姿勢を証明。", bg: "linear-gradient(160deg,#1a1510,#2a2015)", accent: "DIRECTOR" },
          { label: "表現力を見せる", sub: "作品・実績を整理して、\n一瞬で魅力を伝える。", bg: "linear-gradient(160deg,#151a15,#202a20)", accent: "WORKS" },
          { label: "信頼を得る", sub: "プロ仕様のデザインで、\n信頼と安心感を獲得。", bg: "linear-gradient(160deg,#151520,#202030)", accent: "PROFILE" },
        ].map(({ label, sub, bg, accent }) => (
          <div key={label} className="flex flex-col">
            <div style={{ background: bg }} className="rounded-xl h-24 flex items-center justify-center mb-2">
              <span className="text-white/30 text-xs font-bold tracking-widest">{accent}</span>
            </div>
            <p style={{ color: GOLD }} className="text-xs font-bold text-center mb-1">{label}</p>
            <p className="text-white/50 text-[10px] text-center leading-relaxed whitespace-pre-line">{sub}</p>
          </div>
        ))}
      </div>

      <div className="px-6 pb-6 text-center">
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          SNSだけでは伝わらない、<br />
          プロとしての覚悟を、今すぐカタチにしませんか？
        </p>
        <CTAButton label="無料相談はこちら" sub="あなたの魅力を最大限に\n引き出すご提案をします" />
      </div>
    </section>
  )
}

/* ── 4. 解決策 ── */
function SolutionSection() {
  return (
    <section style={{ background: "#111" }} className="overflow-hidden">
      <div className="px-6 pt-10 pb-6">
        <div style={{ border: `1px solid ${GOLD}`, color: GOLD }} className="inline-block text-xs tracking-[0.3em] px-3 py-1 mb-6">
          SOLUTION
        </div>
        <h2 className="text-white text-2xl font-bold leading-snug mb-4">
          あなたの「<span style={{ color: GOLD }}>本気度</span>」と「<span style={{ color: GOLD }}>表現力</span>」を
        </h2>
        <div className="flex items-baseline gap-1 mb-2">
          <span style={{ color: GOLD }} className="text-6xl font-bold">120</span>
          <span style={{ color: GOLD }} className="text-3xl">%</span>
          <span className="text-white text-2xl font-bold ml-1">伝える、</span>
        </div>
        <p className="text-white text-xl font-bold leading-snug mb-4">
          あなただけの<span style={{ color: GOLD }}>公式ホームページ</span>を。
        </p>
        <p className="text-white/60 text-sm leading-relaxed">
          当サービスは、キャスティング側の視点を徹底的に分析した、<br />
          オーディション・仕事獲得特化型のHP/LP制作サービスです。
        </p>
      </div>

      {/* Mockup */}
      <div className="px-4 pb-8 flex justify-center">
        <div className="relative w-full max-w-xs">
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }} className="rounded-lg p-4 shadow-2xl">
            <div className="flex gap-1 mb-2">
              {["MOCE","PORTOLO","WORKS","NEWS","CONTACT"].map(t => (
                <span key={t} className="text-[6px] text-white/30 font-light">{t}</span>
              ))}
            </div>
            <div style={{ background: "linear-gradient(160deg,#1e1812,#2d2419)" }} className="rounded h-28 flex flex-col justify-end p-3">
              <div className="text-white font-bold text-base tracking-widest">KENJI MIZUNO</div>
              <div style={{ color: GOLD }} className="text-xs tracking-widest">ACTOR</div>
            </div>
          </div>
          {/* Phone mockup */}
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }} className="absolute -right-2 bottom-4 rounded-xl p-2 shadow-2xl w-24">
            <div style={{ background: "linear-gradient(160deg,#1a1612,#232019)" }} className="rounded-lg h-32 flex flex-col justify-between p-2">
              <div className="text-white font-bold text-[9px] tracking-wider">ANNA<br />MIZUKI</div>
              <div>
                <div style={{ color: GOLD }} className="text-[8px] tracking-widest mb-1">MODEL</div>
                <div className="grid grid-cols-3 gap-0.5">
                  {[["AGE","23"],["HEIGHT","168"],["BUST","83"],["WAIST","59"],["HIP","87"],["",""]].map(([k,v],i) => (
                    <div key={i} className="text-center">
                      <div className="text-white/30 text-[6px]">{k}</div>
                      <div className="text-white text-[7px] font-bold">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Badge */}
          <div style={{ background: GOLD, borderRadius: "50%" }} className="absolute -right-4 top-0 w-16 h-16 flex items-center justify-center shadow-xl">
            <p className="text-white text-[9px] font-bold text-center leading-tight">キャスティングに<br />強い構成・設計で<br />選ばれる人へ</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ background: DARK_BG }} className="px-6 py-8">
        <h3 className="text-white text-xl font-bold text-center leading-snug mb-6">
          キャスティング側が「<span style={{ color: GOLD }}>見たい情報</span>」を、<br />
          最適なカタチで届ける
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: (
                <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
                  <rect x="4" y="4" width="28" height="28" rx="4" stroke={GOLD} strokeWidth="1.5"/>
                  <circle cx="18" cy="15" r="5" stroke={GOLD} strokeWidth="1.5"/>
                  <path d="M8 28c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ),
              title: "第一印象で\n惹きつける",
              desc: "世界観・写真・動画を効果的に配し、あなたの魅力を瞬時に伝えます。",
            },
            {
              icon: (
                <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
                  <circle cx="18" cy="18" r="14" stroke={GOLD} strokeWidth="1.5"/>
                  <path d="M12 18h12M18 12v12" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ),
              title: "必要な情報に\nすぐアクセス",
              desc: "プロフィール・実績・コンタクト情報を見やすく整理し、迷わせません。",
            },
            {
              icon: (
                <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
                  <rect x="4" y="8" width="20" height="14" rx="2" stroke={GOLD} strokeWidth="1.5"/>
                  <path d="M14 22v4M10 26h8" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
                  <rect x="22" y="12" width="10" height="16" rx="2" stroke={GOLD} strokeWidth="1.5"/>
                  <circle cx="27" cy="25" r="1" fill={GOLD}/>
                </svg>
              ),
              title: "スマホでも\n美しく見やすい",
              desc: "どのデバイスでもあなたの魅力が最大限に伝わるレスポンシブ対応。",
            },
            {
              icon: (
                <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
                  <path d="M6 26l6-8 6 4 6-10 6 6" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="30" cy="10" r="3" fill={GOLD}/>
                </svg>
              ),
              title: "信頼と実績を\nしっかり訴求",
              desc: "出演歴や受賞歴、メディア掲載などを効果的にアピールできます。",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: CARD_BG, border: "1px solid #2a2a2a" }} className="rounded-xl p-4 flex flex-col gap-2">
              {icon}
              <p className="text-white font-bold text-sm leading-snug whitespace-pre-line">{title}</p>
              <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div style={{ background: CARD_BG2 }} className="mx-4 my-4 rounded-xl p-6 flex gap-4 items-center">
        <div className="flex-1">
          <p className="text-white/70 text-sm leading-relaxed">
            ただ綺麗なサイトを作るのではなく、<br />
            <span className="text-white font-bold">監督や担当者が「この人に任せたい」と<br />確信する構成・デザイン</span>を形にします。
          </p>
        </div>
        <div style={{ background: "linear-gradient(160deg,#1a1612,#232019)" }} className="shrink-0 w-16 h-20 rounded-lg flex items-center justify-center">
          <span className="text-white/20 text-xs font-bold tracking-widest rotate-90">MODEL</span>
        </div>
      </div>
    </section>
  )
}

/* ── 5. ベネフィット（3つの強み）── */
function BenefitSection() {
  return (
    <section style={{ background: DARK_BG }} className="pb-10 overflow-hidden">
      {/* Header */}
      <div className="relative h-56 flex flex-col justify-center px-6" style={{ background: "linear-gradient(160deg,#1a1510,#0d0d0d)" }}>
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 80% 50%,#c9a84c22,transparent 70%)" }} />
        <p className="text-white/60 text-sm leading-relaxed relative z-10 mb-2">当社が</p>
        <h2 className="text-white text-4xl font-bold relative z-10">
          選ばれる<br />
          <span style={{ color: GOLD }}>3</span>つの理由
        </h2>
        <p className="text-white/60 text-sm mt-4 relative z-10 leading-relaxed">
          フリーランスのための、<br />本気のホームページ制作。
        </p>
      </div>

      {/* Point 01 */}
      <div style={{ background: CARD_BG }} className="mx-4 mt-4 rounded-xl overflow-hidden">
        <div className="flex justify-between items-start p-5 pb-3">
          <div>
            <div style={{ color: GOLD }} className="text-xs tracking-[0.3em] mb-1">POINT</div>
            <div style={{ color: GOLD }} className="text-4xl font-bold leading-none">01</div>
            <p className="text-white text-sm mt-3 leading-snug">キャスティングの目を引く</p>
            <h3 className="text-white text-xl font-bold leading-snug mt-1">
              「実績・表現力」の<br />最適配置
            </h3>
          </div>
          <div style={{ background: "linear-gradient(160deg,#1a1510,#2d2419)", border: "1px solid #2a2a2a" }}
            className="rounded-lg w-32 h-24 flex items-center justify-center shrink-0">
            <div className="text-center">
              <div style={{ color: GOLD }} className="text-[8px] tracking-widest mb-1">WORKS</div>
              <div className="grid grid-cols-3 gap-1">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} style={{ background: "#2a2a2a" }} className="w-6 h-6 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-white/60 text-xs px-5 pb-5 leading-relaxed">
          SNSの寄せ集めではない、<br />プロとして信頼されるポートフォリオ構成。
        </p>
      </div>

      {/* Point 02 */}
      <div style={{ background: CARD_BG }} className="mx-4 mt-3 rounded-xl overflow-hidden">
        <div className="flex justify-between items-start p-5 pb-3">
          <div className="flex-1">
            <div style={{ color: GOLD }} className="text-xs tracking-[0.3em] mb-1">POINT</div>
            <div style={{ color: GOLD }} className="text-4xl font-bold leading-none">02</div>
            <p className="text-white text-sm mt-3 leading-snug">
              応援プライス<span style={{ color: GOLD }} className="text-2xl font-bold">5万円</span>で<br />
              一生使えるあなただけのHP
            </p>
          </div>
          <div className="shrink-0 relative w-28 h-28">
            <div style={{ background: `radial-gradient(circle, ${GOLD} 0%, #8b6914 100%)`, borderRadius: "50%" }}
              className="w-24 h-24 flex flex-col items-center justify-center shadow-2xl">
              <div style={{ color: "white" }} className="text-center">
                <span className="text-3xl font-bold">5</span>
                <span className="text-lg">万円〜</span>
              </div>
              <div className="text-white/80 text-[10px]">応援プライス</div>
            </div>
          </div>
        </div>
        <p className="text-white/60 text-xs px-5 pb-5 leading-relaxed">
          応援したい一心で、<br />この特別価格を実現しました。
        </p>
      </div>

      {/* Point 03 */}
      <div style={{ background: CARD_BG }} className="mx-4 mt-3 rounded-xl overflow-hidden">
        <div className="relative h-40 flex flex-col justify-end" style={{ background: "linear-gradient(160deg,#1a1510,#0d0d0d)" }}>
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 70% 30%,#c9a84c11,transparent 70%)" }} />
          <div className="p-5 relative z-10">
            <div style={{ color: GOLD }} className="text-xs tracking-[0.3em] mb-1">POINT</div>
            <div style={{ color: GOLD }} className="text-4xl font-bold leading-none">03</div>
          </div>
        </div>
        <div className="p-5">
          <p className="text-white text-sm leading-snug">初めてでも安心の</p>
          <h3 className="text-white text-2xl font-bold leading-snug mt-1">
            丸投げサポート
          </h3>
          <p className="text-white/60 text-xs mt-3 leading-relaxed">
            文章や構成が苦手でも大丈夫。<br />
            ヒアリングシートを埋めるだけで、<br />
            プロが最適な言葉にブラッシュアップ。
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 mt-8 text-center">
        <p className="text-white/70 text-sm leading-relaxed mb-2">あなたの魅力を最大限に。</p>
        <p className="text-white text-sm mb-6">まずは<span style={{ color: GOLD }} className="font-bold text-lg">無料</span>でご相談ください。</p>
        <CTAButton label="無料相談はこちら" />
      </div>
    </section>
  )
}

/* ── 6. 信頼性（実績・お客様の声）── */
function TrustSection() {
  const voices = [
    {
      name: "田中 美咲",
      role: "女優・モデル / 25歳",
      text: "HP制作後、書類選考の通過率が明らかに上がりました。キャスティング担当者から「HPを見て連絡した」と言われることが増えて、プロとして一歩前進した感覚があります。",
      result: "書類選考通過率 +60%",
    },
    {
      name: "佐藤 竜平",
      role: "俳優 / 28歳",
      text: "自分の実績をどうまとめればいいか分からなかったのですが、ヒアリングを通じてプロが整理してくれて。完成したHPを見た監督から「本気度が伝わった」と言っていただけました。",
      result: "オーディション獲得数 3倍に",
    },
    {
      name: "中村 彩",
      role: "シンガー・タレント / 22歳",
      text: "SNSだけで活動していた頃と全然違います。HPができてから仕事の問い合わせが来るようになって、ちゃんとプロとして見てもらえる実感があります。",
      result: "仕事問い合わせ 月0件→8件",
    },
  ]

  return (
    <section style={{ background: "#111" }} className="pb-10 overflow-hidden">
      <div className="px-6 pt-10 pb-6 text-center">
        <div style={{ color: GOLD }} className="text-xs tracking-[0.3em] mb-2">VOICE</div>
        <h2 className="text-white text-2xl font-bold leading-snug">
          制作後、<span style={{ color: GOLD }}>仕事が変わった</span><br />
          お客様の声
        </h2>
      </div>

      {/* Works mockups */}
      <div className="px-4 pb-6">
        <p style={{ color: GOLD }} className="text-xs tracking-[0.3em] text-center mb-4">WORKS</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "KENJI MIZUNO", role: "ACTOR", bg: "linear-gradient(160deg,#1e1812,#2d2419)" },
            { name: "ANNA MIZUKI", role: "MODEL", bg: "linear-gradient(160deg,#1a1612,#232019)" },
            { name: "RYU YAMADA", role: "SINGER", bg: "linear-gradient(160deg,#0e1525,#1b2540)" },
            { name: "YUKI TANAKA", role: "ACTRESS", bg: "linear-gradient(160deg,#1a1520,#252035)" },
          ].map(({ name, role, bg }) => (
            <div key={name} style={{ background: bg, border: "1px solid #2a2a2a" }} className="rounded-xl h-28 flex flex-col justify-between p-3">
              <div style={{ color: GOLD }} className="text-[8px] tracking-widest">{role}</div>
              <div className="text-white text-xs font-bold tracking-wider">{name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Voices */}
      <div className="flex flex-col gap-4 px-4">
        {voices.map(({ name, role, text, result }) => (
          <div key={name} style={{ background: CARD_BG, border: "1px solid #2a2a2a" }} className="rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div style={{ background: `linear-gradient(135deg,${GOLD},#8b6914)`, borderRadius: "50%" }}
                className="w-10 h-10 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {name[0]}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{name}</p>
                <p className="text-white/50 text-xs">{role}</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-3">「{text}」</p>
            <div style={{ background: "#0d0d0d", borderLeft: `3px solid ${GOLD}` }} className="rounded-r px-3 py-2">
              <p style={{ color: GOLD }} className="text-xs font-bold">{result}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── 7. FAQ ── */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    {
      q: "実績が少なくても制作できますか？",
      a: "はい、問題ありません。活動を始めたばかりの方や実績が少ない方でも、現在の魅力・個性・ビジョンを最大限に表現する構成でHPを制作します。実績は後から更新もできます。",
    },
    {
      q: "パソコンが苦手でも大丈夫ですか？",
      a: "大丈夫です。ヒアリングシートにご記入いただくだけで、文章・デザイン・構成はすべてプロが担当します。完成後の更新方法も丁寧にサポートします。",
    },
    {
      q: "5万円に含まれる内容を教えてください。",
      a: "デザイン・コーディング・コピーライティング・公開設定がすべて含まれます。別途かかる費用はドメイン・サーバー代（年間約1〜2万円）のみです。",
    },
    {
      q: "完成までどれくらいかかりますか？",
      a: "ヒアリング後、通常2〜3週間でご納品します。お急ぎの場合はご相談ください。",
    },
    {
      q: "完成後に自分で更新できますか？",
      a: "はい。管理画面の使い方を丁寧にレクチャーします。また、更新代行プランもご用意しております。",
    },
    {
      q: "どんなジャンルのフリーランスに対応していますか？",
      a: "俳優・モデル・シンガー・ダンサー・声優・タレントなど、エンタメ系フリーランス全般に対応しています。",
    },
  ]

  return (
    <section style={{ background: DARK_BG }} className="pb-10">
      <div className="px-6 pt-10 pb-6 text-center">
        <div style={{ color: GOLD }} className="text-xs tracking-[0.3em] mb-2">FAQ</div>
        <h2 className="text-white text-2xl font-bold">よくある質問</h2>
      </div>
      <div className="flex flex-col divide-y divide-white/10 border-t border-white/10">
        {faqs.map(({ q, a }, i) => (
          <div key={i} className="px-6">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-start justify-between gap-4 py-5 text-left"
            >
              <div className="flex gap-3">
                <span style={{ color: GOLD }} className="font-bold text-sm shrink-0">Q.</span>
                <span className="text-white text-sm leading-relaxed">{q}</span>
              </div>
              <span style={{ color: GOLD }} className="shrink-0 text-lg">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="pb-5 flex gap-3">
                <span style={{ color: GOLD }} className="font-bold text-sm shrink-0">A.</span>
                <p className="text-white/70 text-sm leading-relaxed">{a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── 8. クロージング ── */
function ClosingSection() {
  return (
    <section id="contact" style={{ background: "#111" }} className="pb-12 overflow-hidden">
      {/* Hero image area */}
      <div className="relative h-64 flex flex-col justify-end px-6 pb-6 overflow-hidden"
        style={{ background: "linear-gradient(160deg,#1a1510,#0d0d0d)" }}>
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 80% 30%,#c9a84c,transparent 60%)" }} />
        <div className="relative z-10">
          <h2 className="text-white text-3xl font-bold leading-snug mb-3">
            チャンスは、<br />
            <span style={{ color: GOLD }}>準備した人</span>に<br />
            やってくる。
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            まだHPを持っていないあなたに、<br />今すぐ動いてほしい理由があります。
          </p>
        </div>
      </div>

      <div className="px-6 pt-8">
        {/* Stats */}
        <div style={{ background: CARD_BG, border: `1px solid ${GOLD}33` }} className="rounded-2xl p-6 mb-8">
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span style={{ color: GOLD }} className="text-5xl font-bold">90</span>
            <span style={{ color: GOLD }} className="text-2xl">%</span>
          </div>
          <p className="text-white/60 text-xs text-center mb-4">のキャスティング担当者がHPで本気度を判断</p>
          <div className="border-t border-white/10 pt-4">
            <p className="text-white text-sm text-center font-bold leading-relaxed">
              今この瞬間も、あなたのライバルは<br />
              <span style={{ color: GOLD }}>HPで差をつけています。</span>
            </p>
          </div>
        </div>

        {/* Steps */}
        <h3 style={{ color: GOLD }} className="text-center text-sm font-bold tracking-widest mb-4">無料相談の流れ</h3>
        <div className="flex flex-col gap-3 mb-8">
          {[
            { step: "01", text: "フォームから無料相談を申込む" },
            { step: "02", text: "30分のヒアリング（オンライン）" },
            { step: "03", text: "あなたに最適なHP構成をご提案" },
            { step: "04", text: "制作スタート → 2〜3週間で完成" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-4">
              <div style={{ background: `linear-gradient(135deg,${GOLD},#8b6914)`, borderRadius: "50%" }}
                className="w-9 h-9 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
                {step}
              </div>
              <p className="text-white text-sm">{text}</p>
            </div>
          ))}
        </div>

        {/* Final message */}
        <div className="text-center mb-8">
          <p className="text-white/70 text-sm leading-relaxed mb-2">あなたの魅力を最大限に。</p>
          <p className="text-white text-base font-bold leading-relaxed mb-1">
            まずは<span style={{ color: GOLD }} className="text-2xl font-bold">無料</span>でご相談ください。
          </p>
          <p className="text-white/50 text-xs mb-6">※ 相談だけでも大歓迎です。</p>
          <CTAButton label="無料相談はこちら" />
        </div>

        {/* Note */}
        <div style={{ background: CARD_BG, borderLeft: `3px solid ${GOLD}` }} className="rounded-r-xl p-4">
          <p style={{ color: GOLD }} className="text-xs font-bold mb-1">対象者について</p>
          <p className="text-white/60 text-xs leading-relaxed">
            当サービスは、俳優・モデル・シンガー・ダンサー等のエンタメ系フリーランスを対象としています。
            まずはお気軽にご相談ください。
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ── */
function LPFooter() {
  return (
    <footer style={{ background: "#0a0a0a", borderTop: "1px solid #2a2a2a" }} className="px-6 py-8">
      <div className="text-center mb-6">
        <div className="text-white font-bold text-sm tracking-widest">CREATE YOUR STORY.</div>
        <div className="text-white/30 text-[9px] tracking-[0.3em] mt-0.5">PROFESSIONAL WEBSITE</div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {["プライバシーポリシー","特定商取引法に基づく表記","お問い合わせ"].map(t => (
          <span key={t} className="text-white/40 text-[10px] cursor-pointer hover:text-white/70">{t}</span>
        ))}
      </div>
      <p className="text-white/20 text-[10px] text-center">© 2024 CREATE YOUR STORY. All rights reserved.</p>
    </footer>
  )
}

/* ── Main Page ── */
export default function LPPage() {
  return (
    <div style={{ background: DARK_BG }} className="min-h-screen max-w-[430px] mx-auto relative overflow-x-hidden">
      <Nav />
      <main className="pt-14">
        <HeroSection />
        <PainSection />
        <FactSection />
        <SolutionSection />
        <BenefitSection />
        <TrustSection />
        <FAQSection />
        <ClosingSection />
      </main>
      <LPFooter />
    </div>
  )
}
