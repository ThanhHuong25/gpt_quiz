import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://gptquiz-ten.vercel.app"; // đổi thành tên miền riêng nếu bạn có sau này
const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // mã đo lường Google Analytics (G-XXXXXXXXXX), đặt trong cài đặt Vercel
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
      <body>
        {children}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
