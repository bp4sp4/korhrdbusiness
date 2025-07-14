import type { Metadata } from "next";
import HomePageClient from "@/components/main/HomePageClient";

export const metadata: Metadata = {
  title: "에듀바이저스 | 당신의 커리어 성장 파트너",
  description:
    "에듀바이저스는 전문적인 커리어 상담과 맞춤형 교육 프로그램을 통해 당신의 성공적인 취업과 커리어 발전을 돕습니다. 지금바로 커리어 목표를 달성하세요.",
  keywords: [
    "에듀바이저스",
    "회사소개",
    "교육서비스",
    "교육상담받기",
    "설계사채용",
    "에듀바이저스",
    "에듀바이저",
    "에듀바이저스 채용",
  ],
};

export default function Home() {
  return <HomePageClient />;
}
