import type { Metadata } from "next";
import RecruitPageClient from "@/components/recruit/RecruitPageClient";

export const metadata: Metadata = {
  title: "한평생 에듀바이저스 | 채용",
  description:
    "교육의 미래를 함께 만들어갈 열정적인 인재를 모집합니다. 한평생 에듀바이저스의 채용 공고를 확인하고 지원하세요.",
  keywords: [
    "한평생 에듀바이저스",
    "한평생에듀바이저스",
    "에듀바이저스 채용",
    "교육계 취업",
    "에듀바이저스 입사",
    "채용 공고",
    "인재 모집",
  ],
  openGraph: {
    title: "한평생 에듀바이저스 | 채용",
    description: "한평생 에듀바이저스에서 당신의 커리어를 시작하세요.",
    url: "https://www.eduvisor.kr/recruit",
    siteName: "한평생 에듀바이저스",
    images: [
      {
        url: "https://www.eduvisor.kr/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "한평생 에듀바이저스 채용 공고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "한평생 에듀바이저스 | 채용",
    description: "한평생 에듀바이저스에서 당신의 커리어를 시작하세요.",
    images: ["https://www.eduvisor.kr/images/og-image.png"],
  },
  alternates: {
    canonical: "/recruit",
  },
};

export default function RecruitPage() {
  return <RecruitPageClient />;
}
