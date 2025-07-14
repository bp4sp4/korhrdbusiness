import type { Metadata } from "next";
import HomePageClient from "@/components/main/HomePageClient";

export const metadata: Metadata = {
  title: "에듀바이저스",
  description:
    "에듀바이저스는 1:1 맞춤형 커리어 설계와 실무 중심 교육을 통해 당신의 성공적인 취업과 커리어 개발을 돕습니다.",
  keywords: [
    "에듀바이저",
    "교육 서비스",
    "커리어 설계",
    "취업 지원",
    "맞춤형 교육",
    "에듀바이저스",
  ],
  openGraph: {
    title: "에듀바이저스",
    description:
      "당신만을 위한 커리어 전략 한평생교육의 에듀바이저가 함께 합니다.",
    url: "https://www.eduvisor.kr",
    siteName: "에듀바이저스",
    images: [
      {
        url: "https://www.eduvisor.kr/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "에듀바이저스 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀바이저스",
    description:
      "에듀바이저스에서 제공하는 1:1 맞춤형 커리어 설계와 실무 교육을 통해 취업에 성공하세요.",
    images: ["https://www.eduvisor.kr/images/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomePageClient />;
}
