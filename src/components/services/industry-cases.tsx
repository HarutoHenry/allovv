"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Case = {
  task: string
  before?: string
  after?: string
  metric?: string
  extra?: string
}

type Industry = {
  key: string
  icon: string
  label: string
  sublabel: string
  cases: Case[]
}

const industries: Industry[] = [
  {
    key: "shigyo",
    icon: "🏛️",
    label: "士業",
    sublabel: "税理士・行政書士・司法書士・社労士",
    cases: [
      { task: "顧客の質問への回答ドラフト作成", before: "1件 60分", after: "15分", extra: "空いた時間で顧問先が1.4倍に" },
      { task: "契約書・就業規則のレビュー", metric: "月20〜25時間 削減" },
      { task: "記帳・月次決算の下ごしらえ", metric: "入力作業 80%削減" },
    ],
  },
  {
    key: "fudosan",
    icon: "🏠",
    label: "不動産",
    sublabel: "売買・賃貸仲介・管理",
    cases: [
      { task: "ポータル掲載文の作成", before: "1物件 20分", after: "3分", extra: "掲載数3倍・反響率も向上" },
      { task: "物件案内文・オーナー月報の作成", metric: "月14〜18時間 削減" },
      { task: "紹介文の即時生成", metric: "反響率 1.5倍" },
    ],
  },
  {
    key: "kensetsu",
    icon: "🏗️",
    label: "建設・工務店",
    sublabel: "施工・設計・リフォーム",
    cases: [
      { task: "打ち合わせ議事録・見積更新", metric: "週8〜12時間 削減", extra: "設計担当1人あたり" },
      { task: "見積書の作成", before: "週12時間", after: "週3時間" },
      { task: "工事日報・写真整理", before: "30分", after: "5分" },
    ],
  },
  {
    key: "seizo",
    icon: "🏭",
    label: "製造・金属加工",
    sublabel: "部品加工・金型・プレス",
    cases: [
      { task: "図面と過去データから見積ドラフト生成", before: "1件 30分", after: "3分", extra: "新規取引の獲得にも" },
      { task: "画像AIによる品質検査", metric: "検査時間 80%削減", extra: "不良流出も60%低下" },
      { task: "見積作成（類似案件検索・積算）", metric: "月60〜90時間 削減" },
    ],
  },
  {
    key: "kouri",
    icon: "🛒",
    label: "小売・EC",
    sublabel: "ネットショップ・店舗販売",
    cases: [
      { task: "商品説明文の作成", before: "1点 30分", after: "5分", extra: "掲載できる商品数が大幅増" },
      { task: "需要予測による発注最適化", metric: "食品廃棄 38%削減", extra: "年間コスト約180万円圧縮" },
      { task: "問い合わせチャットボット", metric: "転換率 1.8倍", extra: "対応コスト月12万円削減" },
    ],
  },
  {
    key: "inshoku",
    icon: "🍶",
    label: "飲食店",
    sublabel: "居酒屋・レストラン・カフェ",
    cases: [
      { task: "シフト作成の下支え", metric: "店長の作成時間 90%削減" },
      { task: "食材の発注予測", before: "廃棄 月15万円", after: "6万円", extra: "60%削減" },
      { task: "SNS投稿の自動生成", metric: "来店 15%増", extra: "フォロワー3倍" },
    ],
  },
  {
    key: "koukoku",
    icon: "🎨",
    label: "広告・デザイン",
    sublabel: "制作会社・クリエイティブ",
    cases: [
      { task: "企画書の初稿づくり", before: "6〜8時間", after: "2〜3時間", extra: "提案件数が1.4倍に" },
      { task: "議事録・次アクション整理", metric: "会議時間 半減" },
      { task: "チラシ原稿の内製化", metric: "年間180万円 削減" },
    ],
  },
  {
    key: "biyou",
    icon: "💇",
    label: "美容・サロン",
    sublabel: "美容室・エステ・ネイル",
    cases: [
      { task: "SNS投稿づくりの内製化", metric: "新規客 41%増", extra: "投稿頻度アップで" },
      { task: "投稿ツールの活用", metric: "新規来店 3倍" },
    ],
  },
  {
    key: "kaigo",
    icon: "🧸",
    label: "介護・保育",
    sublabel: "施設・グループホーム・保育園",
    cases: [
      { task: "介護記録（ナラティブ部分）の作成", before: "1日 90分", after: "25分" },
      { task: "連絡帳の作成補助", metric: "残業ゼロ化", extra: "保育士の負担を大幅軽減" },
    ],
  },
  {
    key: "butsuryu",
    icon: "🚚",
    label: "物流・運送",
    sublabel: "運送・配送・倉庫",
    cases: [
      { task: "配車計画の作成", before: "1日 3時間", after: "40分" },
      { task: "配送ルートの最適化", metric: "燃料コスト 月22%削減" },
    ],
  },
]

const spring = { type: "spring" as const, stiffness: 380, damping: 34 }

export function IndustryCases() {
  const [activeKey, setActiveKey] = useState(industries[0].key)
  const active = industries.find((i) => i.key === activeKey)!

  return (
    <div className="max-w-[1100px] mx-auto px-5 pb-28">
      <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5 text-center">
        Industry Cases
      </p>
      <h2 className="text-white text-2xl md:text-4xl font-bold text-center mb-4">
        業界別・AI活用事例
      </h2>
      <p className="text-white/50 text-sm md:text-base text-center max-w-xl mx-auto leading-relaxed mb-12">
        気になる業種を選ぶと、実際に出ている効果が表示されます。
        <br className="hidden md:block" />
        メール対応はほんの入り口。同じ考え方で、業種ごとの定型業務を
        <br className="hidden md:block" />
        仕組み化できます。
      </p>

      {/* 業種セレクタ */}
      <div className="flex flex-wrap justify-center gap-2 mb-14">
        {industries.map((ind) => {
          const isActive = ind.key === activeKey
          return (
            <button
              key={ind.key}
              type="button"
              onClick={() => setActiveKey(ind.key)}
              className="relative px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-300"
              style={{
                border: isActive ? "1px solid transparent" : "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="industry-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #7dd8ca 0%, #9fe8dc 100%)",
                    boxShadow: "0 0 24px rgba(125,216,202,0.5)",
                  }}
                  transition={spring}
                />
              )}
              <span
                className="relative z-10 flex items-center gap-1.5"
                style={{ color: isActive ? "#0f1e24" : "rgba(255,255,255,0.6)" }}
              >
                <span className="text-base leading-none">{ind.icon}</span>
                {ind.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* 詳細パネル */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeKey}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 業種ヘッダー */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring, delay: 0.05 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{
                background: "rgba(125,216,202,0.1)",
                border: "1px solid rgba(125,216,202,0.35)",
                boxShadow: "0 0 32px rgba(125,216,202,0.18)",
              }}
            >
              <span className="text-3xl">{active.icon}</span>
            </motion.div>
            <h3 className="text-white text-xl md:text-2xl font-bold">{active.label}</h3>
            <p className="text-white/40 text-sm mt-1">{active.sublabel}</p>
          </div>

          {/* 事例カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {active.cases.map((c, i) => (
              <motion.div
                key={c.task}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.09, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-2xl p-6 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(125,216,202,0.18)",
                  boxShadow: "0 0 0 rgba(125,216,202,0)",
                }}
              >
                {/* 上端のグローライン */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(125,216,202,0.7), transparent)" }}
                />
                <p className="text-white/55 text-xs leading-relaxed mb-4 min-h-[2.5rem]">{c.task}</p>

                {c.before && c.after ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-white/35 text-sm line-through decoration-white/25">{c.before}</span>
                    <span className="text-[#7dd8ca]">→</span>
                    <span
                      className="text-2xl font-bold"
                      style={{
                        background: "linear-gradient(135deg, #7dd8ca 0%, #9fe8dc 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {c.after}
                    </span>
                  </div>
                ) : (
                  <p
                    className="text-2xl font-bold"
                    style={{
                      background: "linear-gradient(135deg, #7dd8ca 0%, #9fe8dc 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {c.metric}
                  </p>
                )}

                {c.extra && <p className="text-white/40 text-xs mt-3 leading-relaxed">{c.extra}</p>}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-white/30 text-xs mt-12 max-w-2xl mx-auto leading-relaxed">
        ※ 各種公開事例をもとにした業界の一般的な成果であり、特定の導入結果を保証するものではありません。
      </p>
    </div>
  )
}
