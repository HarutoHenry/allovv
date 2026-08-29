import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "ホームページ制作",
  description:
    "Allovvのホームページ制作サービスです。¥50,000〜、最短5営業日から。スマートフォン表示は標準対応、オンライン打ち合わせに対応しています。公開後の運用はAI仕組み化でそのままお任せいただけます。",
}

const included = [
  {
    title: "スマートフォン表示",
    body: "標準で対応します。追加料金はいただきません。パソコン・スマホ・タブレットのどれで見ても崩れない作りにします。",
  },
  {
    title: "オンライン打ち合わせ",
    body: "遠方でもご対応いただけます。ご希望があれば対面でもお伺いします。",
  },
  {
    title: "最短5営業日から",
    body: "内容によって変わりますが、シンプルな構成であれば1週間ほどで公開まで進められます。",
  },
  {
    title: "公開までまとめてお任せ",
    body: "文章の構成、写真の配置、ドメインやサーバーまわりの設定まで含めてご相談いただけます。",
  },
]

const flow = [
  {
    step: "01",
    title: "ヒアリング",
    body: "どんな会社で、どんなお客様に、何を伝えたいのか。ページ数や必要な機能もここで整理します。オンラインで30分ほどです。",
  },
  {
    step: "02",
    title: "お見積り・ご契約",
    body: "内容が固まった段階で、金額と期間をお出しします。ここまでは費用をいただきません。",
  },
  {
    step: "03",
    title: "制作",
    body: "たたき台をお見せしながら進めます。文章や写真は、お持ちのものをお預かりして整えることもできます。",
  },
  {
    step: "04",
    title: "公開・お引き渡し",
    body: "公開して終わりにはしません。ご自身で更新される場合は、操作のご説明までいたします。",
  },
]

const targets = [
  "ホームページを持っていない、名刺と電話だけで営業している",
  "何年も前に作ったまま、スマホで見ると崩れている",
  "更新を頼むたびに費用がかかるので、放置してしまっている",
  "作りたいが、何から決めればいいのか分からない",
]

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function WebProductionPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#0f1e24]">

        {/* Hero */}
        <div className="pt-36 pb-20 text-center px-5">
          <Link
            href="/#business"
            className="inline-flex items-center gap-2 text-[#7dd8ca]/60 text-xs font-display tracking-[0.15em] uppercase hover:text-[#7dd8ca] transition-colors mb-8"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            SERVICES
          </Link>

          <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5">
            Web Production
          </p>

          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-6">
            ホームページ制作
          </h1>

          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            伝えたいことが伝わる、シンプルで見やすいホームページを。<br />
            公開したあとの運用まで含めてご相談いただけます。
          </p>
        </div>

        {/* Price */}
        <div className="max-w-[560px] mx-auto px-5 pb-24">
          <div
            className="relative rounded-2xl px-8 py-12 text-center"
            style={{
              background: "rgba(125, 216, 202, 0.06)",
              border: "1px solid rgba(125, 216, 202, 0.45)",
              boxShadow: "0 0 40px rgba(125, 216, 202, 0.12), 0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <p className="text-white/40 text-sm mb-4">制作費用</p>
            <p
              className="text-5xl font-bold mb-3"
              style={{
                background: "linear-gradient(135deg, #7dd8ca 0%, #9fe8dc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ¥50,000〜
            </p>
            <p className="text-white/30 text-xs mb-8">税別 / 一度きり</p>

            <p className="text-white/60 text-sm leading-relaxed mb-8">
              ページ数や必要な機能によって変わります。<br />
              内容をお伺いしたうえで、正式なお見積りをご提示します。<br />
              個人・フリーランスの方向けのプランもご用意しています。
            </p>

            <Link
              href="/#contact"
              className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #c5f5e8 0%, #ffe4ef 100%)", color: "#1a2e35" }}
            >
              無料でお見積りを依頼する
            </Link>

            <p className="text-white/25 text-xs mt-5">
              お見積りまでは費用をいただきません
            </p>
          </div>
        </div>

        {/* こんな方に */}
        <div className="border-t border-white/5 py-24 px-5">
          <div className="max-w-[760px] mx-auto">
            <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5 text-center">
              For
            </p>
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-12 text-center">
              こんな方にご利用いただけます
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {targets.map((target) => (
                <li
                  key={target}
                  className="flex items-start gap-3 text-white/65 text-sm leading-relaxed rounded-xl px-5 py-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="text-[#7dd8ca]">
                    <CheckIcon />
                  </span>
                  {target}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 含まれるもの */}
        <div className="border-t border-white/5 py-24 px-5">
          <div className="max-w-[900px] mx-auto">
            <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5 text-center">
              Included
            </p>
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-12 text-center">
              標準で含まれるもの
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {included.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-7"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <h3 className="text-white text-lg font-bold mb-3">{item.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 制作の流れ */}
        <div className="border-t border-white/5 py-24 px-5">
          <div className="max-w-[760px] mx-auto">
            <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5 text-center">
              Flow
            </p>
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-12 text-center">
              制作の流れ
            </h2>
            <ol className="space-y-4">
              {flow.map((item) => (
                <li
                  key={item.step}
                  className="flex items-start gap-5 rounded-2xl px-6 py-6"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="font-display text-[#7dd8ca]/70 text-sm font-light tracking-widest shrink-0 pt-1">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-white text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-center text-white/30 text-xs mt-10">
              最短5営業日から。内容によって期間は変わります。
            </p>
          </div>
        </div>

        {/* 公開後の運用 → AI仕組み化への導線 */}
        <div className="border-t border-white/5 py-24 px-5">
          <div className="max-w-[760px] mx-auto text-center">
            <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5">
              Next
            </p>
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-6 leading-snug">
              作ったあとの、問い合わせ対応まで
            </h2>
            <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10">
              ホームページができると、問い合わせが届くようになります。<br className="hidden md:block" />
              その返信を一件ずつ書くのは、想像以上に時間を取られます。<br className="hidden md:block" />
              Allovvは、その返信の下書きまでをAIに任せる仕組みまでご用意しています。<br className="hidden md:block" />
              作って終わりではなく、届いたあとの手間まで含めてご相談ください。
            </p>
            <Link
              href="/services/ai-consulting"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              AI仕組み化の料金を見る
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="border-t border-white/5 py-24 text-center px-5">
          <p className="font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-5">
            CONTACT
          </p>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
            まずはご相談ください
          </h2>
          <p className="text-white/40 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
            どんなホームページにしたいか決まっていない段階で構いません。<br />
            ご状況をお伺いしたうえで、必要な内容と金額をご提示します。
          </p>
          <Link
            href="/#contact"
            className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #c5f5e8 0%, #ffe4ef 100%)", color: "#1a2e35" }}
          >
            無料相談はこちら
          </Link>
          <p className="text-center text-xs mt-8">
            <Link href="/faq" className="text-[#7dd8ca]/60 hover:text-[#7dd8ca] transition-colors underline underline-offset-4">
              よくあるご質問はこちら
            </Link>
          </p>
        </div>

      </main>
      <Footer />
    </>
  )
}
