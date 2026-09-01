import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isConfigured, isSignedIn } from "@/lib/analytics/auth";

export const metadata: Metadata = { title: "管理画面" };
export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isSignedIn()) redirect("/admin/analytics");
  const { error } = await searchParams;

  return (
    <div className="dash-login">
      <div className="dash-login-box">
        <p className="dash-eyebrow">Allovv</p>
        <h1>アクセス解析</h1>
        <p>合言葉を入れると開きます。</p>

        {isConfigured() ? (
          <form method="post" action="/api/auth">
            <label htmlFor="password">合言葉</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
            />
            <button type="submit">開く</button>
            {error === "1" && <p className="dash-error">合言葉が違います。</p>}
          </form>
        ) : (
          <p className="dash-error">
            合言葉がまだ設定されていません。Vercelの環境変数に ANALYTICS_PASSWORD
            を追加して、もう一度デプロイしてください。
          </p>
        )}
      </div>
    </div>
  );
}
