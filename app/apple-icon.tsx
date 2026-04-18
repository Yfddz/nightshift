import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <div style={{ width: 22, height: 112, background: "#ff3d00" }} />
          <div style={{ width: 15, height: 70, background: "#ff3d00" }} />
          <div style={{ width: 64, height: 15, background: "#ff3d00" }} />
          <div style={{ width: 15, height: 70, background: "#ff3d00" }} />
          <div style={{ width: 22, height: 112, background: "#ff3d00" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
