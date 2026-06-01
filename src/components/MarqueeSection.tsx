const items = [
  "AI書類作成支援",
  "補助金・助成金申請",
  "会社設立サポート",
  "AIコンサルティング",
  "事業計画書作成",
  "AI活用研修・実装",
  "起業を、もっと速く",
];

export default function MarqueeSection() {
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden py-4"
      style={{
        background: "linear-gradient(135deg, rgba(197,245,232,0.25) 0%, rgba(255,228,239,0.25) 100%)",
        borderTop: "1px solid rgba(184,240,232,0.4)",
        borderBottom: "1px solid rgba(255,214,231,0.4)",
      }}
    >
      <div className="flex animate-marquee" style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center flex-shrink-0">
            <span
              className="text-[12px] tracking-[0.12em] uppercase whitespace-nowrap px-8 font-medium"
              style={{ color: "rgba(26,46,53,0.48)" }}
            >
              {item}
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "rgba(93,207,190,0.5)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
