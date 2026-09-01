import type { ViewEvent } from "./types";

/* 集計はすべて日本時間。JSTは年間を通じてUTC+9で固定なので、
   9時間ずらしてから getUTC* を読むだけで正しい暦日と時刻になる */
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function jstNow(now = new Date()) {
  return new Date(now.getTime() + JST_OFFSET_MS);
}

/** ISO文字列から日本時間の「YYYY-MM-DD」「時」「曜日(0=日)」を取り出す */
export function jstParts(iso: string) {
  const d = new Date(new Date(iso).getTime() + JST_OFFSET_MS);
  const date = d.toISOString().slice(0, 10);
  return { date, hour: d.getUTCHours(), weekday: d.getUTCDay() };
}

/** 日本時間で n 日前の 00:00 を UTC の Date として返す */
export function jstDayStart(daysAgo: number, now = new Date()) {
  const shifted = new Date(now.getTime() + JST_OFFSET_MS);
  shifted.setUTCHours(0, 0, 0, 0);
  shifted.setUTCDate(shifted.getUTCDate() - daysAgo);
  return new Date(shifted.getTime() - JST_OFFSET_MS);
}

function countUnique(events: ViewEvent[], key: keyof ViewEvent) {
  return new Set(events.map((event) => String(event[key]))).size;
}

export type Bucket = { label: string; views: number; visitors: number };

export type PageRow = {
  path: string;
  views: number;
  visitors: number;
  /** そのページから閲覧が始まった回数 */
  entries: number;
};

export type ShareRow = { label: string; visitors: number; views: number };

export type PeriodSummary = {
  days: number;
  views: number;
  visitors: number;
  sessions: number;
  /** 1日あたりの平均人数（期間の経過日数で割る） */
  visitorsPerDay: number;
  viewsPerDay: number;
  /** 1人あたりの平均ページ数 */
  viewsPerVisitor: number;
  /** 日別の推移。古い順 */
  daily: Bucket[];
  pages: PageRow[];
  referrers: ShareRow[];
  devices: ShareRow[];
};

export type Report = {
  generatedAt: string;
  firstSeen: string | null;
  today: {
    date: string;
    views: number;
    visitors: number;
    /** 0〜23時。古い順 */
    hourly: Bucket[];
  };
  week: PeriodSummary;
  month: PeriodSummary;
  /** 30日 × 24時間。行が日付（古い順）、列が0〜23時 */
  grid: DayRow[];
};

export type DayRow = {
  date: string;
  weekday: number;
  /** 0〜23時のページ閲覧数 */
  hours: number[];
  views: number;
  visitors: number;
  /** その日よく見られたページ（上位3件） */
  topPaths: { path: string; views: number }[];
};

function dayKeys(days: number, now: Date) {
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    keys.push(
      new Date(jstDayStart(i, now).getTime() + JST_OFFSET_MS).toISOString().slice(0, 10),
    );
  }
  return keys;
}

function summarize(
  events: ViewEvent[],
  days: number,
  now: Date,
  activeDays: number,
): PeriodSummary {
  const byDay = new Map<string, ViewEvent[]>();
  for (const key of dayKeys(days, now)) byDay.set(key, []);
  for (const event of events) {
    byDay.get(jstParts(event.ts).date)?.push(event);
  }

  const daily: Bucket[] = [...byDay].map(([label, dayEvents]) => ({
    label,
    views: dayEvents.length,
    visitors: countUnique(dayEvents, "visitor"),
  }));

  const pageMap = new Map<string, PageRow>();
  const pageVisitors = new Map<string, Set<string>>();
  for (const event of events) {
    const row = pageMap.get(event.path) ?? {
      path: event.path,
      views: 0,
      visitors: 0,
      entries: 0,
    };
    row.views += 1;
    if (event.entry) row.entries += 1;
    pageMap.set(event.path, row);
    const seen = pageVisitors.get(event.path) ?? new Set<string>();
    seen.add(event.visitor);
    pageVisitors.set(event.path, seen);
  }
  const pages = [...pageMap.values()]
    .map((row) => ({ ...row, visitors: pageVisitors.get(row.path)?.size ?? 0 }))
    .sort((a, b) => b.views - a.views);

  const share = (pick: (event: ViewEvent) => string): ShareRow[] => {
    const views = new Map<string, number>();
    const visitors = new Map<string, Set<string>>();
    for (const event of events) {
      const label = pick(event);
      views.set(label, (views.get(label) ?? 0) + 1);
      const seen = visitors.get(label) ?? new Set<string>();
      seen.add(event.visitor);
      visitors.set(label, seen);
    }
    return [...views]
      .map(([label, count]) => ({
        label,
        views: count,
        visitors: visitors.get(label)?.size ?? 0,
      }))
      .sort((a, b) => b.visitors - a.visitors || b.views - a.views);
  };

  const visitors = countUnique(events, "visitor");
  return {
    days,
    views: events.length,
    visitors,
    sessions: countUnique(events, "session"),
    visitorsPerDay: visitors / activeDays,
    viewsPerDay: events.length / activeDays,
    viewsPerVisitor: visitors === 0 ? 0 : events.length / visitors,
    daily,
    pages,
    referrers: share((event) => event.ref || "direct"),
    devices: share((event) => event.device),
  };
}

export function buildReport(
  events: ViewEvent[],
  firstSeen: string | null,
  now = new Date(),
): Report {
  const monthStart = jstDayStart(29, now);
  const weekStart = jstDayStart(6, now);
  const todayKey = new Date(jstDayStart(0, now).getTime() + JST_OFFSET_MS)
    .toISOString()
    .slice(0, 10);

  /** 計測が始まってからの日数。30日を超えたら30日で頭打ち */
  function elapsedDays(window: number) {
    if (!firstSeen) return window;
    const start = new Date(firstSeen).getTime();
    const days = Math.floor((now.getTime() - start) / 86400000) + 1;
    return Math.max(1, Math.min(window, days));
  }

  const month = events.filter((event) => new Date(event.ts) >= monthStart);
  const week = month.filter((event) => new Date(event.ts) >= weekStart);
  const today = month.filter((event) => jstParts(event.ts).date === todayKey);

  const hourly: Bucket[] = Array.from({ length: 24 }, (_, hour) => ({
    label: String(hour).padStart(2, "0"),
    views: 0,
    visitors: 0,
  }));
  const hourVisitors = Array.from({ length: 24 }, () => new Set<string>());
  for (const event of today) {
    const { hour } = jstParts(event.ts);
    hourly[hour].views += 1;
    hourVisitors[hour].add(event.visitor);
  }
  hourly.forEach((bucket, hour) => {
    bucket.visitors = hourVisitors[hour].size;
  });

  const gridMap = new Map<string, number[]>();
  for (const key of dayKeys(30, now)) gridMap.set(key, Array(24).fill(0));
  for (const event of month) {
    const { date, hour } = jstParts(event.ts);
    const row = gridMap.get(date);
    if (row) row[hour] += 1;
  }

  return {
    generatedAt: new Date().toISOString(),
    firstSeen,
    today: {
      date: todayKey,
      views: today.length,
      visitors: countUnique(today, "visitor"),
      hourly,
    },
    week: summarize(week, 7, now, elapsedDays(7)),
    month: summarize(month, 30, now, elapsedDays(30)),
    grid: [...gridMap].map(([date, hours]) => {
      const dayEvents = month.filter((event) => jstParts(event.ts).date === date);
      const paths = new Map<string, number>();
      for (const event of dayEvents) {
        paths.set(event.path, (paths.get(event.path) ?? 0) + 1);
      }
      return {
        date,
        weekday: new Date(`${date}T00:00:00Z`).getUTCDay(),
        hours,
        views: dayEvents.length,
        visitors: countUnique(dayEvents, "visitor"),
        topPaths: [...paths]
          .map(([path, views]) => ({ path, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 3),
      };
    }),
  };
}
