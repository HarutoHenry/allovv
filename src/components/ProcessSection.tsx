"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  { step: "01", title: "無料相談",       desc: "オンラインで現状と目標をヒアリング。必要な書類・手続き・AIツールを整理します。",             duration: "30分〜" },
  { step: "02", title: "プラン提案",     desc: "ヒアリング内容をもとに最適なサポートプランとスケジュール・費用を提案します。",         duration: "1〜2日" },
  { step: "03", title: "書類・戦略作成", desc: "AIと専門知識を組み合わせ、事業計画書・申請書類・AI導入戦略を高速で作成します。", duration: "3〜10日" },
  { step: "04", title: "レビュー・修正", desc: "内容を一緒に確認し、納得いくまで修正。専門家への提出前チェックも行います。",         duration: "2〜3日" },
  { step: "05", title: "継続サポート",   desc: "起業後の追加書類・AI活用の継続支援・補助金の追加申請まで長期パートナーとして伴走します。", duration: "継続" },
];

export default function ProcessSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="process" ref={ref} className="py-24 md:py-36 overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] tracking-[0.12em] uppercase mb-3" style={{ color: "#ADADAD" }}>
              How It Works
            </p>
            <h2
              className="font-semibold tracking-[-0.03em] leading-[1.04]"
              style={{ fontSize: "clamp(30px,4.5vw,52px)", color: "#0C0C0C" }}
            >
              ご利用の流れ
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.18, duration: 0.6 }}
            className="text-[14px] max-w-[280px]"
            style={{ color: "#6E6E6E" }}
          >
            相談から書類完成まで、最短1週間〜対応可能。
          </motion.p>
        </div>
      </div>

      {/* Step cards */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x-mandatory px-6 md:px-12 lg:px-16 pb-4">
        {steps.map((step, i) => (
          <StepCard key={step.step} step={step} index={i} inView={inView} />
        ))}
        <div className="flex-shrink-0 w-2" />
      </div>
    </section>
  );
}

function StepCard({ step, index, inView }: { step: (typeof steps)[0]; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.09 + 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="snap-start flex-shrink-0 w-[255px] md:w-[295px] rounded-[18px] p-7 flex flex-col gap-5 relative overflow-hidden"
      style={{
        aspectRatio: "3/4",
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* Background number */}
      <span
        className="absolute -right-2 -top-3 text-[108px] font-bold leading-none select-none pointer-events-none tabular-nums"
        style={{ color: "rgba(0,0,0,0.035)" }}
      >
        {step.step}
      </span>

      {/* Step pill */}
      <span
        className="relative w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-semibold self-start"
        style={{ background: "rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.08)", color: "#0C0C0C" }}
      >
        {step.step}
      </span>

      {/* Text */}
      <div className="relative flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-[19px] font-semibold tracking-[-0.025em] mb-3" style={{ color: "#0C0C0C" }}>
            {step.title}
          </h3>
          <p className="text-[13px] leading-relaxed" style={{ color: "#6E6E6E" }}>
            {step.desc}
          </p>
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] self-start mt-4"
          style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", color: "#ADADAD" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M5 3V5.5L6.5 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {step.duration}
        </div>
      </div>
    </motion.div>
  );
}
