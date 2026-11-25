import { ImageResponse } from "next/og";
export const alt = "Mohd Faizan Khan — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg,#152131,#2c3541 70%,#604a3b)",
        padding: 55,
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
        }}
      >
        <span>MOHD FAIZAN KHAN</span>
        <span>SOFTWARE ENGINEER / BENGALURU</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", fontSize: 34, lineHeight: 1.2 }}>
          Thoughtful code. Distinctive experiences.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 216,
            lineHeight: 0.9,
            fontWeight: 900,
            letterSpacing: "-15px",
          }}
        >
          FAIZAN
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
          borderTop: "1px solid #ffffff55",
          paddingTop: 20,
        }}
      >
        <span>FULL STACK · AI APPLICATIONS · DEVELOPER TOOLS</span>
        <span>SELECTED WORK ↗</span>
      </div>
    </div>,
    size,
  );
}
