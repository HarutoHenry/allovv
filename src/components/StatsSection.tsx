"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  { value: "1",  suffix: "週間〜", label: "書類完成まで（最短）",  sub: "通常比 85% 短縮",    color: "rgba(197,245,232,0.45)" },
  { value: "80", suffix: "%削減",  label: "従来比コスト",          sub: "専門家依頼比",       color: "rgba(255,228,239,0.45)" },
  { value: "50", suffix: "+",      label: "対応書類・申請種別",    sub: "補助金・法人設立 etc.", color: "rgba(197,245,232,0.45)" },
  { value: "0",  suffix: "円",     label: "初回相談費用",          sub: "完全無料でご相談",   color: "rgba(255,228,239,0.45)" },
];

export default function StatsSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="py-16 md:py-20 px-6 md:px-12 lg:px-16">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card flex flex-col p-7"
              style={{ background: s.color, border: "1px solid rgba(255,255,255,0.65)" }}
            >
              <span
                className="font-semibold tracking-[-0.04em] leading-none tabular-nums"
                style={{ fontSize: "clamp(32px,4vw,50px)", color: "#1a2e35" }}
              >
                {inView
                  ? <><AnimatedCounter value={s.value} />{s.suffix}</>
                  : <span className="opacity-0">0{s.suffix}</span>
                }
              </span>
              <span className="text-[13px] font-medium mt-2.5" style={{ color: "#1a2e35" }}>{s.label}</span>
              <span className="text-[11.5px] mt-0.5" style={{ color: "#64748b" }}>{s.sub}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
