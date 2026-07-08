import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import ConditionalFooter from "../components/ConditionalFooter";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import ModalProvider from "@/providers/ModalProvider";
import PopupManager from "@/components/popups/PopupManager";
import ScrollToTop from "@/components/ScrollToTop";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "에듀바이저스 | 한평생 에듀바이저스 - 당신의 커리어 성장 파트너",
  description:
    "에듀바이저스(한평생 에듀바이저스)는 전문적인 커리어 상담과 맞춤형 교육 프로그램을 통해 당신의 성공적인 취업과 커리어 발전을 돕습니다. 자격증, 유학 프로그램까지 한평생교육의 전문가가 함께합니다.",
  keywords: [
    "에듀바이저스",
    "한평생 에듀바이저스",
    "한평생에듀바이저스",
    "에듀바이저스 교육",
    "에듀바이저스 상담",
    "커리어 상담",
    "취업 컨설팅",
    "진로 상담",
    "이력서 작성",
    "면접 준비",
    "직무 교육",
    "커리어 개발",
    "민간자격증",
    "유학 프로그램",
    "한평생 교육",
  ],
  openGraph: {
    title: "에듀바이저스 | 한평생 에듀바이저스 - 당신의 커리어 성장 파트너",
    description:
      "에듀바이저스(한평생 에듀바이저스)는 당신만을 위한 커리어 전략을 제공합니다. 한평생교육의 에듀바이저가 함께 합니다.",
    url: "https://www.eduvisor.kr/",
    siteName: "에듀바이저스 | 한평생 에듀바이저스",
    images: [
      {
        url: "https://www.eduvisor.kr/images/og-image.png",
        width: 800,
        height: 600,
        alt: "에듀바이저스 | 한평생 에듀바이저스 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀바이저스 | 한평생 에듀바이저스 - 당신의 커리어 성장 파트너",
    description:
      "에듀바이저스(한평생 에듀바이저스)의 전문적인 커리어 상담과 맞춤형 교육으로 당신의 커리어 목표 달성을 돕습니다. 지금 바로 성공적인 커리어를 시작하세요!",
    images: ["https://www.eduvisor.kr/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    other: {
      "naver-site-verification": "3116447aae95ff904404f6eeb40490049be9e3b9",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://www.eduvisor.kr/"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="overflow-x-clip">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-x-clip",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ModalProvider />
        <Header />
        {children}
        <ConditionalFooter />
        <PopupManager />
        <ScrollToTop />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
