"use client"

import { useId, useRef, useState } from "react"
import { SlipMark } from "@/components/services/slip-mark"

type Case = {
  task: string
  before?: string
  after?: string
  metric?: string
  extra?: string
}

type Industry = {
  key: string
  label: string
  sublabel: string
  cases: Case[]
}

const industries: Industry[] = [
  {
    key: "shigyo",
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
    label: "小売・EC",
    sublabel: "ネットショップ・店舗販売",
    cases: [
      { task: "商品説明文の作成", before: "1点 30分", after: "5分", extra: "掲載できる商品数が大幅増" },
      { task: "在庫・発注管理の最適化", metric: "週15時間削減", extra: "過剰在庫の改善にも" },
      { task: "問い合わせチャットボット", metric: "転換率 1.8倍", extra: "対応コスト月12万円削減" },
    ],
  },
  {
    key: "inshoku",
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
    label: "美容・サロン",
    sublabel: "美容室・エステ・ネイル",
    cases: [
      { task: "SNS投稿づくりの内製化", metric: "新規客 41%増", extra: "投稿頻度アップで" },
      { task: "投稿ツールの活用", metric: "新規来店 3倍" },
    ],
  },
  {
    key: "kaigo",
    label: "介護・保育",
    sublabel: "施設・グループホーム・保育園",
    cases: [
      { task: "介護記録（ナラティブ部分）の作成", before: "1日 90分", after: "25分" },
      { task: "連絡帳の作成補助", metric: "残業ゼロ化", extra: "保育士の負担を大幅軽減" },
    ],
  },
  {
    key: "butsuryu",
    label: "物流・運送",
    sublabel: "運送・配送・倉庫",
    cases: [
      { task: "配車計画の作成", before: "1日 3時間", after: "40分" },
      { task: "配送ルートの最適化", metric: "燃料コスト 月22%削減" },
    ],
  },
]

const figure = "font-num font-bold text-[#9fe8dc] text-[clamp(1.625rem,3vw,2.25rem)] leading-[1.15] tracking-[-0.01em]"

/**
 * 業種の一覧（左）と、選んだ業種の事例（右）。スマホでは業種が横に並んで横スクロールになる。
 * 業種の切り替えはタブと同じ操作（← → ↑ ↓ / Home / End）。キーボードで切り替えた時は事例を動かさずに出す
 */
export function IndustryCases() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [instant, setInstant] = useState(false)
  const id = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const active = industries[activeIndex]

  const select = (i: number, byKeyboard: boolean) => {
    setInstant(byKeyboard)
    setActiveIndex(i)
    // スマホの横スクロールで、端で切れている業種を押した時に見える位置まで寄せる
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    buttons.current[i]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: byKeyboard || reduce ? "auto" : "smooth",
    })
  }

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = industries.length - 1
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : -1
    if (next < 0) return
    e.preventDefault()
    select(next, true)
    buttons.current[next]?.focus()
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-16 md:pt-24 pb-24 md:pb-32">
      <div>
        <p className="svc-kicker">
          <SlipMark />
          Industry Cases
        </p>
        <h2 className="svc-h2 text-white mt-5">業界別・AI活用事例</h2>
      </div>

      <div
        data-instant={instant ? "" : undefined}
        className="mt-12 md:mt-16 grid lg:grid-cols-12 gap-8 lg:gap-10"
      >
        <div
          role="tablist"
          aria-label="業種"
          aria-orientation="vertical"
          className="lg:col-span-3 -mx-5 px-5 md:-mx-10 md:px-10 lg:mx-0 lg:px-0 flex lg:flex-col gap-2 lg:gap-0 overflow-x-auto lg:overflow-visible no-scrollbar snap-x scroll-px-5 lg:border-b lg:border-white/10"
        >
          {industries.map((ind, i) => {
            const selected = i === activeIndex
            return (
              <button
                key={ind.key}
                ref={(el) => {
                  buttons.current[i] = el
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${ind.key}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={(e) => select(i, e.detail === 0)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="shrink-0 snap-start flex items-center gap-3 whitespace-nowrap rounded-full border border-white/15 px-4 py-2.5 text-[14px] font-bold text-white/65 transition-colors duration-200 aria-selected:border-transparent aria-selected:bg-[#7dd8ca] aria-selected:text-[#0f1e24] lg:w-full lg:rounded-none lg:border-0 lg:border-t lg:border-white/10 lg:px-0 lg:py-4 lg:text-[15px] lg:text-white/55 lg:aria-selected:border-white/10 lg:aria-selected:bg-transparent lg:aria-selected:text-white svc-ind-tab"
              >
                <SlipMark className="svc-ind-mark hidden lg:block" />
                <span className="svc-ind-label">{ind.label}</span>
              </button>
            )
          })}
        </div>

        <div className="lg:col-span-8 lg:col-start-5">
          <div
            key={active.key}
            role="tabpanel"
            id={`${id}-panel`}
            aria-labelledby={`${id}-tab-${active.key}`}
            tabIndex={0}
            className="rounded-sm"
          >
            <div className="svc-case flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-6 pb-5 border-b border-white/10">
              <h3 className="text-white text-[1.625rem] md:text-[2rem] font-bold leading-[1.3]">{active.label}</h3>
              <p className="text-white/55 text-[13px] md:text-sm">{active.sublabel}</p>
            </div>

            <ul>
              {active.cases.map((c, i) => (
                <li
                  key={c.task}
                  className="svc-case grid md:grid-cols-12 gap-3 md:gap-8 py-6 md:py-8 border-b border-white/10"
                  style={{ "--i": i + 1 } as React.CSSProperties}
                >
                  <p className="md:col-span-5 text-white/80 text-[15px] leading-[1.7] md:pt-1.5">{c.task}</p>
                  <div className="md:col-span-7">
                    {c.before && c.after ? (
                      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-num text-white/50 text-[15px] line-through decoration-white/35">
                          {c.before}
                        </span>
                        <svg
                          viewBox="0 0 20 10"
                          width="20"
                          height="10"
                          aria-hidden="true"
                          className="self-center text-[#7dd8ca]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M0 5h18M14 1l4 4-4 4" />
                        </svg>
                        <span className="sr-only">から</span>
                        <span className={figure}>{c.after}</span>
                      </p>
                    ) : (
                      <p className={figure}>{c.metric}</p>
                    )}
                    {c.extra && <p className="text-white/60 text-[13px] md:text-sm mt-2">{c.extra}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="svc-jp mt-8 text-white/50 text-[12px] md:text-[13px] leading-[1.8] max-w-[62ch]">
            ※ 各種公開事例をもとにした業界の一般的な成果であり、特定の導入結果を保証するものではありません。
          </p>
        </div>
      </div>
    </div>
  )
}
