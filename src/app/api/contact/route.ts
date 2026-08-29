import { Resend } from "resend"
import { NextResponse } from "next/server"

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

export async function POST(req: Request) {
  const { name, company, email, type, message } = await req.json()

  if (!name || !email || !type || !message) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
  }

  const typeLabel = TYPE_LABELS[type] ?? type
  const payload: ContactPayload = { name, company, email, typeLabel, message }

  // 1. 事業者への通知（これが本命なので失敗したらエラーを返す）
  const owner = ownerNotification(payload)
  const { error } = await resend.emails.send({
    from: "Allovv Contact <noreply@allovv.com>",
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: email,
    subject: `【お問い合わせ】${typeLabel} - ${name}`,
    text: owner.text,
    html: owner.html,
  })

  if (error) {
    console.error("Resend error (owner notification):", error)
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 })
  }

  // 2. お問い合わせ本人への自動返信（失敗しても通知は済んでいるので成功扱い）
  const reply = autoReply(payload)
  const { error: replyError } = await resend.emails.send({
    from: "Allovv｜三沼 春斗 <noreply@allovv.com>",
    to: email,
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
