import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
            gap: 14,
          }}
        >
          <div style={{ width: 64, height: 320, background: "#ff3d00" }} />
          <div style={{ width: 44, height: 200, background: "#ff3d00" }} />
          <div style={{ width: 180, height: 44, background: "#ff3d00" }} />
          <div style={{ width: 44, height: 200, background: "#ff3d00" }} />
          <div style={{ width: 64, height: 320, background: "#ff3d00" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
