import type { Metadata } from "next";
import RecruitPageClient from "@/components/recruit/RecruitPageClient";

export const metadata: Metadata = {
  title: "채용 | 에듀바이저스와 함께할 인재를 찾습니다",
  description:
    "교육의 미래를 함께 만들어갈 열정적인 인재를 모집합니다. 에듀바이저스의 채용 공고를 확인하고 지원하세요.",
  keywords: [
    "에듀바이저스 채용",
    "교육계 취업",
    "에듀바이저스 입사",
    "채용 공고",
    "인재 모집",
  ],
  openGraph: {
    title: "에듀바이저스 채용 - 새로운 교육의 미래를 함께 만드세요",
    description: "에듀바이저스에서 당신의 커리어를 시작하세요.",
    url: "https://www.eduvisor.kr/recruit",
    siteName: "에듀바이저스",
    images: [
      {
        url: "https://www.eduvisor.kr/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "에듀바이저스 채용 공고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀바이저스 채용 - 새로운 교육의 미래를 함께 만드세요",
    description: "에듀바이저스에서 당신의 커리어를 시작하세요.",
    images: ["https://www.eduvisor.kr/images/og-image.png"],
  },
  alternates: {
    canonical: "/recruit",
  },
};

export default function RecruitPage() {
  return <RecruitPageClient />;
}
