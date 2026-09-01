"use client";

import { useMemo, useState } from "react";
import type { PeriodSummary, Report, ShareRow } from "@/lib/analytics/aggregate";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function shortDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${d}`;
}

function fullDate(iso: string) {
  const [y, m, d] = iso.split("-");
  const weekday = WEEKDAYS[new Date(`${iso}T00:00:00Z`).getUTCDay()];
  return `${y}年${Number(m)}月${Number(d)}日(${weekday})`;
}

/** 0件〜最大値を4段階に割り振る。1件でも入ったら必ず色が付くようにする */
function level(count: number, max: number) {
  if (count === 0) return 0;
  if (max <= 1) return 4;
  return Math.min(4, Math.ceil((count / max) * 4));
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

const DEVICE_LABELS: Record<string, string> = {
  mobile: "スマートフォン",
  tablet: "タブレット",
  desktop: "パソコン",
};

function ShareTable({
  title,
  rows,
  render,
  empty,
}: {
  title: string;
  rows: ShareRow[];
  render?: (label: string) => string;
  empty: string;
}) {
  const max = Math.max(1, ...rows.map((row) => row.visitors));
  return (
    <div>
      {rows.length === 0 ? (
        <p className="dash-stat-note">{empty}</p>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>{title}</th>
              <th className="n">人数</th>
              <th className="n">閲覧</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 8).map((row) => (
              <tr key={row.label}>
                <td className="dash-meter">
                  <span
                    className="dash-meter-fill"
                    style={{ width: `${(row.visitors / max) * 100}%` }}
                  />
                  <span className="dash-meter-label">
                    {render ? render(row.label) : row.label}
                  </span>
                </td>
                <td className="n num">{row.visitors}</td>
                <td className="n num">{row.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function Dashboard({
  report,
  hasDatabase,
}: {
  report: Report;
  hasDatabase: boolean;
}) {
  const [range, setRange] = useState<"week" | "month">("month");
  const [selected, setSelected] = useState(report.today.date);

  const period: PeriodSummary = range === "week" ? report.week : report.month;
  const gridMax = useMemo(
    () => Math.max(1, ...report.grid.flatMap((row) => row.hours)),
    [report.grid],
  );

  const selectedRow =
    report.grid.find((row) => row.date === selected) ??
    report.grid[report.grid.length - 1];
  const selectedHours = selectedRow?.hours ?? Array(24).fill(0);
  const barMax = Math.max(1, ...selectedHours);
  const selectedTotal = selectedHours.reduce((sum, n) => sum + n, 0);

  const hasAnyData = report.month.views > 0;
  const updatedAt = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(report.generatedAt));

  return (
    <div className="dash-inner">
      <header className="dash-head">
        <div>
          <p className="dash-eyebrow">Allovv</p>
          <h1 className="dash-title">アクセス解析</h1>
        </div>
        <div className="dash-head-right">
          <p className="dash-sub">{updatedAt} 現在（日本時間）</p>
          <form method="post" action="/api/auth">
            <input type="hidden" name="out" value="1" />
            <button type="submit" className="dash-link">
              閉じる
            </button>
          </form>
        </div>
      </header>

      {!hasDatabase && (
        <div className="dash-notice">
          データベースに接続していないため、この画面はこの端末に残った記録だけを表示しています。
          本番の数字を集めるには Vercel で Postgres を作り、環境変数 DATABASE_URL
          を設定してください。
        </div>
      )}

      <section className="dash-stats">
        <div className="dash-stat">
          <p className="dash-stat-label">今日</p>
          <p className="dash-stat-value num">
            {report.today.visitors}
            <span className="dash-stat-unit">人</span>
          </p>
          <p className="dash-stat-note num">{report.today.views} ページ閲覧</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-label">直近7日</p>
          <p className="dash-stat-value num">
            {report.week.visitors}
            <span className="dash-stat-unit">人</span>
          </p>
          <p className="dash-stat-note num">{report.week.views} ページ閲覧</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-label">直近30日</p>
          <p className="dash-stat-value num">
            {report.month.visitors}
            <span className="dash-stat-unit">人</span>
          </p>
          <p className="dash-stat-note num">{report.month.views} ページ閲覧</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-label">1日あたりの平均</p>
          <p className="dash-stat-value num">
            {round(report.month.visitorsPerDay)}
            <span className="dash-stat-unit">人</span>
          </p>
          <p className="dash-stat-note num">
            1人あたり {round(report.month.viewsPerVisitor)} ページ
          </p>
        </div>
      </section>

      {!hasAnyData ? (
        <div className="dash-empty">
          <p>まだ記録がありません。</p>
          <p>
            {report.firstSeen
              ? `計測は ${fullDate(report.firstSeen.slice(0, 10))} から動いています。`
              : "サイトをどれか1ページ開くと、ここに最初の1件が出ます。"}
          </p>
        </div>
      ) : (
        <>
          <section className="dash-section">
            <div className="dash-section-head">
              <p className="dash-eyebrow">30日 × 24時間</p>
              <p className="dash-section-note">
                日付をクリックすると、その日の内訳が右に出ます
              </p>
            </div>

            <div className="dash-heat">
              <div className="dash-grid-scroll">
                <div className="dash-grid">
                  <div className="dash-grid-hours">
                    <span />
                    {Array.from({ length: 24 }, (_, hour) => (
                      <span key={hour} className="dash-grid-hour num">
                        {hour % 6 === 0 ? hour : ""}
                      </span>
                    ))}
                  </div>

                  {report.grid.map((row) => (
                    <button
                      key={row.date}
                      type="button"
                      className="dash-grid-row"
                      data-today={row.date === report.today.date}
                      data-selected={row.date === selected}
                      data-weekend={row.weekday === 0 || row.weekday === 6}
                      onClick={() => setSelected(row.date)}
                      aria-label={`${fullDate(row.date)} の内訳を見る`}
                    >
                      <span className="dash-grid-date num">{shortDate(row.date)}</span>
                      {row.hours.map((count, hour) => (
                        <span
                          key={hour}
                          className="dash-grid-cell"
                          data-level={level(count, gridMax)}
                          title={`${shortDate(row.date)} ${hour}時 — ${count}件`}
                        />
                      ))}
                    </button>
                  ))}
                </div>

                <div className="dash-legend">
                  <span style={{ background: "var(--heat-0)" }} />
                  <span style={{ background: "var(--heat-1)" }} />
                  <span style={{ background: "var(--heat-2)" }} />
                  <span style={{ background: "var(--heat-3)" }} />
                  <span style={{ background: "var(--heat-4)" }} />
                  少ない → 多い（最大 {gridMax}件／時）
                </div>
              </div>

              <div className="dash-day">
                <h2 className="dash-day-title">
                  {fullDate(selectedRow?.date ?? selected)}
                </h2>
                <p className="dash-day-total num">
                  {selectedRow?.visitors ?? 0}
                  <span className="dash-stat-unit">人</span>
                  <span className="dash-day-sep">／</span>
                  {selectedTotal}
                  <span className="dash-stat-unit">ページ閲覧</span>
                </p>

                <div className="dash-bars">
                  {selectedHours.map((count, hour) => (
                    <span key={hour} className="dash-bar-col">
                      <span
                        className="dash-bar"
                        data-empty={count === 0}
                        style={{ height: `${count === 0 ? 2 : (count / barMax) * 100}%` }}
                        title={`${hour}時 — ${count}件`}
                      />
                    </span>
                  ))}
                </div>
                <div className="dash-bar-labels num">
                  {Array.from({ length: 24 }, (_, hour) => (
                    <span key={hour}>{hour % 3 === 0 ? hour : ""}</span>
                  ))}
                </div>
                <p className="dash-bar-caption">時刻（日本時間）</p>

                {selectedRow && selectedRow.topPaths.length > 0 && (
                  <div className="dash-day-paths">
                    <p className="dash-eyebrow">この日よく見られたページ</p>
                    <ul>
                      {selectedRow.topPaths.map((item) => (
                        <li key={item.path}>
                          <span className="dash-path">{item.path}</span>
                          <span className="num">{item.views}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="dash-section">
            <div className="dash-section-head">
              <p className="dash-eyebrow">内訳</p>
              <div className="dash-section-note">
                <span className="dash-toggle">
                  <button
                    type="button"
                    aria-pressed={range === "week"}
                    onClick={() => setRange("week")}
                  >
                    直近7日
                  </button>
                  <button
                    type="button"
                    aria-pressed={range === "month"}
                    onClick={() => setRange("month")}
                  >
                    直近30日
                  </button>
                </span>
              </div>
            </div>

            <div className="dash-cols">
              <div>
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>ページ</th>
                      <th className="n">人数</th>
                      <th className="n">閲覧</th>
                      <th className="n">入口</th>
                    </tr>
                  </thead>
                  <tbody>
                    {period.pages.map((row) => (
                      <tr key={row.path}>
                        <td className="dash-meter">
                          <span
                            className="dash-meter-fill"
                            style={{
                              width: `${(row.visitors / Math.max(1, ...period.pages.map((p) => p.visitors))) * 100}%`,
                            }}
                          />
                          <span className="dash-meter-label dash-path">{row.path}</span>
                        </td>
                        <td className="n num">{row.visitors}</td>
                        <td className="n num">{row.views}</td>
                        <td className="n num">{row.entries}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ShareTable
                title="流入元"
                rows={period.referrers}
                render={(label) => (label === "direct" ? "直接・ブックマーク" : label)}
                empty="まだありません。"
              />

              <ShareTable
                title="端末"
                rows={period.devices}
                render={(label) => DEVICE_LABELS[label] ?? label}
                empty="まだありません。"
              />
            </div>
            <p className="dash-stat-note" style={{ marginTop: 16 }}>
              「入口」は、その人が最初に開いたページとして数えた回数です。
              {range === "week" ? "直近7日" : "直近30日"}で {period.sessions} 回の来訪、
              1回あたり {round(period.views / Math.max(1, period.sessions))} ページ。
            </p>
          </section>
        </>
      )}
    </div>
  );
}
