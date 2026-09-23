"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { checkEmail, normalizeEmail, suggestEmail } from "@/lib/contact/email"

// サーバーは受付票の発行から3秒未満の送信を Bot とみなすので、それより少し長く待ってから送る
const MIN_WAIT_MS = 3500

const EMPTY_FORM = { name: "", company: "", email: "", type: "", message: "", website: "" }

export function ContactSection() {
  const { ref, isVisible } = useScrollAnimation()
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  // メールドメインの打ち間違い候補。一度送信を止めて知らせたら、次の送信はそのまま通す
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [typoWarned, setTypoWarned] = useState(false)
  const tokenRef = useRef<{ value: string; receivedAt: number } | null>(null)

  const fetchToken = useCallback(async () => {
    try {
      const res = await fetch("/api/contact", { cache: "no-store" })
      const data = await res.json()
      if (typeof data.token === "string") tokenRef.current = { value: data.token, receivedAt: Date.now() }
    } catch {
      // 取れなければ送信時にもう一度取りに行く
    }
  }, [])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  const readyToken = async () => {
    if (!tokenRef.current) await fetchToken()
    const token = tokenRef.current
    if (!token) return ""
    const wait = MIN_WAIT_MS - (Date.now() - token.receivedAt)
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait))
    return token.value
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.name.trim()) next.name = "お名前を入力してください"
    const email = checkEmail(formData.email)
    if (!email.ok) next.email = email.message
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
    const typo = suggestEmail(formData.email)
    if (typo && !typoWarned) {
      setSuggestion(typo)
      setTypoWarned(true)
      return
    }
    setErrors({})
    setErrorMessage("")
    setStatus("sending")

    const send = async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, email: normalizeEmail(formData.email), token: await readyToken() }),
      })
      return { res, data: await res.json().catch(() => ({})) }
    }

    try {
      let { res, data } = await send()
      if (data.code === "token") {
        // 受付票が古くなっていた（ページを長く開いていた等）。取り直して一度だけ送り直す
        tokenRef.current = null
        ;({ res, data } = await send())
      }
      if (res.ok) {
        setStatus("done")
        setFormData(EMPTY_FORM)
        setSuggestion(null)
        setTypoWarned(false)
        tokenRef.current = null
        fetchToken()
        return
      }
      if (data.fieldErrors) setErrors(data.fieldErrors)
      setErrorMessage(
        res.status === 429
          ? `${data.error}。時間をおいて再度お試しください。`
          : data.fieldErrors
            ? "入力内容をご確認ください。"
            : "送信に失敗しました。時間をおいて再度お試しください。",
      )
      setStatus("error")
    } catch {
      setErrorMessage("送信に失敗しました。時間をおいて再度お試しください。")
      setStatus("error")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
    if (name === "email") {
      setSuggestion(null)
      setTypoWarned(false)
    }
  }

  // 入力欄を離れた時に全角→半角へ直し、形式の誤りと打ち間違いの候補をその場で知らせる
  const handleEmailBlur = () => {
    if (!formData.email.trim()) return
    const email = normalizeEmail(formData.email)
    if (email !== formData.email) setFormData(prev => ({ ...prev, email }))
    const result = checkEmail(email)
    if (!result.ok) setErrors(prev => ({ ...prev, email: result.message }))
    setSuggestion(result.ok ? suggestEmail(email) : null)
  }

  const applySuggestion = () => {
    if (!suggestion) return
    setFormData(prev => ({ ...prev, email: suggestion }))
    setErrors(prev => ({ ...prev, email: "" }))
    setSuggestion(null)
    setTypoWarned(false)
  }

  const emailDescribedBy = [errors.email && "email-error", suggestion && "email-hint"].filter(Boolean).join(" ")

  return (
    <section id="contact" className="py-28 md:py-36 bg-soft-bg">
      <div ref={ref} className="max-w-[640px] mx-auto px-5">
        {/* Section Label */}
        <p className={`font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-6 text-center transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          CONTACT
        </p>

        {/* Heading */}
        <h2 className={`text-navy text-2xl md:text-4xl font-bold leading-snug mb-14 text-center transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          お問い合わせ
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className={`space-y-6 transition-all duration-600 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Bot 用の罠。人には見えず、読み上げや Tab 移動の対象にもならない。ここが埋まった送信は破棄される */}
          <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

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
              maxLength={100}
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
              maxLength={100}
              aria-invalid={!!errors.company}
              aria-describedby={errors.company ? "company-error" : undefined}
              className="w-full px-4 py-3 bg-white/80 border border-white/60 rounded-xl text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-[#9fe8dc]/50 focus:border-[#9fe8dc]/60 transition-all"
              placeholder="株式会社〇〇"
            />
            {errors.company && <p id="company-error" className="mt-1.5 text-xs text-[#d6456b]">{errors.company}</p>}
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
              onBlur={handleEmailBlur}
              autoComplete="email"
              maxLength={254}
              aria-invalid={!!errors.email}
              aria-describedby={emailDescribedBy || undefined}
              className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-[#9fe8dc]/50 transition-all ${errors.email ? 'border-[#e8879f]' : 'border-white/60 focus:border-[#9fe8dc]/60'}`}
              placeholder="example@company.com"
            />
            {errors.email && <p id="email-error" className="mt-1.5 text-xs text-[#d6456b]">{errors.email}</p>}
            <div aria-live="polite">
              {suggestion && !errors.email && (
                <p id="email-hint" className="mt-1.5 text-xs leading-relaxed text-navy/70 text-pretty">
                  もしかして
                  <button
                    type="button"
                    onClick={applySuggestion}
                    className="relative mx-1 font-medium text-[#3ba08f] underline decoration-[#9fe8dc] underline-offset-2 transition-colors hover:text-navy after:absolute after:inset-x-0 after:-inset-y-3"
                  >
                    {suggestion}
                  </button>
                  ですか？
                  {typoWarned && (
                    <span className="block mt-0.5 text-[#b7791f]">
                      お間違いでなければ、そのままもう一度「送信する」を押してください。
                    </span>
                  )}
                </p>
              )}
            </div>
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
              maxLength={5000}
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
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
