import type { Metadata, Viewport } from "next";
import { Archivo_Black, JetBrains_Mono } from "next/font/google";
import { ServiceWorker } from "./components/ServiceWorker";
import "./globals.css";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BEASTMODE",
  description: "5-day split workout tracker. Lift. Log. Progress.",
  applicationName: "BEASTMODE",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BEASTMODE",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-beast-bg text-beast-ink">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
