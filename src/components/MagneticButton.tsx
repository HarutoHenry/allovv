"use client";

import { useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  extraStyle?: React.CSSProperties;
  href?: string;
  onClick?: () => void;
  strength?: number;
  type?: "button" | "submit" | "reset";
}

export default function MagneticButton({
  children,
  className = "",
  extraStyle,
  href,
  onClick,
  strength = 0.35,
  type,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({ x: (e.clientX - cx) * strength, y: (e.clientY - cy) * strength });
  };

  const handleLeave = () => setOffset({ x: 0, y: 0 });

  const dynamicStyle: React.CSSProperties = {
    ...extraStyle,
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition:
      offset.x === 0 && offset.y === 0
        ? "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)"
        : "transform 0.1s linear",
  };

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        style={dynamicStyle}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={className}
      style={dynamicStyle}
      type={type ?? "button"}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
