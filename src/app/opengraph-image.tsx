import { ImageResponse } from "next/og"

export const alt = "Allovv | AIで、日本のビジネスインフラを変える"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #c5f5e8 0%, #ffe4ef 60%, #ffffff 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 128,
            fontWeight: 700,
            color: "#1a2e35",
            letterSpacing: "-0.03em",
            marginBottom: 24,
          }}
        >
          Allovv
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 500,
            color: "#1a2e35",
            opacity: 0.75,
            marginBottom: 12,
          }}
        >
          AIで、日本のビジネスインフラを変える。
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#1a2e35",
            opacity: 0.45,
            letterSpacing: "0.12em",
          }}
        >
          Give more. Allow more.
        </div>
      </div>
    ),
    { ...size }
  )
}
