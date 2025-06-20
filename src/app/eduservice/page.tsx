"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";

import { motion } from "framer-motion";
import Link from "next/link";

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
    "/images/eduservice/eduservice019.png",
    "/images/eduservice/eduservice020.png",
    "/images/eduservice/eduservice021.png",
    "/images/eduservice/eduservice022.png",
    "/images/eduservice/eduservice015.png",
    "/images/eduservice/eduservice009.png",
  ];

  return (
    <>
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        <h2 className="relative z-20 mx-auto max-w-4xl text-center text-3xl font-extrabold text-white md:text-5xl lg:text-6xl leading-tight">
          한평생에듀바이저와 함께
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
          <Link
            href="/counsel"
            className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none shadow"
          >
            상담 신청하기
          </Link>
          <Link
            href="/about"
            className="rounded-md border border-blue-600 bg-white px-6 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none shadow"
          >
            서비스 소개 보기
          </Link>
        </div>

        {/* overlay */}
        <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
        <ThreeDMarquee
          className="pointer-events-none absolute inset-0 h-full w-full"
          images={images}
        />
      </div>
      <section className="relative flex flex-col md:flex-row items-center justify-between min-h-[600px] md:min-h-[880px] max-w-[801px] mx-auto p-0 w-full overflow-hidden">
        {/* 텍스트 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full md:w-auto mb-8 md:mb-0 md:mr-8 flex-shrink-0 px-4"
          style={{ padding: "72px 32px 0" }}
        >
          <h2 className="text-[32px] md:text-[48px] font-extrabold text-left md:text-Left leading-tight mb-4">
            전문가와
            <br />내 커리어 설계
          </h2>
          <p className="text-[16px] md:text-[20px] text-gray-400 text-left md:text-center">
            나의 목표와 꿈을 현실로 만들어 드립니다.
          </p>
        </motion.div>
        {/* 아이폰/비디오 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full max-w-[340px] mx-auto h-[420px] md:h-[650px]
            flex items-center justify-center
            relative
            translate-y-[40px] md:translate-y-0
            z-10"
        >
          <img
            src="/images/eduservice/phone_14_01.png"
            alt="iPhone Frame"
            className="relative z-0 h-full w-full object-contain"
          />

          <video
            src="/images/eduservice/consult.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute z-10 w-[93%] h-[97%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[10px]  object-cover overflow-hidden"
          />
        </motion.div>
      </section>
      <div className="bg-gray-100">
        <section className="flex flex-col md:flex-row items-center justify-between min-h-[600px] md:min-h-[880px] max-w-[801px] mx-auto p-0 w-full overflow-hidden">
          {/* 아이폰 모형 - 먼저 등장 */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full max-w-[340px] mx-auto h-[420px] md:h-[650px] flex items-center justify-center order-2 md:order-1 translate-y-[40px] md:translate-y-0 z-10 relative"
          >
            {/* The phone frame image acts as the background */}
            <img
              src="/images/eduservice/phone_14_01.png"
              alt="iPhone Frame"
              className="relative z-0 h-full w-full object-contain"
            />

            {/* The video is absolutely positioned on top of the image */}
            <video
              src="/images/eduservice/recruit.mp4"
              autoPlay
              muted
              loop
              playsInline // Add for iOS compatibility
              className="absolute z-10 w-[93%] h-[97%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[10px] object-cover overflow-hidden"
            />
          </motion.div>
          {/* 텍스트 - 나중에 등장 */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full md:w-auto mb-8 md:mb-0 md:ml-16 flex-shrink-0 px-4 order-1 md:order-2"
            style={{
              padding: "72px 32px 0",
            }}
          >
            <h2 className="text-[32px] md:text-[48px] font-extrabold text-left md:text-left leading-tight mb-4">
              내일의 전문가 <br /> 오늘 지원하세요
            </h2>
            <p className="text-[16px] md:text-[20px] text-gray-400 text-left md:text-right">
              목표를 현실로, 한평생이 도와드립니다.
            </p>
          </motion.div>
        </section>
      </div>
      <section className="px-[32px] mt-[20px] mb-[20px] md:px-0 md:mt-0 md:mb-0">
        <div className="flex items-center min-h-[600px] md:h-[880px]  mx-auto p-0 w-full">
          <div className="mx-auto w-full">
            <motion.h2
              className="pt-[20px] pb-[20px] text-[28px] md:text-[48px] text-center mb-6 md:mb-10 font-extrabold leading-tight"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              맞춤 교육과 상담
              <br className="hidden md:block" /> 성장의 시작
            </motion.h2>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center md:items-stretch w-full">
              {/* 맞춤형 커리큘럼 설계 */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-xl shadow-lg p-10 md:p-8 flex flex-col items-start w-[90vw] max-w-[320px] h-[240px] md:w-[300px] md:h-[300px] bg-blue-800"
              >
                <h3 className="text-lg md:text-xl text-white font-bold mb-2 text-left">
                  맞춤형 커리큘럼 설계
                </h3>
                <img
                  src="/images/eduservice/FOLDER.png"
                  alt=""
                  className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] mx-auto"
                />
                <p className="text-[#f7f8fb] text-left text-sm md:text-base mt-2">
                  개인별 목표와 역량에 맞춘 교육 로드맵을 제공합니다.
                </p>
              </motion.div>
              {/* 전문가 1:1 커리어 상담 */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-blue-600 rounded-xl shadow-lg p-10 md:p-8 flex flex-col items-start w-[90vw] max-w-[320px] h-[240px] md:w-[300px] md:h-[300px]"
              >
                <h3 className="text-lg md:text-xl text-white font-bold mb-2 text-left">
                  전문가 1:1 커리어 상담
                </h3>
                <img
                  src="/images/eduservice/PASSPORT.png"
                  alt=""
                  className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] mx-auto"
                />
                <p className="text-[#f7f8fb] text-left text-sm md:text-base mt-2">
                  경력 설계부터 실전 취업까지, 전문가가 함께합니다.
                </p>
              </motion.div>
              {/* 365일 교육상담 지원 */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-blue-200 rounded-xl shadow-lg p-10 md:p-8 flex flex-col items-start w-[90vw] max-w-[320px] h-[240px] md:w-[300px] md:h-[300px]"
              >
                <h3 className="text-lg md:text-xl font-bold mb-2 text-left">
                  365일 교육상담 지원
                </h3>
                <img
                  src="/images/eduservice/CLOCK.png"
                  alt=""
                  className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] mx-auto"
                />
                <p className="text-gray-500 text-left text-sm md:text-base mt-2">
                  언제든 궁금한 점을 문의하세요. 연중무휴로 도와드립니다.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
