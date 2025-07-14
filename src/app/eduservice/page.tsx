import type { Metadata } from "next";
import EduServicePageClient from "@/components/eduservice/EduServicePageClient";

export const metadata: Metadata = {
  title: "교육 서비스 | 에듀바이저스",
  description:
    "직무 교육, 1:1 커리어 상담, 자격증 취득 지원 등 에듀바이저스가 제공하는 전문적인 교육 서비스를 확인해보세요.",
  keywords: [
    "직무 교육",
    "1:1 상담",
    "커리어 교육 프로그램",
    "맞춤형 교육 솔루션",
    "에듀바이저스 교육 서비스",
  ],
  openGraph: {
    title: "에듀바이저스 교육 서비스 - 맞춤형 커리어 성장 솔루션",
    description: "전문가와 함께 당신의 커리어를 설계하고 성장하세요.",
    url: "https://www.eduvisor.kr/eduservice",
    siteName: "에듀바이저스",
    images: [
      {
        url: "https://www.eduvisor.kr/images/og-eduservice-image.png",
        width: 800,
        height: 600,
        alt: "에듀바이저스 교육 서비스",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀바이저스 교육 서비스 - 맞춤형 커리어 성장 솔루션",
    description: "전문가와 함께 당신의 커리어를 설계하고 성장하세요.",
    images: ["https://www.eduvisor.kr/images/og-eduservice-image.png"],
  },
  alternates: {
    canonical: "/eduservice",
  },
};

export default function Eduservice() {
  return <EduServicePageClient />;
}
