import type { Metadata } from "next";
import EduServicePageClient from "@/components/eduservice/EduServicePageClient";

export const metadata: Metadata = {
  title: "에듀바이저스 | 한평생 에듀바이저스 교육 서비스",
  description:
    "에듀바이저스(한평생 에듀바이저스)의 직무 교육, 1:1 커리어 상담, 자격증 취득 지원, 유학 프로그램 등 전문적인 교육 서비스를 확인해보세요.",
  keywords: [
    "에듀바이저스",
    "한평생 에듀바이저스",
    "한평생에듀바이저스",
    "에듀바이저스 교육",
    "직무 교육",
    "1:1 상담",
    "커리어 교육 프로그램",
    "맞춤형 교육 솔루션",
    "에듀바이저스 교육 서비스",

    "민간자격증",

    "유학 프로그램",
    "업무제휴사",
  ],
  openGraph: {
    title: "에듀바이저스 | 한평생 에듀바이저스 교육 서비스",
    description:
      "에듀바이저스(한평생 에듀바이저스)의 전문가와 함께 당신의 커리어를 설계하고 성장하세요. 자격증, 유학 프로그램까지 모든 교육 서비스를 확인하세요.",
    url: "https://www.eduvisor.kr/eduservice",
    siteName: "에듀바이저스 | 한평생 에듀바이저스",
    images: [
      {
        url: "https://www.eduvisor.kr/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "에듀바이저스 | 한평생 에듀바이저스 교육 서비스",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀바이저스 | 한평생 에듀바이저스 교육 서비스",
    description:
      "에듀바이저스(한평생 에듀바이저스)의 전문가와 함께 당신의 커리어를 설계하고 성장하세요. 자격증, 유학 프로그램까지 모든 교육 서비스를 확인하세요.",
    images: ["https://www.eduvisor.kr/images/og-image.png"],
  },
  alternates: {
    canonical: "/eduservice",
  },
};

export default function Eduservice() {
  return <EduServicePageClient />;
}
