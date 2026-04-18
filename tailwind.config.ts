import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        beast: {
          bg: "#000000",
          ink: "#f5f5f5",
          mute: "#6b6b6b",
          line: "#1f1f1f",
          panel: "#0a0a0a",
          accent: "#ff3d00",
          accentDim: "#cc3000",
          good: "#00d97e",
          bad: "#ff1744",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        none: "0",
      },
    },
  },
  plugins: [],
};

export default config;
