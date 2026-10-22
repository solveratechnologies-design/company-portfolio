import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — Build smarter. Work faster. Grow further.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#101820",
          backgroundImage: "radial-gradient(circle at 85% 10%, rgba(242,114,34,0.5), transparent 50%), radial-gradient(circle at 10% 100%, rgba(242,114,34,0.22), transparent 45%)",
          padding: 72,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#F27222", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: "#FFD7BE", border: "4px solid white" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>Solvera</div>
            <div style={{ fontSize: 16, letterSpacing: 4, opacity: 0.6 }}>TECHNOLOGIES</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>Build Smarter. Work Faster. Grow Further.</div>
          <div style={{ fontSize: 28, opacity: 0.7 }}>Web Development · AI Solutions · Business Automation · Digital Marketing</div>
        </div>
      </div>
    ),
    size,
  );
}
