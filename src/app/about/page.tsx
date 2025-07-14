import type { Metadata } from "next";
import AboutPageClient from "@/components/about/AboutPageClient";

export const metadata: Metadata = {
  title: "에듀바이저스 소개 | 교육 철학 및 비전",
  description:
    "에듀바이저스의 설립 이념과 교육 철학을 알아보세요. 저희는 맞춤형 커리어 설계를 통해 당신의 성장을 돕습니다.",
  keywords: [
    "에듀바이저스 소개",
    "교육 철학",
    "CEO 인사말",
    "맞춤형 교육 비전",
    "에듀바이저스 연혁",
  ],
  openGraph: {
    title: "에듀바이저스 소개 - 교육의 본질을 바꾸다",
    description: "에듀바이저스의 비전과 교육 철학을 확인하세요.",
    url: "https://www.eduvisor.kr/about",
    siteName: "에듀바이저스",
    images: [
      {
        url: "https://www.eduvisor.kr/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "에듀바이저스 회사 소개",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀바이저스 소개 - 교육의 본질을 바꾸다",
    description: "에듀바이저스의 비전과 교육 철학을 확인하세요.",
    images: ["https://www.eduvisor.kr/images/og-image.png"],
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
