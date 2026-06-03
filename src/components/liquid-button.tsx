"use client"

import { ReactNode } from "react"

interface LiquidButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: "button" | "submit"
}

export function LiquidButton({ children, onClick, className = "", type = "button" }: LiquidButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`liquid-btn group relative overflow-visible ${className}`}
    >
      <span className="liquid-btn-text">{children}</span>
    </button>
  )
}
