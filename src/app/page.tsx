import type { Metadata } from "next";
import HomePageClient from "@/components/main/HomePageClient";

export const metadata: Metadata = {
  title: "에듀바이저스 - 한평생 에듀바이저스 | 당신의 커리어 성장 파트너",
  description:
    "에듀바이저스는 1:1 맞춤형 커리어 설계와 실무 중심 교육을 통해 당신의 성공적인 취업과 커리어 개발을 돕습니다. 한평생 에듀바이저스에서 당신의 미래를 설계하세요.",
  keywords: [
    "한평생 에듀바이저스",
    "한평생에듀바이저스",
    "에듀바이저스",
    "에듀바이저",
    "교육 서비스",
    "커리어 설계",
    "취업 지원",
    "맞춤형 교육",
    "한평생 교육",
    "한평생 커리어 설계",
    "한평생 취업 지원",
    "한평생 맞춤형 교육",
    "교육 컨설팅",
    "커리어 상담",
    "직업 교육",
    "자격증 교육",
    "학점은행제",
    "민간자격증",
    "국가자격증",
    "유학 프로그램",
  ],
  openGraph: {
    title: "에듀바이저스 - 한평생 에듀바이저스",
    description:
      "에듀바이저스에서 제공하는 당신만을 위한 커리어 전략 한평생교육의 에듀바이저가 함께 합니다.",
    url: "https://www.eduvisor.kr",
    siteName: "한평생 에듀바이저스",
    images: [
      {
        url: "https://www.eduvisor.kr/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "한평생 에듀바이저스 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀바이저스 - 한평생 에듀바이저스",
    description:
      "에듀바이저스에서 제공하는 1:1 맞춤형 커리어 설계와 실무 교육을 통해 취업에 성공하세요. 한평생 에듀바이저스와 함께하세요.",
    images: ["https://www.eduvisor.kr/images/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomePageClient />;
}
