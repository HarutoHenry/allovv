/** 1件の閲覧イベント。収集はページ単位で、個人を特定する値は保存しない */
export type ViewEvent = {
  /** 発生時刻（UTCのISO文字列） */
  ts: string;
  /** クエリと末尾スラッシュを落としたパス。例 "/services/web" */
  path: string;
  /** 流入元ホスト。直接アクセスは "direct" */
  ref: string;
  /** 端末ごとのランダムID（localStorage・個人情報ではない） */
  visitor: string;
  /** タブを開いている間だけ有効なID（sessionStorage） */
  session: string;
  /** そのセッションで最初に開いたページなら true ＝入口ページ */
  entry: boolean;
  device: "mobile" | "tablet" | "desktop";
  /** VercelのIPジオ判定。取れなければ "" */
  country: string;
};

export type Store = {
  record(event: ViewEvent): Promise<void>;
  /** since 以降のイベントを新しい順で返す */
  since(since: Date): Promise<ViewEvent[]>;
  /** 記録された最初のイベントの時刻。1件も無ければ null */
  firstSeen(): Promise<string | null>;
};
