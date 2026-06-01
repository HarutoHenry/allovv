"use client";

import { motion } from "framer-motion";

interface Props {
  isDay: boolean;
  onToggle: () => void;
}

export default function DayNightToggle({ isDay, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDay ? "Switch to night mode" : "Switch to day mode"}
      className="relative flex items-center w-[56px] h-[30px] rounded-full cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
      style={{
        background: isDay
          ? "rgba(255,255,255,0.55)"
          : "rgba(30,30,45,0.7)",
        border: isDay
          ? "1px solid rgba(0,0,0,0.12)"
          : "1px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: "background 0.45s ease, border 0.45s ease",
      }}
    >
      {/* Sun icon */}
      <span
        className="absolute left-[7px] text-[13px] transition-opacity duration-300"
        style={{ opacity: isDay ? 1 : 0.3 }}
      >
        ☀️
      </span>
      {/* Moon icon */}
      <span
        className="absolute right-[6px] text-[12px] transition-opacity duration-300"
        style={{ opacity: isDay ? 0.3 : 1 }}
      >
        🌙
      </span>
      {/* Thumb */}
      <motion.span
        className="absolute top-[3px] w-[24px] h-[24px] rounded-full shadow-sm"
        animate={{ x: isDay ? 3 : 26 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          background: isDay ? "#fff" : "#8b8ba7",
        }}
      />
    </button>
  );
}
