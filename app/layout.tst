import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trở về với chính mình | Thanh Hương",
  description:
    "Một bài trắc nghiệm nhẹ nhàng giúp bạn nhận diện nhu cầu nổi bật của mình và tìm cuốn ebook phù hợp để bắt đầu.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
