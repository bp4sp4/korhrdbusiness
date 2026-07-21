import type { Metadata } from "next";
import AddBranchPageClient from "@/components/addbranch/AddBranchPageClient";

export const metadata: Metadata = {
  // 현재 미사용 페이지 — 검색엔진 색인 제외
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  title: "지점 모집 | 에듀바이저스 - 개인이 아닌 지점으로 성장하는 교육파트너",
  description:
    "한평생 에듀바이저스와 함께 성장할 지점 파트너를 모집합니다. 체계적인 교육 시스템과 마케팅 지원으로 안정적인 지점 운영이 가능합니다.",
  keywords: [
    "지점 모집",
    "에듀바이저스 지점",
    "교육 지점",
    "지점 파트너",
    "가맹점",
    "지점 운영",
  ],
  openGraph: {
    title: "지점 모집 | 에듀바이저스",
    description:
      "개인이 아닌 지점으로 성장하는 교육파트너. 한평생 에듀바이저스와 함께 성장하세요.",
    url: "https://www.eduvisor.kr/addbranch",
    siteName: "에듀바이저스",
    images: [
      {
        url: "https://www.eduvisor.kr/images/addbranch/addbranch_main.png",
        width: 1200,
        height: 630,
        alt: "지점 모집",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function AddBranchPage() {
  return <AddBranchPageClient />;
}
