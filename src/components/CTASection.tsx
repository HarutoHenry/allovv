"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { icons } from "./Icons";

export default function CTASection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);

  return (
    <section id="contact" ref={ref} className="py-24 md:py-36 px-6 md:px-12 lg:px-16">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[28px] px-8 md:px-20 py-20 md:py-28 overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #0f1e24 0%, #1a3a44 50%, #0f2830 100%)",
          }}
        >
          {/* Mint glow top-right */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-60px", right: "-60px",
              width: "380px", height: "380px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(197,245,232,0.18) 0%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />
          {/* Pink glow bottom-left */}
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: "-40px", left: "10%",
              width: "320px", height: "320px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,174,196,0.14) 0%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />

          <div className="relative max-w-[540px] mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ delay: 0.18 }}
              className="text-[11px] tracking-[0.18em] uppercase mb-6 font-medium"
              style={{ color: "rgba(197,245,232,0.5)" }}
            >
              Free Consultation
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ delay: 0.28, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="font-semibold tracking-[-0.04em] leading-[0.92] mb-7"
              style={{ fontSize: "clamp(34px,6vw,68px)", color: "#FFFFFF" }}
            >
              まずは無料で<br />
              <span style={{ color: "rgba(255,255,255,0.22)" }}>相談してみる。</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.42 }}
              className="text-[14.5px] leading-[1.78] mb-10"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              起業に必要な書類・補助金・AI活用について、
              30分の無料相談でお気軽にご相談ください。当日回答を目指します。
            </motion.p>

            {!sent ? (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.52 }}
                onSubmit={e => { e.preventDefault(); if (email.trim()) setSent(true); }}
                className="flex flex-col sm:flex-row gap-2.5"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="メールアドレスを入力"
                  className="flex-1 px-5 py-3.5 rounded-full text-[13.5px] outline-none"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e  => (e.target.style.borderColor = "rgba(197,245,232,0.4)")}
                  onBlur={e   => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                />
                <MagneticButton
                  type="submit"
                  className="gradient-btn px-6 py-3.5 rounded-full text-[13.5px] font-medium whitespace-nowrap inline-flex items-center gap-1.5"
                  extraStyle={{}}
                >
                  申し込む {icons.arrowUpRight}
                </MagneticButton>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-[14px]"
                style={{ color: "rgba(197,245,232,0.7)" }}
              >
                {icons.check} ありがとうございます。24時間以内にご連絡します。
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.65 }}
              className="mt-6 text-[12px]"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              またはメールで：{" "}
              <a href="mailto:hello@allovv.com" className="underline underline-offset-2" style={{ color: "rgba(197,245,232,0.4)" }}>
                hello@allovv.com
              </a>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
