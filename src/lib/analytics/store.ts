import { neon } from "@neondatabase/serverless";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Store, ViewEvent } from "./types";

/* 本番は Postgres（Neon）。DATABASE_URL が無いローカルでは JSON ファイルに落として
   同じ集計コードをそのまま動かせるようにしている。表示の確認をDB無しで行うため */

const connectionString =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL_UNPOOLED ??
  "";

export const hasDatabase = connectionString.length > 0;

/* ---------- Postgres ---------- */

let schemaReady: Promise<void> | null = null;

function sql() {
  return neon(connectionString);
}

async function ensureSchema() {
  if (!schemaReady) {
    const q = sql();
    schemaReady = (async () => {
      await q`
        create table if not exists page_views (
          id       bigserial primary key,
          ts       timestamptz not null default now(),
          path     text        not null,
          ref      text        not null default 'direct',
          visitor  text        not null,
          session  text        not null,
          entry    boolean     not null default false,
          device   text        not null default 'desktop',
          country  text        not null default ''
        )`;
      await q`create index if not exists page_views_ts_idx on page_views (ts desc)`;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

const postgresStore: Store = {
  async record(event) {
    await ensureSchema();
    const q = sql();
    await q`
      insert into page_views (ts, path, ref, visitor, session, entry, device, country)
      values (${event.ts}, ${event.path}, ${event.ref}, ${event.visitor},
              ${event.session}, ${event.entry}, ${event.device}, ${event.country})`;
  },

  async since(from) {
    await ensureSchema();
    const q = sql();
    // 30日ぶんを丸ごと取ってJS側で集計する。想定トラフィックでは十分に軽い
    const rows = (await q`
      select ts, path, ref, visitor, session, entry, device, country
      from page_views
      where ts >= ${from.toISOString()}
      order by ts desc
      limit 200000`) as Record<string, unknown>[];
    return rows.map((row) => ({
      ts: new Date(row.ts as string).toISOString(),
      path: String(row.path),
      ref: String(row.ref),
      visitor: String(row.visitor),
      session: String(row.session),
      entry: Boolean(row.entry),
      device: row.device as ViewEvent["device"],
      country: String(row.country ?? ""),
    }));
  },

  async firstSeen() {
    await ensureSchema();
    const q = sql();
    const rows = (await q`select min(ts) as first from page_views`) as {
      first: string | null;
    }[];
    const first = rows[0]?.first;
    return first ? new Date(first).toISOString() : null;
  },
};

/* ---------- 開発用のJSONファイル ---------- */

const devFile = path.join(process.cwd(), ".analytics-dev.json");

async function readDevFile(): Promise<ViewEvent[]> {
  try {
    return JSON.parse(await fs.readFile(devFile, "utf8")) as ViewEvent[];
  } catch {
    return [];
  }
}

const fileStore: Store = {
  async record(event) {
    const all = await readDevFile();
    all.push(event);
    await fs.writeFile(devFile, JSON.stringify(all), "utf8");
  },
  async since(from) {
    const all = await readDevFile();
    return all
      .filter((event) => new Date(event.ts) >= from)
      .sort((a, b) => (a.ts < b.ts ? 1 : -1));
  },
  async firstSeen() {
    const all = await readDevFile();
    if (all.length === 0) return null;
    return all.reduce((min, event) => (event.ts < min ? event.ts : min), all[0].ts);
  },
};

export const store: Store = hasDatabase ? postgresStore : fileStore;
