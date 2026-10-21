import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://gptquiz-ten.vercel.app"; // đổi thành tên miền riêng nếu bạn có sau này
const TITLE = "Trở về với chính mình | Thanh Hương";
const DESCRIPTION =
  "Một bài trắc nghiệm nhẹ nhàng giúp bạn nhận diện nhu cầu nổi bật của mình và tìm cuốn ebook phù hợp để bắt đầu.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Trở về với chính mình",
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/bia-ban-linh-tinh-lang.jpg", alt: "Bìa sách Bản lĩnh tĩnh lặng" }]
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/bia-ban-linh-tinh-lang.jpg"]
  }
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
