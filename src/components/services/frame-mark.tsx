/**
 * 小さなブラウザの枠の印。ホームページ制作のページで、ヒーローの帯の枠と同じ形をラベルの目印に使う。
 * 絵文字やアイコンの代わりに、ページの図柄から作った目印を置く（AI仕組み化のページの SlipMark と対になる）
 */
export function FrameMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 13"
      width="16"
      height="13"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect x="0.5" y="0.5" width="15" height="12" rx="2" fill="#7dd8ca" />
      <rect x="0.5" y="3.4" width="15" height="0.9" fill="#0f1e24" opacity="0.6" />
      <rect x="2.5" y="6" width="6.5" height="1.2" fill="#0f1e24" opacity="0.6" />
      <rect x="2.5" y="8.8" width="4.5" height="1.2" fill="#0f1e24" opacity="0.6" />
      <rect x="10.5" y="6" width="3" height="4" rx="0.6" fill="#0f1e24" opacity="0.35" />
    </svg>
  )
}
