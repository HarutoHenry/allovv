"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export type CaseExample = {
  key: string
  icon: string
  label: string
  subject: string
  customerName: string
  customerEmail: string
  customerBody: string[]
  replySubject: string
  aiBody: string[]
  attachment?: string
}

export function CaseExampleSwitcher({ examples }: { examples: CaseExample[] }) {
  const [activeKey, setActiveKey] = useState(examples[0].key)
  const active = examples.find((e) => e.key === activeKey) ?? examples[0]

  return (
    <div>
      {/* カテゴリ選択 */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {examples.map((example) => (
          <button
            key={example.key}
            type="button"
            onClick={() => setActiveKey(example.key)}
            className="relative px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-colors duration-300"
            style={{
              background: activeKey === example.key ? undefined : "rgba(255,255,255,0.05)",
              border: activeKey === example.key ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {activeKey === example.key && (
              <motion.span
                layoutId="case-example-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: "linear-gradient(135deg, #7dd8ca 0%, #9fe8dc 100%)" }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className="relative z-10 inline-flex items-center gap-1.5"
              style={{ color: activeKey === example.key ? "#0f1e24" : "rgba(255,255,255,0.6)" }}
            >
              <span aria-hidden="true">{example.icon}</span>
              {example.label}
            </span>
          </button>
        ))}
      </div>

      {/* Before / After mock */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6">
        {/* 受信メール */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
            <span className="text-white/60 text-xs font-semibold">📩 届いたお問い合わせ</span>
            <span className="text-white/35 text-[11px]">10:02 受信</span>
          </div>
          <div className="bg-white p-5">
            <p className="text-[#1a2e35] text-sm font-bold mb-3">{active.subject}</p>
            <div className="text-[11px] text-[#1a2e35]/55 border-b border-[#1a2e35]/10 pb-2.5 mb-3 space-y-0.5">
              <p><span className="inline-block w-10 text-[#1a2e35]/40">差出人</span>{active.customerName} 様 &lt;{active.customerEmail}&gt;</p>
              <p><span className="inline-block w-10 text-[#1a2e35]/40">宛先</span>info@allovv.com</p>
            </div>
            <div className="text-[#1a2e35]/75 text-[13px] leading-relaxed space-y-3">
              {active.customerBody.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="text-center">
          <div className="text-[#7dd8ca] text-3xl md:text-4xl font-bold rotate-90 md:rotate-0">→</div>
          <p className="text-[#7dd8ca]/70 text-[11px] font-semibold mt-1 whitespace-nowrap">AIが自動作成<br />（数分後）</p>
        </div>

        {/* AI下書き */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(125,216,202,0.5)", boxShadow: "0 0 32px rgba(125,216,202,0.15)" }}
        >
          <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "rgba(125,216,202,0.15)" }}>
            <span className="text-[#7dd8ca] text-xs font-semibold">📝 AIが作成した返信下書き</span>
            <span className="text-white/35 text-[11px]">10:05 完成</span>
          </div>
          <div className="bg-white p-5">
            <p className="text-[#1a2e35] text-sm font-bold mb-3">{active.replySubject}</p>
            <div className="text-[11px] text-[#1a2e35]/55 border-b border-[#1a2e35]/10 pb-2.5 mb-3 space-y-0.5">
              <p><span className="inline-block w-10 text-[#1a2e35]/40">差出人</span>info@allovv.com</p>
              <p><span className="inline-block w-10 text-[#1a2e35]/40">宛先</span>{active.customerName} 様 &lt;{active.customerEmail}&gt;</p>
            </div>
            <div className="text-[#1a2e35]/75 text-[13px] leading-relaxed space-y-3">
              {active.aiBody.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              {active.attachment && (
                <p className="inline-flex items-center gap-1.5 text-[12px] text-[#1a2e35]/60 bg-[#1a2e35]/5 rounded-lg px-2.5 py-1.5">
                  📎 {active.attachment}
                </p>
              )}
              <div className="text-[12px] text-[#1a2e35]/60 border-t border-[#1a2e35]/10 pt-2.5 leading-relaxed">
                <p>Allovv（アロー）</p>
                <p>担当：三沼 春斗</p>
                <p>メール：minuma.haruto@allovv.com</p>
                <p>https://allovv.com</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: "#1a73e8" }}>
                送信
              </span>
              <span className="text-[#1a2e35]/40 text-[11px]">← 確認して押すだけ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
