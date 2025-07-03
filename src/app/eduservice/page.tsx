"use client";
import CategoryTabs from "@/components/CategoryTabs";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { motion } from "framer-motion";

export default function Eduservice() {
  const images = [
    "/images/eduservice/edumain/eduservice001.png",
    "/images/eduservice/edumain/eduservice001.png",
    "/images/eduservice/edumain/eduservice001.png",
    "/images/eduservice/edumain/eduservice002.png",
    "/images/eduservice/edumain/eduservice003.png",
    "/images/eduservice/edumain/eduservice004.png",
    "/images/eduservice/edumain/eduservice005.png",
    "/images/eduservice/edumain/eduservice006.png",
    "/images/eduservice/edumain/eduservice007.png",
    "/images/eduservice/edumain/eduservice008.png",
    "/images/eduservice/edumain/eduservice009.png",
    "/images/eduservice/edumain/eduservice010.png",
    "/images/eduservice/edumain/eduservice011.png",
    "/images/eduservice/edumain/eduservice012.png",
    "/images/eduservice/edumain/eduservice013.png",
    "/images/eduservice/edumain/eduservice014.png",
    "/images/eduservice/edumain/eduservice015.png",
    "/images/eduservice/edumain/eduservice016.png",
    "/images/eduservice/edumain/eduservice017.png",
    "/images/eduservice/edumain/eduservice018.png",
    "/images/eduservice/edumain/eduservice019.png",
    "/images/eduservice/edumain/eduservice020.png",
  ];

  return (
    <>
      <div className="relative flex h-[40vh] w-full flex-col justify-center overflow-hidden">
        <div className="w-full max-w-6xl mx-auto  p-6 bg-background">
          <h2 className="relative z-20 text-2xl text-white md:text-[45px] leading-tight">
            <strong>한평생 에듀바이저</strong>
            와 함께
            <br />
            당신의 <strong> 인생 방향</strong>을 찾으세요
          </h2>
          <p className="relative z-20 py-8 text-left text-base text-neutral-200 md:text-[20px] ">
            우리는 단순한 교육이 아닌,
            <br className="block md:hidden" />
            <strong className="font-extrabold">
              인생의 방향성과 성장의 여정을 함께합니다.
            </strong>
          </p>
        </div>
        <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
        <ThreeDMarquee
          className="pointer-events-none absolute inset-0 h-full w-full"
          images={images}
        />
      </div>
      <section className="w-full ">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="w-full md:w-auto mb-8  md:mb-0 md:
          
          flex-shrink-0"
        >
          <CategoryTabs />
        </motion.div>
      </section>

      <section className="relative flex flex-col md:flex-row items-center justify-between min-h-[600px] md:min-h-[880px] max-w-[1200px] mx-auto p-0 w-full overflow-hidden">
        {/* 텍스트 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full md:w-auto md:mb-8 md:mb-0 md:mr-10 flex-shrink-0 px-4 pt-[72px] pb-0 pl-[32px] pr-[32px] md:pl-[50px] md:pr-[100px]"
        >
          <h2 className="text-[24px] md:text-[40px] text-[#1E1E1E] font-extrabold text-left md:text-Left leading-tight mb-2 md:mb-4  flex items-center justify-center md:justify-center">
            <span className="hidden md:flex">
              <img
                src="/images/eduservice/expert.png"
                alt="career"
                className="w-[30px] h-[30px] md:w-[50px] md:h-[50px] mr-1 md:m-0"
              />
            </span>
            전문가와 내 커리어 설계
          </h2>
          <p className="text-[16px] md:text-[20px] text-[#1E1E1E] text-center md:text-center md:ml-[8px]">
            나의 <strong>목표와 꿈을 현실로</strong> 만들어 드립니다.
          </p>
        </motion.div>
        {/* 아이폰/비디오 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full  mx-auto h-[420px] md:h-[400px]
            flex items-center justify-center
            relative
            translate-y-[40px] md:translate-y-0
            z-10"
        >
          <video
            src="/images/eduservice/video/eduform.mp4"
            className="relative z-0 w-[85%] h-[85%] md:w-[560px] md:h-[560px] object-cover  mb-[135px] md:mb-0"
            autoPlay
            loop
            muted
            playsInline
          />
        </motion.div>
      </section>

      <section className="flex flex-col md:flex-row items-center justify-between min-h-[600px] md:min-h-[680px] max-w-[1200px] mx-auto p-0 w-full overflow-hidden">
        {/* 아이폰 모형 - 먼저 등장 */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full  mx-auto h-[420px] md:h-[400px] flex items-center justify-center order-2 md:order-1 translate-y-[40px] md:translate-y-0 z-10 relative"
        >
          <video
            src="/images/eduservice/video/recruit.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{
              marginBottom: "10px",
              display: "block",
              border: "none !important",
              outline: "none !important",
              boxShadow: "none !important",
              lineHeight: 0,
              verticalAlign: "bottom",
            }}
            className="relative z-0 w-[85%] h-[85%] md:w-[560px] md:h-[560px]"
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
          <h2 className="text-[24px] md:text-[40px] text-[#1E1E1E] font-extrabold text-left md:text-right leading-tight mb-2 md:mb-4 flex items-center justify-center">
            <span className="hidden md:flex items-center justify-center">
              <img
                src="/images/eduservice/career.png"
                alt="career"
                className="w-[30px] h-[30px] md:w-[50px] md:h-[50px] mr-1"
              />
            </span>
            내일의 전문가, 오늘 지원하세요
          </h2>
          <p className="text-[16px] md:text-[20px] text-[#1E1E1E] ml-[0px] md:ml-[55px] md:text-left text-center">
            목표를 현실로, <strong>한평생이 도와드립니다.</strong>
          </p>
        </motion.div>
      </section>

      <section className="px-[32px] mt-[20px] mb-[20px] md:px-0 md:mt-0 md:mb-0">
        <div className="flex items-center min-h-[600px] md:h-[680px]  mx-auto p-0 w-full">
          <div className="mx-auto w-full">
            <motion.h2
              className=" text-[24px] md:text-[48px] text-[#1E1E1E] mt-[83px] text-center mb-6 md:mb-[66px] font-bold leading-tight"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              맞춤 교육과 상담
              <br className="hidden md:block" /> 성장의 시작
            </motion.h2>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-[159px] justify-center items-center md:items-stretch w-full">
              {/* 맞춤형 커리큘럼 설계 */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col items-start w-[90vw] max-w-[367px] h-[240px] md:w-[367px] md:h-[384px] mb-15 md:mb-0"
              >
                <img
                  src="/images/eduservice/grow/Grow001.png"
                  alt="grow001"
                  className="w-[290px] h-[290px] md:w-[367px] md:h-[384px] mx-auto"
                />
              </motion.div>
              {/* 전문가 1:1 커리어 상담 */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col items-start w-[90vw] max-w-[367px] h-[240px] md:w-[367px] md:h-[384px] mb-15 md:mb-0"
              >
                <img
                  src="/images/eduservice/grow/Grow002.png"
                  alt="grow002"
                  className="w-[290px] h-[290px] md:w-[367px] md:h-[384px] mx-auto"
                />
              </motion.div>
              {/* 365일 교육상담 지원 */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col items-start w-[90vw] max-w-[367px] h-[240px] md:w-[367px] md:h-[384px]"
              >
                <img
                  src="/images/eduservice/grow/Grow003.png"
                  alt="grow003"
                  className="w-[290px] h-[290px] md:w-[367px] md:h-[384px] mx-auto"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
