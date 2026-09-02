import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "《余生协议：一个普通人的100年》",
  description: "在 AI 浪潮中，陪林一走过从出生协议到生命终点的一百年。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
