/**
 * 小さな書類の印。ヒーローの帯で最後に揃う書類と同じ形で、ラベルや選択中の印に使う。
 * 絵文字やアイコンの代わりに、ページの図柄から作った目印を置く
 */
export function SlipMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 16"
      width="12"
      height="16"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect x="0.5" y="0.5" width="11" height="15" rx="1.8" fill="#7dd8ca" />
      <rect x="2.5" y="4" width="6.5" height="1.2" fill="#0f1e24" opacity="0.6" />
      <rect x="2.5" y="7.2" width="5" height="1.2" fill="#0f1e24" opacity="0.6" />
      <rect x="2.5" y="10.4" width="5.8" height="1.2" fill="#0f1e24" opacity="0.6" />
    </svg>
  )
}
