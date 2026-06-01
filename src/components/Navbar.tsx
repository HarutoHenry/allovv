"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "./MagneticButton";

const links = [
  { label: "サービス", href: "#services" },
  { label: "実績",     href: "#work" },
  { label: "流れ",     href: "#process" },
  { label: "相談",     href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive]     = useState("");
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const py        = useTransform(scrollY, [0, 80], [20, 12]);

  useEffect(() => {
    const sections = links.map(l => document.querySelector(l.href));
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(`#${e.target.id}`); }),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach(s => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <motion.header
        style={{ paddingTop: py, paddingBottom: py }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12"
      >
        {/* Glass bg on scroll */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(26,46,53,0.07)" }} />
        </motion.div>

        <nav className="relative flex items-center justify-between max-w-[1280px] mx-auto">
          {/* Logo */}
          <MagneticButton
            href="#"
            className="text-[15px] font-semibold tracking-[-0.02em]"
            extraStyle={{ color: "#1a2e35", fontFamily: "var(--font-dm-sans)" }}
          >
            Allovv
          </MagneticButton>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-[13px] tracking-[-0.01em] py-1 transition-colors duration-150"
                  style={{ color: active === href ? "#1a2e35" : "rgba(26,46,53,0.5)" }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <MagneticButton
            href="#contact"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium gradient-btn"
            extraStyle={{}}
          >
            無料相談
            <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
              <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </MagneticButton>

          {/* Hamburger */}
          <button className="md:hidden p-1.5" onClick={() => setMenuOpen(v => !v)} aria-label="メニュー">
            <motion.div className="flex flex-col gap-[5px]" animate={menuOpen ? "open" : "closed"}>
              <motion.span variants={{ open: { rotate: 45, y: 6 }, closed: { rotate: 0, y: 0 } }} className="block w-5 h-px bg-[#1a2e35] origin-center" />
              <motion.span variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}             className="block w-5 h-px bg-[#1a2e35]" />
              <motion.span variants={{ open: { rotate: -45, y: -6 }, closed: { rotate: 0, y: 0 } }} className="block w-5 h-px bg-[#1a2e35] origin-center" />
            </motion.div>
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.22 }}
        className={`fixed inset-x-0 top-0 z-40 pt-20 pb-8 px-6 ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(26,46,53,0.07)",
        }}
      >
        <ul className="flex flex-col gap-5 mt-4">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a href={href} onClick={() => setMenuOpen(false)} className="text-[22px] font-semibold tracking-[-0.03em]" style={{ color: "#1a2e35" }}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" onClick={() => setMenuOpen(false)} className="mt-8 inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-[14px] font-medium gradient-btn">
          無料相談を申し込む
        </a>
      </motion.div>
    </>
  );
}
