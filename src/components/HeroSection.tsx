"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { icons } from "./Icons";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-white">

      {/* ── Animated blobs ── */}
      <div className="blob-1 absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none" />
      <div className="blob-2 absolute -bottom-40 -right-20 w-[700px] h-[700px] rounded-full pointer-events-none" />
      <div className="blob-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" />

      {/* Light overlay so text stays legible */}
      <div className="absolute inset-0 bg-white/30 pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col min-h-screen w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">

        {/* Navbar spacer */}
        <div className="h-24 flex-shrink-0" />

        {/* Center block */}
        <div className="flex-1 flex flex-col justify-center gap-8 md:gap-10">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-medium tracking-wide"
              style={{
                background: "rgba(197,245,232,0.55)",
                border: "1px solid rgba(184,240,232,0.7)",
                color: "#1a2e35",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5dcfbe]" />
              AI × Startup Support Studio · Tokyo
            </span>
          </motion.div>

          {/* Headline */}
          <div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "104%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="font-semibold leading-[0.88] tracking-[-0.045em]"
                style={{
                  fontSize: "clamp(58px, 10vw, 128px)",
                  color: "#1a2e35",
                  fontFamily: "var(--font-dm-sans), var(--font-noto-sans-jp), sans-serif",
                }}
              >
                起業を、
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "104%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.32, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="font-semibold leading-[0.88] tracking-[-0.045em]"
                style={{
                  fontSize: "clamp(58px, 10vw, 128px)",
                  fontFamily: "var(--font-dm-sans), var(--font-noto-sans-jp), sans-serif",
                }}
              >
                <span className="gradient-text">もっと速く。</span>
              </motion.h1>
            </div>
          </div>

          {/* Description + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16"
          >
            <p
              className="text-[15px] leading-[1.8] max-w-[380px]"
              style={{ color: "#4a6572" }}
            >
              AIを活用した書類作成支援・AIコンサルティングで、
              あなたのビジネスの立ち上げを加速します。
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <MagneticButton
                href="#services"
                className="gradient-btn inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[14px] font-medium"
                extraStyle={{}}
              >
                サービスを見る {icons.arrowUpRight}
              </MagneticButton>
              <a
                href="#contact"
                className="text-[14px] font-medium"
                style={{
                  color: "#1a2e35",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(26,46,53,0.22)",
                  textUnderlineOffset: "3px",
                }}
              >
                無料相談はこちら
              </a>
            </div>
          </motion.div>

          {/* Mini stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="flex flex-wrap gap-5 md:gap-8"
          >
            {[
              { num: "1週間〜", label: "最短書類完成" },
              { num: "80%",     label: "コスト削減" },
              { num: "0円",     label: "初回相談" },
            ].map(s => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="text-[22px] font-semibold tracking-[-0.03em]" style={{ color: "#1a2e35" }}>
                  {s.num}
                </span>
                <span className="text-[12px]" style={{ color: "#64748b" }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex items-center justify-between py-6"
          style={{ borderTop: "1px solid rgba(26,46,53,0.08)" }}
        >
          <span className="text-[11px] tracking-[0.04em]" style={{ color: "rgba(26,46,53,0.35)" }}>
            Tokyo, Japan · Allovv Inc.
          </span>
          <span className="text-[11px] hidden md:block" style={{ color: "rgba(26,46,53,0.28)" }}>
            スクロールして詳しく ↓
          </span>
        </motion.div>
      </div>
    </section>
  );
}
