import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Malayalam Romance Muse",
  description: "Generate heartfelt Malayalam lyrics and download your own romantic song"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ml">
      <body>{children}</body>
    </html>
  );
}
