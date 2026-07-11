import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "ページが見つかりません",
}

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main id="main" className="min-h-[100dvh] flex items-center justify-center soft-gradient-bg px-5">
        <div className="text-center max-w-md">
          <p className="font-display font-bold text-7xl md:text-8xl gradient-text mb-6">404</p>
          <h1 className="text-navy font-bold text-xl md:text-2xl mb-4">
            ページが見つかりません
          </h1>
          <p className="text-navy/60 text-sm leading-relaxed mb-10">
            お探しのページは移動または削除された可能性があります。
            URLをご確認いただくか、トップページへお戻りください。
          </p>
          <Link
            href="/"
            className="gradient-btn inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full"
          >
            トップページへ戻る
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
