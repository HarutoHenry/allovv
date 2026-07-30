"use client"

import { useState } from "react"
import { motion } from "framer-motion"

type TabKey = "pricing" | "examples"

const tabs: { key: TabKey; label: string }[] = [
  { key: "examples", label: "導入例" },
  { key: "pricing", label: "料金システム" },
]

export function PricingExampleToggle({
  pricingContent,
  examplesContent,
}: {
  pricingContent: React.ReactNode
  examplesContent: React.ReactNode
}) {
  const [active, setActive] = useState<TabKey>("pricing")

  return (
    <div>
      <div className="flex justify-center mb-4">
        <div
          className="inline-flex gap-1 rounded-full p-1"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className="relative px-6 py-2.5 text-sm font-semibold rounded-full transition-colors duration-300"
            >
              {active === tab.key && (
                <motion.span
                  layoutId="pricing-example-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(135deg, #7dd8ca 0%, #9fe8dc 100%)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className="relative z-10"
                style={{ color: active === tab.key ? "#0f1e24" : "rgba(255,255,255,0.55)" }}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {active === "pricing" ? pricingContent : examplesContent}
    </div>
  )
}
