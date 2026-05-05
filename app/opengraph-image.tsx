import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Abhishek Bhikule — Create with Abhi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#000000",
          color: "#f6f6f6",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(198,255,0,0.18) 0%, transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(246,246,246,0.6)",
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: "#c6ff00", fontSize: 28 }}>⌗</span>
            <span>Create With Abhi</span>
          </div>
          <span>Portfolio · 2024 — 2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 196,
              lineHeight: 0.92,
              letterSpacing: -8,
              fontWeight: 700,
            }}
          >
            <span>Abhishek</span>
            <span>
              Bhikule<span style={{ color: "#c6ff00" }}>.</span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 880,
              fontSize: 28,
              lineHeight: 1.4,
              color: "rgba(246,246,246,0.7)",
            }}
          >
            Full-stack developer in Mumbai. I build for the web — products,
            plugins, and the occasional weekend experiment.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(246,246,246,0.6)",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "12px 24px",
              background: "#c6ff00",
              color: "#000000",
              fontWeight: 700,
            }}
          >
            <span>Say Hello ↗</span>
          </div>
          <span>Mumbai · GMT+5:30</span>
        </div>
      </div>
    ),
    size,
  );
}
