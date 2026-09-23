import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { neon } from "@neondatabase/serverless"

/* お問い合わせフォームの Bot 対策（サーバー専用）。
   - 署名つきの受付票: フォームを開いた時刻を改ざんできない形で渡し、速すぎる送信を見分ける
   - 送信回数の上限: 同じ接続元・同じ宛先からの連続送信を止める（自動返信を悪用した迷惑メール送信も防ぐ） */

// 専用の鍵が無ければ Resend の鍵から導く（どちらも本番に必ずある値。鍵そのものは外に出ない）
const secret = createHash("sha256")
  .update(`allovv-contact-v1:${process.env.CONTACT_FORM_SECRET ?? process.env.RESEND_API_KEY ?? "dev"}`)
  .digest()

function sign(value: string) {
  return createHmac("sha256", secret).update(value).digest("base64url")
}

/* ---------- 受付票 ---------- */

/** 人が4項目を埋めるのにかかる時間より十分短い値 */
export const MIN_FILL_MS = 3000
const MAX_AGE_MS = 12 * 60 * 60 * 1000

export function issueFormToken() {
  const issuedAt = Date.now().toString()
  return `${issuedAt}.${sign(`form:${issuedAt}`)}`
}

export type TokenCheck = "ok" | "too-fast" | "expired" | "invalid"

export function checkFormToken(token: unknown): TokenCheck {
  if (typeof token !== "string") return "invalid"
  const [issuedAt, signature] = token.split(".")
  if (!issuedAt || !signature || !/^\d{13}$/.test(issuedAt)) return "invalid"

  const expected = Buffer.from(sign(`form:${issuedAt}`))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid"

  const elapsed = Date.now() - Number(issuedAt)
  if (elapsed < MIN_FILL_MS) return "too-fast"
  if (elapsed > MAX_AGE_MS) return "expired"
  return "ok"
}

/* ---------- 送信回数の上限 ---------- */

const LIMITS = {
  ipBurst: 3, // 同じ接続元から10分に3回まで
  ipDaily: 10, // 同じ接続元から1日10回まで
  emailDaily: 3, // 同じアドレス宛の自動返信は1日3回まで
}

/** IPアドレス・メールアドレスはそのまま保存せず、照合用の符号にしてから扱う */
function fingerprint(kind: "ip" | "email", value: string) {
  return sign(`${kind}:${value.toLowerCase()}`).slice(0, 32)
}

const connectionString =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.DATABASE_URL_UNPOOLED ?? ""

let schemaReady: Promise<void> | null = null

async function ensureSchema() {
  if (!schemaReady) {
    const q = neon(connectionString)
    schemaReady = (async () => {
      await q`
        create table if not exists contact_submissions (
          id         bigserial   primary key,
          ts         timestamptz not null default now(),
          ip_hash    text        not null,
          email_hash text        not null
        )`
      await q`create index if not exists contact_submissions_ts_idx on contact_submissions (ts desc)`
    })().catch((error) => {
      schemaReady = null
      throw error
    })
  }
  return schemaReady
}

type Counts = { ipBurst: number; ipDaily: number; emailDaily: number }

// DB の無いローカル用。本番は複数のインスタンスで数を共有するため Postgres に置く
const memory: { ts: number; ip: string; email: string }[] = []

async function countRecent(ip: string, email: string): Promise<Counts> {
  if (!connectionString) {
    const now = Date.now()
    const day = memory.filter((row) => now - row.ts < 24 * 60 * 60 * 1000)
    return {
      ipBurst: day.filter((row) => row.ip === ip && now - row.ts < 10 * 60 * 1000).length,
      ipDaily: day.filter((row) => row.ip === ip).length,
      emailDaily: day.filter((row) => row.email === email).length,
    }
  }

  await ensureSchema()
  const q = neon(connectionString)
  const rows = (await q`
    select
      count(*) filter (where ip_hash = ${ip} and ts > now() - interval '10 minutes') as ip_burst,
      count(*) filter (where ip_hash = ${ip})                                         as ip_daily,
      count(*) filter (where email_hash = ${email})                                   as email_daily
    from contact_submissions
    where ts > now() - interval '1 day'`) as Record<string, string | number>[]
  return {
    ipBurst: Number(rows[0]?.ip_burst ?? 0),
    ipDaily: Number(rows[0]?.ip_daily ?? 0),
    emailDaily: Number(rows[0]?.email_daily ?? 0),
  }
}

async function record(ip: string, email: string) {
  if (!connectionString) {
    while (memory.length > 0 && Date.now() - memory[0].ts > 24 * 60 * 60 * 1000) memory.shift()
    memory.push({ ts: Date.now(), ip, email })
    return
  }
  const q = neon(connectionString)
  await q`insert into contact_submissions (ip_hash, email_hash) values (${ip}, ${email})`
  // 判定に使うのは直近1日ぶんだけなので、2日を過ぎた行は消す
  await q`delete from contact_submissions where ts < now() - interval '2 days'`
}

/**
 * 上限内なら送信を1回ぶん記録して true を返す。
 * 記録先が不調な時は、お問い合わせを取りこぼさないよう通す
 */
export async function consumeSendQuota(ipAddress: string, email: string) {
  const ip = fingerprint("ip", ipAddress)
  const mail = fingerprint("email", email)
  try {
    const counts = await countRecent(ip, mail)
    if (
      counts.ipBurst >= LIMITS.ipBurst ||
      counts.ipDaily >= LIMITS.ipDaily ||
      counts.emailDaily >= LIMITS.emailDaily
    ) {
      return false
    }
    await record(ip, mail)
  } catch (error) {
    console.error("[contact] rate limit store failed", error)
  }
  return true
}
