import type { Metadata } from "next";
import RecruitPageClient from "@/components/recruit/RecruitPageClient";

export const metadata: Metadata = {
  title: "에듀바이저 채용 - 새로운 교육의 미래를 함께 만드세요",
  description:
    "한평생교육원과 함께 성장할 인재를 모집합니다. 교육의 새로운 미래를 만들어갈 당신을 기다립니다. 지금 바로 지원하세요.",
  keywords: [
    "채용",
    "일자리",
    "취업",
    "에듀바이저 채용",
    "교육 분야 취업",
    "커리어 기회",
  ],
  openGraph: {
    title: "에듀바이저 채용 - 새로운 교육의 미래를 함께 만드세요",
    description: "한평생교육원에서 당신의 커리어를 시작하세요.",
    url: "https://www.example.com/recruit",
    siteName: "에듀바이저",
    images: [
      {
        url: "https://www.example.com/og-recruit-image.png",
        width: 800,
        height: 600,
        alt: "에듀바이저 채용 공고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀바이저 채용 - 새로운 교육의 미래를 함께 만드세요",
    description: "한평생교육원에서 당신의 커리어를 시작하세요.",
    images: ["https://www.example.com/twitter-recruit-image.png"],
  },
  alternates: {
    canonical: "/recruit",
  },
};

export default function RecruitPage() {
  return <RecruitPageClient />;
}