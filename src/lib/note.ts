export const NOTE_PROFILE_URL = "https://note.com/allovv"

const NOTE_API = "https://note.com/api/v2/creators/allovv/contents?kind=note"

/** 1時間ごとに再取得（noteへの投稿が自動で反映される） */
const REVALIDATE_SECONDS = 3600

export type NoteArticle = {
  key: string
  title: string
  url: string
  eyecatch: string | null
  publishedAt: string
  displayDate: string
  likeCount: number
}

type NoteApiContent = {
  key: string
  name: string
  noteUrl: string
  eyecatch: string | null
  publishAt: string
  likeCount: number
  status: string
}

type NoteApiResponse = {
  data?: {
    contents?: NoteApiContent[]
    isLastPage?: boolean
  }
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}.${m}.${day}`
}

async function fetchPage(page: number): Promise<NoteApiContent[]> {
  const res = await fetch(`${NOTE_API}&page=${page}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  })
  if (!res.ok) throw new Error(`note API responded ${res.status}`)
  const json = (await res.json()) as NoteApiResponse
  return json.data?.contents ?? []
}

/**
 * note の公開記事を新しい順に取得する。
 * noteが落ちていてもサイト全体が壊れないよう、失敗時は空配列を返す。
 */
export async function getNoteArticles(limit = 8): Promise<NoteArticle[]> {
  try {
    const collected: NoteApiContent[] = []
    for (let page = 1; page <= 3 && collected.length < limit; page++) {
      const contents = await fetchPage(page)
      if (contents.length === 0) break
      collected.push(...contents)
    }

    return collected
      .filter((c) => c.status === "published")
      .slice(0, limit)
      .map((c) => ({
        key: c.key,
        title: c.name,
        url: c.noteUrl,
        eyecatch: c.eyecatch || null,
        publishedAt: c.publishAt,
        displayDate: formatDate(c.publishAt),
        likeCount: c.likeCount ?? 0,
      }))
  } catch (error) {
    console.error("Failed to fetch note articles:", error)
    return []
  }
}
