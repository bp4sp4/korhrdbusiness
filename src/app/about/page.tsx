import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutValueSection from "@/components/about/AboutValueSection";
import AboutPartnerSection from "@/components/about/AboutPartnerSection";
import AboutCtaBanner from "@/components/about/AboutCtaBanner";

export const metadata: Metadata = {
  title: "에듀바이저스 | 한평생 에듀바이저스 회사 소개",
  description:
    "에듀바이저스(한평생 에듀바이저스)는 개인의 잠재력을 최대로 이끌어내는 맞춤형 교육을 통해 당신의 커리어 여정을 함께합니다. CEO 인사말과 교육 철학을 확인하세요.",
  keywords: [
    "에듀바이저스",
    "한평생 에듀바이저스",
    "한평생에듀바이저스",
    "에듀바이저스 소개",
    "에듀바이저스 회사",
    "교육 철학",
    "CEO 인사말",
    "맞춤형 교육 비전",
    "에듀바이저스 연혁",
    "한평생 교육",
    "에듀바이저스 비전",
  ],
  openGraph: {
    title: "에듀바이저스 | 한평생 에듀바이저스 회사 소개",
    description:
      "에듀바이저스(한평생 에듀바이저스)의 비전과 교육 철학을 확인하세요. CEO 인사말과 회사 소개를 통해 에듀바이저스를 더 자세히 알아보세요.",
    url: "https://www.eduvisor.kr/about",
    siteName: "에듀바이저스 | 한평생 에듀바이저스",
    images: [
      {
        url: "https://www.eduvisor.kr/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "에듀바이저스 | 한평생 에듀바이저스 회사 소개",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀바이저스 | 한평생 에듀바이저스 회사 소개",
    description:
      "에듀바이저스(한평생 에듀바이저스)의 비전과 교육 철학을 확인하세요. CEO 인사말과 회사 소개를 통해 에듀바이저스를 더 자세히 알아보세요.",
    images: ["https://www.eduvisor.kr/images/og-image.png"],
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutValueSection />
      <AboutPartnerSection />
      <AboutCtaBanner />
    </main>
  );
}
