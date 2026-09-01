import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSignedIn } from "@/lib/analytics/auth";
import { buildReport, jstDayStart } from "@/lib/analytics/aggregate";
import { hasDatabase, store } from "@/lib/analytics/store";
import { Dashboard } from "./dashboard";

export const metadata: Metadata = { title: "アクセス解析" };
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AnalyticsPage() {
  if (!(await isSignedIn())) redirect("/admin/login");

  const [events, firstSeen] = await Promise.all([
    store.since(jstDayStart(29)),
    store.firstSeen(),
  ]);

  return (
    <Dashboard report={buildReport(events, firstSeen)} hasDatabase={hasDatabase} />
  );
}
