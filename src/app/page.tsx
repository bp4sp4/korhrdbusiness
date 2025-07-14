import type { Metadata } from "next";
import HomePageClient from "@/components/main/HomePageClient";

export const metadata: Metadata = {
  title: "에듀바이저스 | 당신의 커리어 성장 파트너",
  description:
    "에듀바이저스는 1:1 맞춤형 상담을 통해 커리어 설계를 돕고, 실무 중심의 직무 교육으로 당신의 성공적인 취업을 지원합니다.",
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
      "1:1 맞춤형 상담과 실무 중심 교육으로 당신의 커리어를 설계하세요.",
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
    title: "에듀바이저스 | 맞춤형 커리어 교육 및 취업 지원",
    description:
      "1:1 맞춤형 상담과 실무 중심 교육으로 당신의 커리어를 설계하세요.",
    images: ["https://www.eduvisor.kr/images/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomePageClient />;
}
