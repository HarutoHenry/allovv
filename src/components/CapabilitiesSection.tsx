"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { icons } from "./Icons";

const services = [
  { icon: icons.document, title: "起業支援・書類作成",  desc: "事業計画書・定款・助成金申請書など、起業に必要な書類をAIが一緒に作成。専門家への依頼コストを大幅に削減します。",              tag: "書類作成支援", color: "rgba(197,245,232,0.5)" },
  { icon: icons.robot,    title: "AIコンサルティング",  desc: "業務自動化・AI導入戦略の立案から実装まで。社内ワークフローへのAI組み込みを伴走支援します。",                             tag: "コンサル",    color: "rgba(255,228,239,0.5)" },
  { icon: icons.grant,    title: "補助金・助成金申請",  desc: "IT導入補助金・小規模事業者持続化補助金など、採択率を高める申請書類をAIと専門知識で仕上げます。",                        tag: "補助金支援",  color: "rgba(197,245,232,0.5)" },
  { icon: icons.building, title: "会社設立サポート",    desc: "登記書類の作成から法人口座開設の準備まで、面倒な手続きをAIでスムーズに進める環境を提供します。",                          tag: "会社設立",    color: "rgba(255,228,239,0.5)" },
  { icon: icons.chart,    title: "事業計画書作成",      desc: "投資家向けや金融機関向けの事業計画書をAIが構成・文章化。説得力のある資料に仕上げます。",                               tag: "事業計画",    color: "rgba(197,245,232,0.5)" },
  { icon: icons.link,     title: "AI活用研修・実装",   desc: "ChatGPT・Claude・Geminiなど最新AIツールの社内研修、業務特化カスタマイズ、API連携開発も対応。",                         tag: "AI実装",     color: "rgba(255,228,239,0.5)" },
];

export default function CapabilitiesSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="services" ref={ref} className="py-24 md:py-36 px-6 md:px-12 lg:px-16">
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 mb-16 items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-[11px] tracking-widest uppercase mb-4 font-medium" style={{ background: "rgba(197,245,232,0.5)", color: "#1a7a6e" }}>
              Services
            </span>
            <h2 className="font-semibold tracking-[-0.035em] leading-[1.04]" style={{ fontSize: "clamp(30px,4.5vw,52px)", color: "#1a2e35" }}>
              できること
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[15px] leading-[1.8]" style={{ color: "#4a6572" }}>
              AIを使いこなすことで、従来は専門家に依頼していた作業を
              スピーディーかつ低コストで実現します。
            </p>
            <div className="flex gap-5 mt-4">
              {["初回相談無料", "最短1週間対応"].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-[12.5px]" style={{ color: "#64748b" }}>
                  <span style={{ color: "#5dcfbe" }}>{icons.check}</span> {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Glass card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service, index, inView,
}: {
  service: (typeof services)[0]; index: number; inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07 + 0.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass-card p-7 flex flex-col gap-4 cursor-default group"
    >
      {/* Icon */}
      <div className="flex items-center justify-between">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: service.color, color: "#1a2e35" }}
        >
          {service.icon}
        </span>
        <span
          className="text-[11px] px-2.5 py-1 rounded-full font-medium"
          style={{ background: service.color, color: "#1a7a6e" }}
        >
          {service.tag}
        </span>
      </div>

      <div>
        <h3 className="text-[16px] font-semibold tracking-[-0.02em] mb-2" style={{ color: "#1a2e35" }}>
          {service.title}
        </h3>
        <p className="text-[13px] leading-[1.8]" style={{ color: "#4a6572" }}>
          {service.desc}
        </p>
      </div>

      <div
        className="flex items-center gap-1.5 text-[12px] font-medium mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: "#5dcfbe" }}
      >
        詳しく見る {icons.arrowUpRight}
      </div>
    </motion.div>
  );
}
