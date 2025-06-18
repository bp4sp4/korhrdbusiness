"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import Iphone15Pro from "@/components/magicui/iphone-15-pro";

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
    <>
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
      <section className="flex items-center  justify-between min-h-[880px] max-w-[801px] mx-auto p-0 w-full">
        <div>
          <h2 className="text-[48px] font-extrabold">
            전문가와 <br /> 내 커리어 설계
          </h2>
          <p className="mt-5 text-[20px] font-normal text-gray-500">
            나의 목표와 꿈을 현실로 만들어 드립니다.
          </p>
        </div>
        <div className="relative h-[650px]">
          <Iphone15Pro
            className="size-full"
            videoSrc="/images/eduservice/consule.mp4"
          />
        </div>
      </section>
      <div className="bg-gray-100">
        <section className="flex items-center  justify-between min-h-[880px] max-w-[801px] mx-auto p-0 w-full">
          <div className="relative h-[650px]">
            <Iphone15Pro
              className="size-full"
              videoSrc="https://videos.pexels.com/video-files/8946986/8946986-uhd_1440_2732_25fps.mp4"
            />
          </div>
          <div>
            <h2 className="text-[48px] font-extrabold">
              내일의 전문가 <br /> 오늘 지원하세요
            </h2>
            <p className="mt-5 text-[20px] font-normal text-gray-500">
              목표를 현실로, 한평생이 도와드립니다
            </p>
          </div>
        </section>
      </div>
      <section className="flex items-center h-[880px] mx-auto p-0 w-full">
        <div className="mx-auto">
          <h2 className="text-[48px] text-center mb-10  font-extrabold">
            맞춤 교육과 상담
            <br /> 성장의 시작
          </h2>

          <div className="flex gap-8 justify-center">
            {/* 맞춤형 커리큘럼 설계 */}
            <div className=" rounded-xl shadow-lg p-8 flex flex-col items-start w-[300px] h-[300px] bg-blue-800">
              <h3 className="text-xl text-white font-bold mb-2 text-left">
                맞춤형 커리큘럼 설계
              </h3>
              <img
                src="/images/eduservice/FOLDER.png"
                alt=""
                className="w-[150px] h-[150px] mx-auto"
              />
              <p className="text-[#f7f8fb] text-left text-base">
                개인별 목표와 역량에 맞춘 교육 로드맵을 제공합니다.
              </p>
            </div>
            {/* 전문가 1:1 커리어 상담 */}
            <div className="bg-blue-600 rounded-xl shadow-lg p-8 flex flex-col items-start w-[300px] h-[300px]">
              <h3 className="text-xl text-white font-bold mb-2 text-left">
                전문가 1:1 커리어 상담
              </h3>
              <img
                src="/images/eduservice/PASSPORT.png"
                alt=""
                className="w-[150px] h-[150px] mx-auto"
              />
              <p className="text-[#f7f8fb] text-left text-base">
                경력 설계부터 실전 취업까지, 전문가가 함께합니다.
              </p>
            </div>
            {/* 365일 교육상담 지원 */}
            <div className="bg-blue-200 rounded-xl shadow-lg p-8 flex flex-col items-start w-[300px] h-[300px]">
              {/* 아이콘: Clock */}

              <h3 className="text-xl font-bold mb-2 text-left">
                365일 교육상담 지원
              </h3>
              <img
                src="/images/eduservice/CLOCK.png"
                alt=""
                className="w-[150px] h-[150px] mx-auto"
              />
              <p className="text-gray-500 text-left text-base">
                언제든 궁금한 점을 문의하세요. 연중무휴로 도와드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
