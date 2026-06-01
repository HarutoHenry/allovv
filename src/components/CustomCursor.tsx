"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onEnterLink = () => {
      ringRef.current?.style.setProperty("transform", `translate(-50%,-50%) scale(2.2)`);
      ringRef.current?.style.setProperty("opacity", "0.4");
      dotRef.current?.style.setProperty("opacity", "0");
    };
    const onLeaveLink = () => {
      ringRef.current?.style.setProperty("transform", `translate(-50%,-50%) scale(1)`);
      ringRef.current?.style.setProperty("opacity", "1");
      dotRef.current?.style.setProperty("opacity", "1");
    };

    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.left = `${pos.current.x}px`;
        dotRef.current.style.top = `${pos.current.y}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top = `${ring.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);

    const links = () => document.querySelectorAll("a,button,[data-cursor]");
    const addListeners = () => links().forEach(el => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });
    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 6,
          height: 6,
          background: "#0d0d0d",
          transition: "opacity 0.2s",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 32,
          height: 32,
          border: "1px solid rgba(13,13,13,0.35)",
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s",
        }}
      />
    </>
  );
}
