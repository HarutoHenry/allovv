import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

const TYPE_LABELS: Record<string, string> = {
  service: "サービスについて",
  consulting: "AI導入のご相談",
  partnership: "業務提携について",
  media: "取材・メディア掲載",
  career: "採用について",
  other: "その他",
}

export async function POST(req: Request) {
  const { name, company, email, type, message } = await req.json()

  if (!name || !email || !type || !message) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
  }

  const typeLabel = TYPE_LABELS[type] ?? type

  const { error } = await resend.emails.send({
    from: "Allovv Contact <noreply@allovv.com>",
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: email,
    subject: `【お問い合わせ】${typeLabel} - ${name}`,
    text: `お名前: ${name}
会社名: ${company || "なし"}
メール: ${email}
種別: ${typeLabel}

${message}`,
  })

  if (error) {
    console.error("Resend error:", error)
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
