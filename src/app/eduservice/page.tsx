"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";

export default function Eduservice() {
  const images = [
    "/images/eduservice/eduservice001.png",
    "/images/eduservice/eduservice001.png",
    "/images/eduservice/eduservice001.png",
    "/images/eduservice/eduservice002.png",
    "/images/eduservice/eduservice003.png",
    "/images/eduservice/eduservice004.png",
    "/images/eduservice/eduservice005.png",
    "/images/eduservice/eduservice006.png",
    "/images/eduservice/eduservice006.png",
    "/images/eduservice/eduservice007.png",
    "/images/eduservice/eduservice007.png",
    "/images/eduservice/eduservice008.png",
    "/images/eduservice/eduservice009.png",
    "/images/eduservice/eduservice010.png",
    "/images/eduservice/eduservice011.png",
    "/images/eduservice/eduservice012.png",
    "/images/eduservice/eduservice013.png",
    "/images/eduservice/eduservice014.png",
    "/images/eduservice/eduservice015.png",
    "/images/eduservice/eduservice016.png",
    "/images/eduservice/eduservice017.png",
    "/images/eduservice/eduservice018.png",
    "/images/eduservice/eduservice018.png",
    "/images/eduservice/eduservice018.png",
    "/images/eduservice/eduservice018.png",
    "/images/eduservice/eduservice018.png",
    "/images/eduservice/eduservice019.png",
    "/images/eduservice/eduservice020.png",
  ];
  return (
    <div className="relative  flex h-screen w-full flex-col items-center justify-center overflow-hidden ">
      <h2 className="relative z-20 mx-auto max-w-4xl text-center text-3xl font-extrabold text-white md:text-5xl lg:text-6xl leading-tight">
        한평생가이던스와 함께
        <span className="relative inline-block mx-2 align-middle">
          <span className="bg-blue-600/80 px-4 py-1 rounded-lg text-white font-extrabold shadow-lg">
            당신의 인생 방향
          </span>
        </span>
        을 찾으세요
      </h2>
      <p className="relative z-20 mx-auto max-w-2xl py-8 text-center text-base text-neutral-200 md:text-lg">
        우리는 단순한 교육이 아닌,
        <br />
        인생의 방향성과 성장의 여정을 함께합니다.
      </p>

      <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
        <button className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none shadow">
          상담 신청하기
        </button>
        <button className="rounded-md border border-blue-600 bg-white px-6 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none shadow">
          서비스 소개 보기
        </button>
      </div>

      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
  );
}
