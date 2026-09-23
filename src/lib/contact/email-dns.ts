import { promises as dns } from "node:dns"

/* ドメインが実際にメールを受け取れるかを DNS で確かめる（サーバー専用）。
   DNS 自体が不調な時は "unknown" を返し、本物のお問い合わせを取りこぼさないよう通す */

export type MailDomainStatus = "ok" | "no-mail" | "unknown"

const TIMEOUT_MS = 2500
const NOT_FOUND = new Set(["ENOTFOUND", "ENODATA", "ENONAME", "NXDOMAIN"])

function withTimeout<T>(promise: Promise<T>) {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(Object.assign(new Error("timeout"), { code: "ETIMEOUT" })),
      TIMEOUT_MS,
    )
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

function code(error: unknown) {
  return (error as { code?: string })?.code ?? ""
}

/** MX が無いドメインでも A/AAAA があればそこへ配送される（RFC 5321 の暗黙の MX） */
async function hasAddress(domain: string): Promise<MailDomainStatus> {
  for (const resolve of [dns.resolve4, dns.resolve6]) {
    try {
      if ((await withTimeout(resolve(domain))).length > 0) return "ok"
    } catch (error) {
      if (!NOT_FOUND.has(code(error))) return "unknown"
    }
  }
  return "no-mail"
}

export async function checkMailDomain(domain: string): Promise<MailDomainStatus> {
  try {
    const records = await withTimeout(dns.resolveMx(domain))
    if (records.length === 0) return hasAddress(domain)
    // 「0 .」の Null MX（RFC 7505）は「このドメインはメールを受け取らない」という宣言
    if (records.every((record) => record.exchange === "" || record.exchange === ".")) return "no-mail"
    return "ok"
  } catch (error) {
    const reason = code(error)
    if (reason === "ENODATA") return hasAddress(domain)
    if (NOT_FOUND.has(reason)) return "no-mail"
    return "unknown"
  }
}
