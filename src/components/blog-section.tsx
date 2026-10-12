import Link from "next/link"
import { getNoteArticles } from "@/lib/note"
import { BlogGrid } from "@/components/blog-grid"

export async function BlogSection() {
  const articles = await getNoteArticles(8)


  return (
    <section id="blog" className="py-28 md:py-36 bg-soft-bg">
      {articles.length > 0 && <BlogGrid articles={articles} />}
      <div className="max-w-[900px] mx-auto px-5 mt-10 text-center">
        <Link href="/guides" className="inline-block text-[#286d5e] underline underline-offset-4 text-sm leading-relaxed">
          AI導入・業務改善ガイド：進め方と支援の選び方 →
        </Link>
      </div>
    </section>
  )
}
