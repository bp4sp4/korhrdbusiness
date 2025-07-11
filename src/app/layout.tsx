import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import ModalProvider from "@/providers/ModalProvider";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "에듀바이저 - 당신의 커리어 성장 파트너",
  description:
    "에듀바이저는 전문적인 커리어 상담과 맞춤형 교육 프로그램을 통해 당신의 성공적인 취업과 커리어 발전을 돕습니다. 지금바로 커리어 목표를 달성하세요.",
  keywords: [
    "커리어 상담",
    "취업 컨설팅",
    "진로 상담",
    "이력서 작성",
    "면접 준비",
    "직무 교육",
    "커리어 개발",
    "에듀바이저",
  ],
  openGraph: {
    title: "에듀바이저 - 당신의 커리어 성장 파트너",
    description:
      "전문적인 커리어 상담과 맞춤형 교육으로 당신의 커리어 목표 달성을 돕습니다.",
    url: "https://www.example.com",
    siteName: "에듀바이저",
    images: [
      {
        url: "https://www.example.com/og-image.png",
        width: 800,
        height: 600,
        alt: "에듀바이저 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀바이저 - 당신의 커리어 성장 파트너",
    description:
      "전문적인 커리어 상담과 맞춤형 교육으로 당신의 커리어 목표 달성을 돕습니다.",
    images: ["https://www.example.com/twitter-image.png"],
  },
  metadataBase: new URL("https://www.example.com"),
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
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ModalProvider />
        <Header />
        {children}
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
