import type { Metadata } from "next";
import EduServicePageClient from "@/components/eduservice/EduServicePageClient";

export const metadata: Metadata = {
  title: "에듀바이저 교육 서비스 - 맞춤형 커리어 성장 솔루션",
  description:
    "에듀바이저의 전문적인 교육 서비스를 만나보세요. 맞춤형 커리큘럼, 1:1 커리어 상담, 365일 교육 지원으로 당신의 성공적인 커리어를 만들어 드립니다.",
  keywords: [
    "교육 서비스",
    "맞춤형 교육",
    "커리어 설계",
    "1:1 상담",
    "취업 지원",
    "직무 교육",
    "에듀바이저",
  ],
  openGraph: {
    title: "에듀바이저 교육 서비스 - 맞춤형 커리어 성장 솔루션",
    description: "전문가와 함께 당신의 커리어를 설계하고 성장하세요.",
    url: "https://www.example.com/eduservice",
    siteName: "에듀바이저",
    images: [
      {
        url: "https://www.example.com/og-eduservice-image.png",
        width: 800,
        height: 600,
        alt: "에듀바이저 교육 서비스",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀바이저 교육 서비스 - 맞춤형 커리어 성장 솔루션",
    description: "전문가와 함께 당신의 커리어를 설계하고 성장하세요.",
    images: ["https://www.example.com/twitter-eduservice-image.png"],
  },
  alternates: {
    canonical: "/eduservice",
  },
};

export default function Eduservice() {
  return <EduServicePageClient />;
}
