import type { Metadata } from "next";
import AboutPageClient from "@/components/about/AboutPageClient";

export const metadata: Metadata = {
  title: "에듀바이저 소개 - 교육의 본질을 바꾸다",
  description:
    "에듀바이저는 교육의 새로운 기준을 제시합니다. 연혁, 교육 철학, CEO 메시지를 통해 에듀바이저의 비전을 확인하세요.",
  keywords: [
    "에듀바이저 소개",
    "한평생교육",
    "교육 철학",
    "회사 연혁",
    "CEO 메시지",
    "커리어 교육",
  ],
  openGraph: {
    title: "에듀바이저 소개 - 교육의 본질을 바꾸다",
    description: "에듀바이저의 비전과 교육 철학을 확인하세요.",
    url: "https://www.example.com/about",
    siteName: "에듀바이저",
    images: [
      {
        url: "https://www.example.com/og-about-image.png",
        width: 800,
        height: 600,
        alt: "에듀바이저 회사 소개",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀바이저 소개 - 교육의 본질을 바꾸다",
    description: "에듀바이저의 비전과 교육 철학을 확인하세요.",
    images: ["https://www.example.com/twitter-about-image.png"],
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}