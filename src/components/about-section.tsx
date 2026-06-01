"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const companyInfo = [
  { label: "社名", value: "Allovv株式会社" },
  { label: "設立", value: "2024年" },
  { label: "所在地", value: "東京都渋谷区" },
  { label: "代表者", value: "代表取締役 〇〇 〇〇" },
  { label: "事業内容", value: "AIプラットフォーム開発、AI導入コンサルティング、AIシステム開発" },
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
        <h2 className={`text-navy text-2xl md:text-3xl leading-relaxed mb-16 text-center transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          会社概要
        </h2>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Company Info Table */}
          <div className={`transition-all duration-600 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <table className="w-full">
              <tbody>
                {companyInfo.map((item, index) => (
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
                  <td className="py-4">
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-navy hover:text-accent-purple transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className="text-sm">@allovv_inc</span>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Office Image Placeholder */}
          <div className={`transition-all duration-600 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div 
              className="glass-card h-full min-h-[300px] flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(252,228,236,0.3) 0%, rgba(237,231,246,0.3) 100%)"
              }}
            >
              {/* IMAGE_PLACEHOLDER_OFFICE */}
              <p className="text-navy/30 text-sm font-display tracking-wider">
                OFFICE IMAGE
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
