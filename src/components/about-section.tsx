"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { InstagramIcon, XIcon } from "@/components/social-icons"

const companyInfo = [
  { label: "会社名", value: "Allovv（アロー）" },
  { label: "事業開始", value: "2025年6月" },
  { label: "代表", value: "三沼 春斗" },
  { label: "所在地", value: "神奈川県横浜市" },
  { label: "事業内容", value: "AI仕組み化、AIクリエイティブ制作、起業支援" },
]

const socialLinks = [
  { name: "X", href: "https://x.com/allovv_ai", handle: "@allovv_ai", Icon: XIcon },
  { name: "Instagram", href: "https://www.instagram.com/allovv_ai/", handle: "@allovv_ai", Icon: InstagramIcon },
]

export function AboutSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="about" className="py-28 md:py-36 bg-white">
      <div ref={ref} className="max-w-[900px] mx-auto px-5">
        {/* Section Label */}
        <p className={`font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-6 text-center transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          ABOUT
        </p>

        {/* Heading */}
        <h2 className={`text-navy font-bold text-2xl md:text-3xl leading-relaxed mb-16 text-center transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          会社概要
        </h2>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Company Info Table */}
          <div className={`transition-all duration-600 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <table className="w-full">
              <tbody>
                {companyInfo.map((item) => (
                  <tr key={item.label} className="border-b border-navy/10">
                    <th className="py-4 text-left text-navy/50 text-sm font-medium w-28 align-top">
                      {item.label}
                    </th>
                    <td className="py-4 text-navy text-sm">
                      {item.value}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-navy/10">
                  <th className="py-4 text-left text-navy/50 text-sm font-medium w-28 align-top">
                    SNS
                  </th>
                  <td className="py-4 text-navy text-sm">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      {socialLinks.map(({ name, href, handle, Icon }) => (
                        <a
                          key={name}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#4aa898] hover:text-navy transition-colors"
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="sr-only">{name}</span>
                          {handle}
                        </a>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Logo Image */}
          <div className={`transition-all duration-600 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div
              className="glass-card h-full min-h-[300px] flex items-center justify-center p-12"
              style={{
                background: "linear-gradient(135deg, rgba(197,245,232,0.25) 0%, rgba(237,231,246,0.25) 100%)"
              }}
            >
              <Image
                src="/logo.png"
                alt="Allovv"
                width={320}
                height={107}
                className="w-full max-w-[280px] h-auto object-contain"
                placeholder="empty"
                unoptimized
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
