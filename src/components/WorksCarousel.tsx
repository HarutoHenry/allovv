"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

interface Work {
  id: string;
  title: string;
  category: string;
  tag: string;
  gradient: string;
  glow: string;
}

const works: Work[] = [
  {
    id: "01",
    title: "IT導入補助金\n申請書類",
    category: "補助金申請支援",
    tag: "採択率 87%",
    gradient: "linear-gradient(150deg, #141926 0%, #0B0D18 100%)",
    glow: "rgba(80,130,240,0.2)",
  },
  {
    id: "02",
    title: "株式会社設立\n定款・登記書類",
    category: "会社設立サポート",
    tag: "最短3日",
    gradient: "linear-gradient(150deg, #0E1C16 0%, #08110D 100%)",
    glow: "rgba(60,190,120,0.18)",
  },
  {
    id: "03",
    title: "AI業務自動化\nコンサルティング",
    category: "AIコンサル",
    tag: "ROI 3〜10倍",
    gradient: "linear-gradient(150deg, #1E1509 0%, #130E06 100%)",
    glow: "rgba(240,155,50,0.2)",
  },
  {
    id: "04",
    title: "事業計画書\n（金融機関向け）",
    category: "事業計画作成",
    tag: "融資通過率UP",
    gradient: "linear-gradient(150deg, #16102A 0%, #0D081C 100%)",
    glow: "rgba(150,100,240,0.2)",
  },
];

function WorkCard({ work, index, inView }: { work: Work; index: number; inView: boolean }) {
  const ref   = useRef<HTMLDivElement>(null);
  const [tilt, setTilt]   = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top)  / r.height - 0.5) * -9,
      y: ((e.clientX - r.left) / r.width  - 0.5) *  9,
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.09 + 0.15, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="snap-start flex-shrink-0 w-[270px] md:w-[330px]"
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={ref}
        animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: hover ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.4 }}
        onMouseMove={handleMove}
        onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHover(false); }}
        onMouseEnter={() => setHover(true)}
        className="relative rounded-[20px] overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          aspectRatio: "3/4",
          background: `radial-gradient(ellipse 55% 50% at 88% 10%, ${work.glow} 0%, transparent 60%), ${work.gradient}`,
        }}
      >
        {/* Noise */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.055 }} aria-hidden="true">
          <filter id={`noise-${work.id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter={`url(#noise-${work.id})`}/>
        </svg>

        {/* Mid divider */}
        <div className="absolute inset-x-6" style={{ top: "46%", height: "1px", background: "rgba(255,255,255,0.07)" }} />

        {/* Large bg number */}
        <div
          className="absolute -right-1 bottom-[36%] text-[110px] font-bold leading-none select-none pointer-events-none tabular-nums"
          style={{ color: "rgba(255,255,255,0.038)" }}
        >
          {work.id}
        </div>

        {/* Hover rim */}
        <div
          className="absolute inset-0 rounded-[20px] pointer-events-none transition-opacity duration-300"
          style={{
            background: "radial-gradient(ellipse at 50% -8%, rgba(255,255,255,0.07) 0%, transparent 58%)",
            opacity: hover ? 1 : 0,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] tracking-[0.1em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
              {work.id}
            </span>
            <span
              className="text-[11px] px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.11)",
                color: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(8px)",
              }}
            >
              {work.tag}
            </span>
          </div>
          <div>
            <p className="text-[10.5px] mb-2 tracking-[0.08em] uppercase" style={{ color: "rgba(255,255,255,0.32)" }}>
              {work.category}
            </p>
            <h3
              className="text-[21px] font-semibold tracking-[-0.025em] leading-[1.22] whitespace-pre-line"
              style={{ color: "#FFFFFF" }}
            >
              {work.title}
            </h3>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WorksCarousel() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section id="work" ref={ref} className="py-24 md:py-32 overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto mb-10 flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] tracking-[0.12em] uppercase mb-3" style={{ color: "#ADADAD" }}>
            実績・事例
          </p>
          <h2
            className="font-semibold tracking-[-0.03em] leading-[1.04]"
            style={{ fontSize: "clamp(30px,4.5vw,52px)", color: "#0C0C0C" }}
          >
            支援の実績
          </h2>
        </motion.div>
        <motion.a
          href="#"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.25 }}
          className="hidden md:inline-flex items-center gap-1.5 text-[13px] transition-colors"
          style={{ color: "#ADADAD", textDecoration: "underline", textDecorationColor: "rgba(0,0,0,0.15)", textUnderlineOffset: "3px" }}
        >
          すべて見る
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.a>
      </div>

      {/* Cards scroll */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x-mandatory px-6 md:px-12 lg:px-16">
        {works.map((w, i) => (
          <WorkCard key={w.id} work={w} index={i} inView={inView} />
        ))}
        <div className="flex-shrink-0 w-2" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 px-6 md:px-12 lg:px-16 mt-5"
      >
        <div className="flex gap-1.5">
          {works.map((_, i) => (
            <span key={i} className="block w-1 h-1 rounded-full" style={{ background: "#ADADAD" }} />
          ))}
        </div>
        <span className="text-[11.5px]" style={{ color: "#ADADAD" }}>スライドして確認</span>
      </motion.div>
    </section>
  );
}
