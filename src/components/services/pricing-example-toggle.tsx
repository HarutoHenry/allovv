"use client"

import { useId, useRef, useState } from "react"

type TabKey = "pricing" | "examples"

const tabs: { key: TabKey; label: string }[] = [
  { key: "examples", label: "導入例" },
  { key: "pricing", label: "料金システム" },
]

/**
 * 料金と導入例の切り替え。見た目は大きな文字のタブで、下線が選んだ側へ受け渡される。
 * 両方の中身を HTML に出しておき（検索・読み上げのため）、選んでいない側は hidden で隠す。
 * キーボード操作は ← → / Home / End。キーボードで切り替えた時は下線を動かさない
 */
export function PricingExampleToggle({
  pricingContent,
  examplesContent,
}: {
  pricingContent: React.ReactNode
  examplesContent: React.ReactNode
}) {
  const [active, setActive] = useState<TabKey>("pricing")
  const [forward, setForward] = useState(true)
  const [instant, setInstant] = useState(false)
  const id = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const select = (i: number, byKeyboard: boolean) => {
    const current = tabs.findIndex((t) => t.key === active)
    if (i === current) return
    setForward(i > current)
    setInstant(byKeyboard)
    setActive(tabs[i].key)
  }

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = tabs.length - 1
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : -1
    if (next < 0) return
    e.preventDefault()
    select(next, true)
    buttons.current[next]?.focus()
  }

  return (
    <div>
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div
          role="tablist"
          aria-label="料金と導入例"
          data-instant={instant ? "" : undefined}
          className="flex gap-9 md:gap-14 border-b border-white/10"
        >
          {tabs.map((tab, i) => {
            const selected = tab.key === active
            // 右へ移る時は、古い下線が右へ縮み、新しい下線が左から伸びる（左へ移る時は逆）
            const from = selected === forward ? "left" : "right"
            return (
              <button
                key={tab.key}
                ref={(el) => {
                  buttons.current[i] = el
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${tab.key}`}
                aria-selected={selected}
                aria-controls={`${id}-panel-${tab.key}`}
                tabIndex={selected ? 0 : -1}
                onClick={(e) => select(i, e.detail === 0)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="svc-tab text-[1.375rem] md:text-[1.75rem] leading-none"
                style={{ "--from": from } as React.CSSProperties}
              >
                {tab.label}
                <span aria-hidden="true" className="svc-tab-line" />
              </button>
            )
          })}
        </div>
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`${id}-panel-${tab.key}`}
          aria-labelledby={`${id}-tab-${tab.key}`}
          hidden={tab.key !== active}
        >
          {tab.key === "pricing" ? pricingContent : examplesContent}
        </div>
      ))}
    </div>
  )
}
