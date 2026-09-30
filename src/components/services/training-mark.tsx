/**
 * 小さな「指示の型」の印。AI活用研修のページで、同じ位置に揃った行（ヒーローの帯で5人の指示文が揃う姿）をラベルの目印に使う。
 * 絵文字やアイコンの代わりに、ページの図柄から作った目印を置く（SlipMark・FrameMark と対になる）
 */
export function TrainingMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      width="14"
      height="14"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect x="0.5" y="0.5" width="13" height="13" rx="2" fill="#7dd8ca" />
      <rect x="2.5" y="3.4" width="2.2" height="1.3" rx="0.4" fill="#0f1e24" opacity="0.6" />
      <rect x="5.8" y="3.4" width="5.7" height="1.3" rx="0.4" fill="#0f1e24" opacity="0.6" />
      <rect x="2.5" y="6.35" width="2.2" height="1.3" rx="0.4" fill="#0f1e24" opacity="0.6" />
      <rect x="5.8" y="6.35" width="5.7" height="1.3" rx="0.4" fill="#0f1e24" opacity="0.6" />
      <rect x="2.5" y="9.3" width="2.2" height="1.3" rx="0.4" fill="#0f1e24" opacity="0.6" />
      <rect x="5.8" y="9.3" width="3.6" height="1.3" rx="0.4" fill="#0f1e24" opacity="0.35" />
    </svg>
  )
}
