"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { NOTE_PROFILE_URL, type NoteArticle } from "@/lib/note"

export function BlogGrid({ articles }: { articles: NoteArticle[] }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div ref={ref} className="max-w-[1160px] mx-auto px-5">
      {/* Section Label */}
      <p className={`font-display font-light text-xs tracking-[0.2em] uppercase text-[#7dd8ca] mb-6 text-center transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        BLOG
      </p>

      {/* Heading */}
      <h2 className={`text-navy font-bold text-2xl md:text-3xl leading-relaxed mb-4 text-center transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        AI活用のヒント
      </h2>

      {/* Sub */}
      <p className={`text-navy/60 text-sm md:text-base text-center mb-14 transition-all duration-600 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        業種別のAI活用法や業務効率化の実践ノウハウを、noteで発信しています。
      </p>

      {/* Articles */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {articles.map((article, index) => (
          <li
            key={article.key}
            className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${200 + index * 80}ms` }}
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card feature-card group flex h-full flex-col overflow-hidden text-left transition-transform duration-500 hover:-translate-y-1.5"
            >
              {/* Eyecatch */}
              <div className="relative aspect-[1.91/1] w-full overflow-hidden bg-mint-light">
                {article.eyecatch ? (
                  <Image
                    src={article.eyecatch}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 soft-gradient-bg" />
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <time
                  dateTime={article.publishedAt}
                  className="font-display text-xs text-navy/50 tabular-nums mb-2"
                >
                  {article.displayDate}
                </time>
                <h3 className="text-navy text-sm font-medium leading-relaxed line-clamp-3 transition-colors group-hover:text-[#4aa898]">
                  {article.title}
                </h3>
                <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[#5fb8ab] text-xs font-medium transition-all group-hover:gap-2.5">
                  noteで読む
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="text-center">
        <a
          href={NOTE_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`gradient-btn inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full transition-all ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '820ms' }}
        >
          noteで記事をもっと見る
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  )
}
