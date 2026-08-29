"use client"

import { useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactSection() {
  const { ref, isVisible } = useScrollAnimation()
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    type: "",
    message: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.name.trim()) next.name = "お名前を入力してください"
    if (!formData.email.trim()) {
      next.email = "メールアドレスを入力してください"
    } else if (!EMAIL_RE.test(formData.email)) {
      next.email = "正しい形式のメールアドレスを入力してください"
    }
    if (!formData.type) next.type = "お問い合わせ種別を選択してください"
    if (!formData.message.trim()) next.message = "メッセージを入力してください"
    return next
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    setErrors({})
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error()
      setStatus("done")
      setFormData({ name: "", company: "", email: "", type: "", message: "" })
    } catch {
      setStatus("error")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  return (
    <section id="contact" className="py-28 md:py-36 bg-soft-bg">
      <div ref={ref} className="max-w-[640px] mx-auto px-5">
        {/* Section Label */}
        <p className={`font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-6 text-center transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          CONTACT
        </p>

        {/* Heading */}
        <h2 className={`text-navy text-2xl md:text-4xl font-bold leading-snug mb-4 text-center transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          お問い合わせ
        </h2>

        {/* Sub */}
        <p className={`text-navy/60 text-sm md:text-base text-center mb-14 transition-all duration-600 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          事業のご相談・取材・採用、いずれも無料でお受けしています。
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className={`space-y-6 transition-all duration-600 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-navy text-sm font-medium mb-2">
              お名前 <span className="text-[#d6456b]">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-[#9fe8dc]/50 transition-all ${errors.name ? 'border-[#e8879f]' : 'border-white/60 focus:border-[#9fe8dc]/60'}`}
              placeholder="山田 太郎"
            />
            {errors.name && <p id="name-error" className="mt-1.5 text-xs text-[#d6456b]">{errors.name}</p>}
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-navy text-sm font-medium mb-2">
              会社名 <span className="text-navy/40 text-xs">（任意）</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 border border-white/60 rounded-xl text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-[#9fe8dc]/50 focus:border-[#9fe8dc]/60 transition-all"
              placeholder="株式会社〇〇"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-navy text-sm font-medium mb-2">
              メールアドレス <span className="text-[#d6456b]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-[#9fe8dc]/50 transition-all ${errors.email ? 'border-[#e8879f]' : 'border-white/60 focus:border-[#9fe8dc]/60'}`}
              placeholder="example@company.com"
            />
            {errors.email && <p id="email-error" className="mt-1.5 text-xs text-[#d6456b]">{errors.email}</p>}
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-navy text-sm font-medium mb-2">
              お問い合わせ種別 <span className="text-[#d6456b]">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              aria-invalid={!!errors.type}
              aria-describedby={errors.type ? "type-error" : undefined}
              className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-[#9fe8dc]/50 transition-all appearance-none cursor-pointer ${errors.type ? 'border-[#e8879f]' : 'border-white/60 focus:border-[#9fe8dc]/60'}`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231a2e35'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.5rem"
              }}
            >
              <option value="">選択してください</option>
              <option value="service">サービスについて</option>
              <option value="consulting">AI仕組み化のご相談</option>
              <option value="creative">AIクリエイティブ制作</option>
              <option value="partnership">業務提携について</option>
              <option value="media">取材・メディア掲載</option>
              <option value="career">採用について</option>
              <option value="other">その他</option>
            </select>
            {errors.type && <p id="type-error" className="mt-1.5 text-xs text-[#d6456b]">{errors.type}</p>}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-navy text-sm font-medium mb-2">
              メッセージ <span className="text-[#d6456b]">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-[#9fe8dc]/50 transition-all resize-none ${errors.message ? 'border-[#e8879f]' : 'border-white/60 focus:border-[#9fe8dc]/60'}`}
              placeholder="お問い合わせ内容をご記入ください"
            />
            {errors.message && <p id="message-error" className="mt-1.5 text-xs text-[#d6456b]">{errors.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="gradient-btn w-full py-4 font-medium rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "送信中..." : "送信する"}
          </button>

          {status === "done" && (
            <p role="status" className="flex items-center justify-center gap-2 text-center text-sm text-[#3ba08f] pt-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              お問い合わせありがとうございます。担当者よりご連絡いたします。
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="text-center text-sm text-[#d6456b] pt-2">
              送信に失敗しました。時間をおいて再度お試しください。
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
