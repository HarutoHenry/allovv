/* お問い合わせフォームのメールアドレス検査。ブラウザとサーバーの両方で同じものを使う。
   ドメインが実際にメールを受け取れるか（MXレコード）はサーバー側の email-dns.ts で確かめる */

export type EmailProblem = "empty" | "format" | "disposable" | "noreply"

export type EmailCheck =
  | { ok: true; email: string; domain: string }
  | { ok: false; email: string; problem: EmailProblem; message: string }

export const EMAIL_MESSAGES: Record<EmailProblem | "undeliverable", string> = {
  empty: "メールアドレスを入力してください",
  format: "正しい形式のメールアドレスを入力してください",
  disposable: "使い捨てのメールアドレスはご利用いただけません",
  noreply: "返信を受け取れるメールアドレスを入力してください",
  undeliverable: "このドメインはメールを受け取れないようです。アドレスをご確認ください",
}

// 使い捨てメールの代表的なドメイン（サブドメインも含めて弾く）
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "sharklasers.com",
  "grr.la",
  "10minutemail.com",
  "10minutemail.net",
  "temp-mail.org",
  "temp-mail.io",
  "tempmail.com",
  "tempmailo.com",
  "throwawaymail.com",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "trashmail.com",
  "trashmail.de",
  "getnada.com",
  "dispostable.com",
  "maildrop.cc",
  "mailnesia.com",
  "mintemail.com",
  "mohmal.com",
  "fakeinbox.com",
  "emailondeck.com",
  "discard.email",
  "mytemp.email",
  "burnermail.io",
  "mail.tm",
  "moakt.com",
  "spamgourmet.com",
])

// 返信しても届かない送信専用アドレス
const NOREPLY_LOCAL = /^(no-?reply|do-?not-?reply|mailer-daemon)$/i

// 例示用に予約されていて実在しないドメイン（RFC 2606 / JPRS）
const RESERVED_DOMAIN = /(^|\.)(example|test|invalid|localhost)$|^example\.(com|net|org|jp|co\.jp|ne\.jp)$/

// ローカル部は日本の携帯キャリアの旧アドレス（ドットの連続・@直前のドット）も通すため、先頭以外のドットを許す
const LOCAL_PART = /^[a-z0-9!#$%&'*+/=?^_`{|}~-][a-z0-9!#$%&'*+/=?^_`{|}~.-]*$/i
const DOMAIN_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/
const TLD = /^(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/

/** 全角の英数字・記号（＠ や ．）を半角に直し、空白やゼロ幅文字を取り除く */
export function normalizeEmail(raw: string) {
  return raw
    .normalize("NFKC")
    .replace(/[\s​-‍⁠﻿]/g, "")
    .replace(/。/g, ".")
}

/** 日本語ドメインは punycode に直して小文字化する。解釈できなければ null */
function asciiDomain(domain: string) {
  try {
    return new URL(`http://${domain}`).hostname.replace(/\.$/, "")
  } catch {
    return null
  }
}

export function checkEmail(raw: string): EmailCheck {
  const email = normalizeEmail(raw)
  if (!email) return { ok: false, email, problem: "empty", message: EMAIL_MESSAGES.empty }

  const fail = (problem: EmailProblem): EmailCheck => ({
    ok: false,
    email,
    problem,
    message: EMAIL_MESSAGES[problem],
  })

  const at = email.lastIndexOf("@")
  if (at <= 0 || at !== email.indexOf("@") || email.length > 254) return fail("format")

  const local = email.slice(0, at)
  const rawDomain = email.slice(at + 1)
  // URL として読むとポートやパスが黙って落とされるので、その手の記号は先に弾く
  if (/[/\\:?#%[\]]/.test(rawDomain)) return fail("format")
  const domain = asciiDomain(rawDomain)
  if (local.length > 64 || !LOCAL_PART.test(local) || !domain) return fail("format")

  const labels = domain.split(".")
  if (
    labels.length < 2 ||
    !labels.every((label) => DOMAIN_LABEL.test(label)) ||
    !TLD.test(labels[labels.length - 1]) ||
    RESERVED_DOMAIN.test(domain)
  ) {
    return fail("format")
  }

  for (let i = 0; i < labels.length - 1; i++) {
    if (DISPOSABLE_DOMAINS.has(labels.slice(i).join("."))) return fail("disposable")
  }
  if (NOREPLY_LOCAL.test(local)) return fail("noreply")

  return { ok: true, email: `${local}@${domain}`, domain }
}

/* ---------- ドメインの打ち間違い候補（gmial.com → gmail.com など） ---------- */

// 候補として示す先。短いドメイン（au.com・me.com 等）は別の実在ドメインと紛れるので入れない
const POPULAR_DOMAINS = [
  "gmail.com",
  "yahoo.co.jp",
  "icloud.com",
  "outlook.jp",
  "outlook.com",
  "hotmail.com",
  "hotmail.co.jp",
  "docomo.ne.jp",
  "ezweb.ne.jp",
  "softbank.ne.jp",
  "i.softbank.jp",
  "nifty.com",
  "ybb.ne.jp",
  "yahoo.com",
  "googlemail.com",
]

// 候補に近いが実在するドメイン。これらは打ち間違い扱いしない
const KNOWN_DOMAINS = new Set([
  ...POPULAR_DOMAINS,
  "au.com",
  "me.com",
  "mac.com",
  "live.jp",
  "live.com",
  "msn.com",
  "aol.com",
  "mail.com",
  "email.com",
  "gmx.com",
  "ymail.com",
  "proton.me",
  "protonmail.com",
])

/** 隣り合う2文字の入れ替え（gmial）も1回と数える編集距離 */
function editDistance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  )
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      }
    }
  }
  return d[a.length][b.length]
}

/** 有名ドメインの打ち間違いらしければ、直したアドレスを返す */
export function suggestEmail(raw: string) {
  const result = checkEmail(raw)
  if (!result.ok || KNOWN_DOMAINS.has(result.domain)) return null

  let best: { domain: string; distance: number } | null = null
  for (const candidate of POPULAR_DOMAINS) {
    const distance = editDistance(result.domain, candidate)
    if (distance <= 2 && (!best || distance < best.distance)) best = { domain: candidate, distance }
  }
  if (!best) return null

  const local = result.email.slice(0, result.email.lastIndexOf("@"))
  return `${local}@${best.domain}`
}
