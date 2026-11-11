import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "麻麻呼呼 IG 分享圖產生器",
  description: "將 mamayahuhu.com 文章轉成 Instagram 分享圖",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant-TW">
      <body>{children}</body>
    </html>
  );
}
