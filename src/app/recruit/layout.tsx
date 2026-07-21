import type { Metadata } from "next";

// 채용 관련 페이지는 현재 미사용 — 검색엔진 색인 제외
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RecruitLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
