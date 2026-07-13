import { getNoteArticles } from "@/lib/note"
import { BlogGrid } from "@/components/blog-grid"

export async function BlogSection() {
  const articles = await getNoteArticles(8)

  // note側が取得できないときはセクションごと出さない
  if (articles.length === 0) return null

  return (
    <section id="blog" className="py-28 md:py-36 bg-soft-bg">
      <BlogGrid articles={articles} />
    </section>
  )
}
