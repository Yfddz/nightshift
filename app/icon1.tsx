import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon1() {
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
          <div style={{ width: 24, height: 120, background: "#ff3d00" }} />
          <div style={{ width: 16, height: 76, background: "#ff3d00" }} />
          <div style={{ width: 64, height: 16, background: "#ff3d00" }} />
          <div style={{ width: 16, height: 76, background: "#ff3d00" }} />
          <div style={{ width: 24, height: 120, background: "#ff3d00" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
