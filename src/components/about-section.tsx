"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const companyInfo = [
  { label: "社名", value: "Allovv合同会社" },
  { label: "設立", value: "2026年6月" },
  { label: "所在地", value: "神奈川県横浜市" },
  { label: "代表", value: "三沼 春斗" },
  { label: "事業内容", value: "起業支援、AI導入コンサルティング、AIクリエイティブ制作" },
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
                  <td className="py-4 text-navy/50 text-sm">
                    準備中
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
