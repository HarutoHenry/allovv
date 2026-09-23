import { Resend } from "resend"
import { NextResponse } from "next/server"
import { checkEmail, EMAIL_MESSAGES } from "@/lib/contact/email"
import { checkMailDomain } from "@/lib/contact/email-dns"
import { checkFormToken, consumeSendQuota, issueFormToken } from "@/lib/contact/guard"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const resend = new Resend(process.env.RESEND_API_KEY)

const TYPE_LABELS: Record<string, string> = {
  service: "サービスについて",
  consulting: "AI仕組み化のご相談",
  creative: "AIクリエイティブ制作",
  partnership: "業務提携について",
  media: "取材・メディア掲載",
  career: "採用について",
  other: "その他",
}

/** HTMLメール本文に値を埋め込む前にエスケープする */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** 改行を <br> に変換（エスケープ済み文字列に対して使う） */
function nl2br(value: string) {
  return value.replace(/\r?\n/g, "<br>")
}

type ContactPayload = {
  name: string
  company: string
  email: string
  typeLabel: string
  message: string
}

// ── 事業者（Allovv）宛の通知メール ──
function ownerNotification({ name, company, email, typeLabel, message }: ContactPayload) {
  const text = `Allovv公式サイトのお問い合わせフォームから新しいお問い合わせが届きました。

差出人　${name}${company ? `（${company}）` : ""}
メール　${email}
種別　　${typeLabel}

────────────────
【お問い合わせ内容】
${message}
────────────────

※このメールに返信すると、そのままお客様（${email}）へ返信できます。`

  const html = `<div style="font-family:'Hiragino Sans','Yu Gothic',sans-serif;font-size:14px;line-height:1.9;color:#1a2e35;">
  <p style="margin:0 0 16px;">Allovv公式サイトのお問い合わせフォームから新しいお問い合わせが届きました。</p>
  <table style="border-collapse:collapse;margin:0 0 20px;">
    <tr><td style="padding:2px 16px 2px 0;color:#64748b;">差出人</td><td style="padding:2px 0;">${escapeHtml(name)}${company ? `（${escapeHtml(company)}）` : ""}</td></tr>
    <tr><td style="padding:2px 16px 2px 0;color:#64748b;">メール</td><td style="padding:2px 0;">${escapeHtml(email)}</td></tr>
    <tr><td style="padding:2px 16px 2px 0;color:#64748b;">種別</td><td style="padding:2px 0;">${escapeHtml(typeLabel)}</td></tr>
  </table>
  <div style="border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:16px 0;margin:0 0 16px;">
    <p style="margin:0 0 8px;font-weight:600;">お問い合わせ内容</p>
    <p style="margin:0;">${nl2br(escapeHtml(message))}</p>
  </div>
  <p style="margin:0;color:#64748b;font-size:13px;">※このメールに返信すると、そのままお客様（${escapeHtml(email)}）へ返信できます。</p>
</div>`

  return { text, html }
}

// ── お問い合わせ本人宛の自動返信メール ──
function autoReply({ name, company, typeLabel, message }: ContactPayload) {
  const text = `${name} 様

この度は、Allovvへお問い合わせいただき、誠にありがとうございます。
下記の内容でお問い合わせを承りました。

────────────────
お名前　${name}${company ? `\n会社名　${company}` : ""}
種別　　${typeLabel}

【お問い合わせ内容】
${message}
────────────────

内容を確認のうえ、通常2営業日以内に担当者よりご連絡いたします。
今しばらくお待ちくださいますようお願い申し上げます。

なお、本メールにお心当たりのない場合は、お手数ですが破棄いただけますと幸いです。

────────────────
Allovv（アロー）
代表　三沼 春斗（Minuma Haruto）

AIによる業務自動化を自ら実践する実務家。
Gmail × Make × Claude AI を組み合わせたメール自動化システムを自社開発し、
日々の業務で運用しています。「作ったことがある」ではなく「毎日動かしている」
経験をもとに、中小企業・個人事業主の業務の仕組み化を、構築から定着まで一気通貫で支援します。

Web　　https://www.allovv.com
所在地　神奈川県横浜市
────────────────`

  const html = `<div style="font-family:'Hiragino Sans','Yu Gothic',sans-serif;font-size:14px;line-height:1.9;color:#1a2e35;max-width:600px;">
  <p style="margin:0 0 20px;">${escapeHtml(name)} 様</p>

  <p style="margin:0 0 16px;">この度は、Allovvへお問い合わせいただき、誠にありがとうございます。<br>下記の内容でお問い合わせを承りました。</p>

  <div style="background:#f8fcfb;border:1px solid #e0f7f4;border-radius:12px;padding:18px 20px;margin:0 0 20px;">
    <table style="border-collapse:collapse;width:100%;">
      <tr><td style="padding:3px 16px 3px 0;color:#64748b;white-space:nowrap;vertical-align:top;">お名前</td><td style="padding:3px 0;">${escapeHtml(name)}</td></tr>
      ${company ? `<tr><td style="padding:3px 16px 3px 0;color:#64748b;white-space:nowrap;vertical-align:top;">会社名</td><td style="padding:3px 0;">${escapeHtml(company)}</td></tr>` : ""}
      <tr><td style="padding:3px 16px 3px 0;color:#64748b;white-space:nowrap;vertical-align:top;">種別</td><td style="padding:3px 0;">${escapeHtml(typeLabel)}</td></tr>
    </table>
    <p style="margin:14px 0 6px;color:#64748b;">お問い合わせ内容</p>
    <p style="margin:0;">${nl2br(escapeHtml(message))}</p>
  </div>

  <p style="margin:0 0 16px;">内容を確認のうえ、通常2営業日以内に担当者よりご連絡いたします。<br>今しばらくお待ちくださいますようお願い申し上げます。</p>

  <p style="margin:0 0 24px;color:#64748b;font-size:13px;">なお、本メールにお心当たりのない場合は、お手数ですが破棄いただけますと幸いです。</p>

  <div style="border-top:2px solid #b8f0e8;padding-top:18px;">
    <p style="margin:0 0 4px;font-weight:600;">Allovv（アロー）</p>
    <p style="margin:0 0 12px;">代表　三沼 春斗（Minuma Haruto）</p>
    <p style="margin:0 0 12px;color:#475569;font-size:13px;line-height:1.85;">
      AIによる業務自動化を自ら実践する実務家。Gmail × Make × Claude AI を組み合わせた
      メール自動化システムを自社開発し、日々の業務で運用しています。「作ったことがある」ではなく
      「毎日動かしている」経験をもとに、中小企業・個人事業主の業務の仕組み化を、構築から定着まで
      一気通貫で支援します。
    </p>
    <p style="margin:0;color:#475569;font-size:13px;">
      Web　<a href="https://www.allovv.com" style="color:#4aa898;">https://www.allovv.com</a><br>
      所在地　神奈川県横浜市
    </p>
  </div>
</div>`

  return { text, html }
}

const MAX_LENGTH = { name: 100, company: 100, message: 5000 }
const MAX_URLS_IN_MESSAGE = 3

// 人の書くお問い合わせには出てこない、スパム投稿ツール特有の書き方
const SPAM_MARKUP = /\[url=|\[link=|<a\s+href=/i
const URL_PATTERN = /https?:\/\/|www\./i

function countUrls(value: string) {
  return value.split(/https?:\/\/|www\./i).length - 1
}

/** Bot に弾いたことを悟らせないよう、成功と同じ応答を返して何もしない */
function silentlyDrop(reason: string) {
  console.warn(`[contact] dropped: ${reason}`)
  return NextResponse.json({ success: true })
}

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

/** ブラウザからの送信なら Origin が付く。他サイトから直接投げ込まれたものは断る */
function isSameOrigin(req: Request) {
  const origin = req.headers.get("origin")
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.get("host")
  } catch {
    return false
  }
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

/** フォームを開いた時点で受付票を渡す（送信時にこれで経過時間を確かめる） */
export async function GET() {
  return NextResponse.json(
    { token: issueFormToken() },
    { headers: { "Cache-Control": "no-store" } },
  )
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "送信元が不正です" }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "送信内容を読み取れませんでした" }, { status: 400 })
  }

  // 1. Bot の判定（画面に見えない入力欄が埋まっている／開いてから数秒で送られてきた）
  if (text(body.website)) return silentlyDrop("honeypot")

  const token = checkFormToken(body.token)
  if (token === "too-fast") return silentlyDrop("too fast")
  if (token !== "ok") {
    // 受付票が無い・古い。画面側で取り直して自動で送り直す
    return NextResponse.json({ error: "受付票が無効です", code: "token" }, { status: 400 })
  }

  // 2. 入力内容の検査（画面側と同じ基準をサーバーでも掛ける）
  const name = text(body.name).replace(/[\r\n]+/g, " ")
  const company = text(body.company).replace(/[\r\n]+/g, " ")
  const type = text(body.type)
  const message = text(body.message)
  const email = checkEmail(text(body.email))

  if (SPAM_MARKUP.test(message) || URL_PATTERN.test(name)) return silentlyDrop("spam markup")

  const fieldErrors: Record<string, string> = {}
  if (!name) fieldErrors.name = "お名前を入力してください"
  else if (name.length > MAX_LENGTH.name) fieldErrors.name = `お名前は${MAX_LENGTH.name}文字以内で入力してください`
  if (company.length > MAX_LENGTH.company) fieldErrors.company = `会社名は${MAX_LENGTH.company}文字以内で入力してください`
  if (!email.ok) fieldErrors.email = email.message
  if (!Object.prototype.hasOwnProperty.call(TYPE_LABELS, type)) fieldErrors.type = "お問い合わせ種別を選択してください"
  if (!message) fieldErrors.message = "メッセージを入力してください"
  else if (message.length > MAX_LENGTH.message) fieldErrors.message = `メッセージは${MAX_LENGTH.message}文字以内で入力してください`
  else if (countUrls(message) > MAX_URLS_IN_MESSAGE) {
    fieldErrors.message = `URLは${MAX_URLS_IN_MESSAGE}件までにしてください`
  }

  // 3. ドメインが実際にメールを受け取れるか（形式が正しい時だけ DNS に問い合わせる）
  if (email.ok && (await checkMailDomain(email.domain)) === "no-mail") {
    fieldErrors.email = EMAIL_MESSAGES.undeliverable
  }

  if (Object.keys(fieldErrors).length > 0 || !email.ok) {
    return NextResponse.json({ error: "入力内容をご確認ください", fieldErrors }, { status: 400 })
  }

  // 4. 送信回数の上限（同じ接続元・同じ宛先への連続送信を止める）
  if (!(await consumeSendQuota(clientIp(req), email.email))) {
    return NextResponse.json(
      { error: "短時間に送信が続いたため、受付を一時停止しています", code: "rate" },
      { status: 429 },
    )
  }

  const typeLabel = TYPE_LABELS[type]
  const payload: ContactPayload = { name, company, email: email.email, typeLabel, message }

  // 5. 事業者への通知（これが本命なので失敗したらエラーを返す）
  const owner = ownerNotification(payload)
  const { error } = await resend.emails.send({
    from: "Allovv Contact <noreply@allovv.com>",
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: payload.email,
    subject: `【お問い合わせ】${typeLabel} - ${name}`,
    text: owner.text,
    html: owner.html,
  })

  if (error) {
    console.error("Resend error (owner notification):", error)
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 })
  }

  // 6. お問い合わせ本人への自動返信（失敗しても通知は済んでいるので成功扱い）
  const reply = autoReply(payload)
  const { error: replyError } = await resend.emails.send({
    from: "Allovv｜三沼 春斗 <noreply@allovv.com>",
    to: payload.email,
    replyTo: process.env.CONTACT_TO_EMAIL!,
    subject: "【Allovv】お問い合わせありがとうございます（自動返信）",
    text: reply.text,
    html: reply.html,
  })

  if (replyError) {
    console.error("Resend error (auto reply):", replyError)
  }

  return NextResponse.json({ success: true })
}
