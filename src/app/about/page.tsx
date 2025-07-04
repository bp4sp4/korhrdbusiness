"use client";
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import "../main.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Card } from "@/components/ui/card";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  achievements: string[];
}

export default function EduServicePage() {
  // Parallax 관련 ref 및 motion 값 정의
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const bgY = useTransform(scrollY, [0, 500], [0, 80]);
  const textY = useTransform(scrollY, [0, 500], [0, -120]);

  // Swiper autoplay 제어용 (Intersection Observer + Swiper 인스턴스)
  const eduTopSwiperRef = useRef<SwiperClass | null>(null);
  const eduTopContainerRef = useRef<HTMLDivElement | null>(null);
  const [eduTopActive, setEduTopActive] = useState(false);
  const eduCardsSwiperRef = useRef<SwiperClass | null>(null);
  const eduCardsContainerRef = useRef<HTMLDivElement | null>(null);
  const [eduCardsActive, setEduCardsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer1 = new window.IntersectionObserver(
      ([entry]) => setEduTopActive(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (eduTopContainerRef.current)
      observer1.observe(eduTopContainerRef.current);
    const observer2 = new window.IntersectionObserver(
      ([entry]) => setEduCardsActive(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (eduCardsContainerRef.current)
      observer2.observe(eduCardsContainerRef.current);
    return () => {
      observer1.disconnect();
      observer2.disconnect();
    };
  }, []);

  useEffect(() => {
    if (eduTopSwiperRef.current && eduTopSwiperRef.current.autoplay) {
      if (eduTopActive) {
        eduTopSwiperRef.current.autoplay.start();
      } else {
        eduTopSwiperRef.current.autoplay.stop();
      }
    }
  }, [eduTopActive]);

  useEffect(() => {
    if (eduCardsSwiperRef.current && eduCardsSwiperRef.current.autoplay) {
      if (eduCardsActive) {
        eduCardsSwiperRef.current.autoplay.start();
      } else {
        eduCardsSwiperRef.current.autoplay.stop();
      }
    }
  }, [eduCardsActive]);

  return (
    <div className=" text-white w-full min-h-screen">
      {/* 1. 히어로/인트로 */}
      <div
        ref={heroRef}
        className="relative w-full  h-[100vh] flex items-center justify-center overflow-hidden"
      >
        {/* 배경 이미지에 parallax */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <div className="absolute inset-0 w-full h-full z-0">
            <img
              src="/images/about/about_main_banner.png"
              alt="eduservice001"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
        <motion.div
          style={{ y: textY }}
          className="relative z-10 flex flex-col w-[1200px] mx-auto pl-[40px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2
            className="text-3xl md:text-6xl font-extrabold mb-2"
            style={{ letterSpacing: "-2px" }}
          >
            누구도 끝까지 책임지지 않던
          </h2>
          <p className="text-2xl font-bold md:text-5xl ">
            교육의 본질을 바꿉니다.
          </p>
          <p className="text-lg font-bold md:text-3xl text-gray-200 mt-10">
            한평생교육은 정말{" "}
            <span className="text-white font-bold border-b-2 border-white-400">
              한 평생 함께합니다.
            </span>
          </p>
        </motion.div>
      </div>

      {/* 2. 연혁(타임라인) */}
      <motion.section
        className="bg-[#191f28] py-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="w-full font-sans md:px-10">
            <div className="relative max-w-4xl mx-auto pb-20">
              <TimelineSection />
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. 교육 철학/슬로건 */}
      <motion.section className="bg-white text-black mt-[134px]  relative">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="md:text-[40px] text-2xl font-extrabold mb-[133px]">
            &apos;<span className="text-blue-600">왜?</span>&apos; 교육은
            어렵게만 느껴질까?
          </h3>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* 카드 더미 보일때 카드 데이터 배열*/}
          {(() => {
            const eduTopCards = [
              { img: "/images/about/edu001.png" },
              { img: "/images/about/edu002.png" },
              { img: "/images/about/edu003.png" },
              { img: "/images/about/edu004.png" },
            ];
            return (
              <>
                {/* 모바일 Swiper */}
                <div
                  className="block md:hidden mb-[178px]"
                  ref={eduTopContainerRef}
                >
                  <Swiper
                    modules={[Autoplay]}
                    spaceBetween={10}
                    slidesPerView="auto"
                    centeredSlides={true}
                    loop={true}
                    autoplay={{ delay: 2000, disableOnInteraction: false }}
                    onSwiper={(swiper) => {
                      eduTopSwiperRef.current = swiper;
                    }}
                    className="w-full px-2"
                    style={{ paddingLeft: 0, paddingRight: 0 }}
                  >
                    {eduTopCards.map((card, idx) => (
                      <SwiperSlide
                        key={card.img + idx}
                        style={{ width: 270, maxWidth: 270 }}
                        className="!w-[270px]"
                      >
                        <div className="flex justify-center">
                          <Card
                            className="relative flex flex-col justify-end overflow-hidden r h-[380px] w-[270px]"
                            style={{ width: 270, height: 380 }}
                          >
                            <img
                              src={card.img}
                              alt=""
                              className="w-full h-full object-cover object-center "
                              style={{ borderRadius: "16px" }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </Card>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                {/* 데스크탑 기존 그리드 */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 max-w-[1200px] mx-auto mb-[178px] px-2">
                  {eduTopCards.map((card, idx) => (
                    <div
                      className="flex flex-col items-center"
                      key={card.img + idx}
                    >
                      <img
                        src={card.img}
                        alt=""
                        className="w-[270px] h-[380px] md:w-full object-contain rounded-2xl"
                        style={{ borderRadius: "16px" }}
                      />
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
          <div className="flex flex-col items-center justify-center">
            <p className="mb-[123px] md:text-[32px] text-2xl text-center">
              수많은 학생분들을 만나오면서
              <br />
              <strong>
                <span className="text-[#2B7FFF]">&apos;되는 방법&apos;</span> 을
                알고, <br className="md:hidden" />
                <span className="text-[#2B7FFF]">
                  &apos;실제로 되게&apos;
                </span>{" "}
                만듭니다.
              </strong>
            </p>
          </div>
        </motion.div>
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl md:text-4xl font-bold font-extragray-50mt-[200px] mt-[198px] mb-[106px] ">
            교육은 <span className="text-[#2B7FFF] ">진짜 써먹어야 합니다</span>
          </h3>
        </div>
        {/* 아래 educard 카드들도 motion.div로 감싸서 등장 애니메이션 적용 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {(() => {
            const eduCards = [
              { img: "/images/about/educard001.png" },
              { img: "/images/about/educard002.png" },
              { img: "/images/about/educard003.png" },
              { img: "/images/about/educard004.png" },
            ];
            return (
              <>
                {/* 모바일 Swiper */}
                <div
                  className="block md:hidden mb-[178px]"
                  ref={eduCardsContainerRef}
                >
                  <Swiper
                    spaceBetween={10}
                    slidesPerView="auto"
                    centeredSlides={true}
                    loop={true}
                    onSwiper={(swiper) => {
                      eduCardsSwiperRef.current = swiper;
                    }}
                    className="w-full px-2"
                    style={{ paddingLeft: 0, paddingRight: 0 }}
                  >
                    {eduCards.map((card, idx) => (
                      <SwiperSlide
                        key={card.img + idx}
                        style={{ width: 274, maxWidth: 317 }}
                        className="!w-[300px]"
                      >
                        <div className="flex justify-center">
                          <Card
                            className="relative flex flex-col justify-end overflow-hidden r h-[380px] w-[270px]"
                            style={{ width: 310, height: 317 }}
                          >
                            <img
                              src={card.img}
                              alt=""
                              className="w-full h-full object-cover "
                              style={{ borderRadius: "16px" }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </Card>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                {/* 데스크탑 기존 그리드 */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto mb-[178px] px-2">
                  {eduCards.map((card, idx) => (
                    <div
                      className="flex flex-col items-center"
                      key={card.img + idx}
                    >
                      <Card
                        className="relative flex flex-col justify-end overflow-hidden bg-white h-[310px] w-[270px]"
                        style={{ width: 270, height: 310 }}
                      >
                        <img
                          src={card.img}
                          alt=""
                          className="w-full h-full object-cover object-center rounded-2xl"
                          style={{ borderRadius: "16px" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </Card>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </motion.div>
        <div className="flex flex-col items-center justify-center">
          <p className="mb-[247px] md:text-[32px] text-[20px]  text-center">
            한평생 에듀바이저는 단순한 교육이 아닌,
            <br />
            <span className="font-bold">
              인생의 방향성과 성장을 함께 하겠습니다.
            </span>
          </p>
        </div>
      </motion.section>

      {/* 6. CEO 메시지 */}
      <motion.section
        className="bg-red-100 text-black py-16 "
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-6xl mx-auto  flex flex-col md:flex-row items-center  gap-12">
          {/* 메시지 영역 */}
          <div className="flex-1 text-left">
            <div className="font-extrabold text-2xl md:text-3xl mb-6">
              CEO Message
            </div>
            <div className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
              한평생에듀바이저 홈페이지에 방문해 주신 모든 분께 감사의 말씀을
              전합니다.
              <br />
              한평생에듀바이저는 학생들의 성장과 성공을 최우선으로 생각하며
              <br />
              실질적이고 현장감 있는 교육, 그리고 내일을 바꾸는 서비스를
              제공합니다. 앞으로도 더 많은 분들이 성장의 기회를 잡을 수 있도록
              혁신을 멈추지 않겠습니다.
              <br />
              <br />
              한평생에듀바이저 임직원 일동
            </div>
            <div className="text-right text-gray-400  text-sm mt-8">
              - 한평생에듀바이저 대표 양병웅 -
            </div>
          </div>
          {/* 사인 영역 */}
          <div className="flex-1 flex justify-center md:justify-end items-start w-full">
            <img
              src="/images/chart.jpg"
              alt="CEO 서명"
              className="w-64 max-w-full h-auto object-contain md:w-[400px] md:h-[400px]"
              style={{ minWidth: 300, minHeight: 300 }}
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
}

const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section className="bg-[#191f28] py-[30px]">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl md:text-4xl font-bold mb-12 text-center text-white">
          한평생교육은 매일,
          <br />
          누군가의 내일을 바꾸고 있습니다.
        </h3>
        <div className="w-full font-sans md:px-10" ref={containerRef}>
          <div ref={ref} className="relative max-w-4xl mx-auto pb-20">
            {data.map((item: TimelineEntry, index: number) => (
              <div
                key={index}
                className="flex justify-start pt-10 md:pt-30 md:gap-10"
              >
                <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                  <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full  flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-blue-500 border border-blue-600 p-2" />
                  </div>
                  <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-blue-400">
                    {item.year}
                  </h3>
                </div>
                <div className="relative pl-20 pr-4 md:pl-4 w-full">
                  <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-blue-400">
                    {item.year}
                  </h3>
                  <div className="text-white">
                    <h4 className="text-xl md:text-2xl font-bold mb-4 text-white">
                      {item.title}
                    </h4>
                    <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed w-[300px]">
                      {item.description}
                    </p>
                    <div className="space-y-2">
                      {item.achievements.map(
                        (achievement: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 text-gray-300 text-sm md:text-base"
                          >
                            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                            <span>{achievement}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                height: height + "px",
              }}
              className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-gray-600 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
            >
              <motion.div
                style={{
                  height: heightTransform,
                  opacity: opacityTransform,
                }}
                className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-blue-500 via-blue-400 to-transparent rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineSection = () => {
  const timelineData: TimelineEntry[] = [
    {
      year: "2025",
      title: "교육플랫폼의 새로운 기준",
      description:
        "한평생교육은 파편화된 교육 시장을 통합하고, '한평생에듀바이저스' 플랫폼으로 교육 접근성과 안정성을 획기적으로 개선하며, 교육 산업의 새로운 표준을 제시하고 있습니다.",
      achievements: ["한평생 에듀바이저스 정식출범"],
    },
    {
      year: "2024",
      title: "교육플랫폼으로의 도약",
      description:
        "한평생교육은 기존 교육의 한계를 넘어서, 학습부터 자격 취득, 취업 연계까지 아우르는 종합 교육 플랫폼으로 진화하며 업계 내 확고한 지위를 확보하였습니다.",
      achievements: [
        "(주)한평생교육 법인 설립",
        "교육브랜드 정식 플랫폼화 실시",
        "취업연계 서비스 구축",
      ],
    },
    {
      year: "2023",
      title: "평생교육의 첫 서비스화",
      description:
        "교육과 취업을 연결하는 사명을 바탕으로, 교육을 하나의 서비스로 혁신하여 실질적인 가치를 제공하는 여정을 시작하였습니다.",
      achievements: [
        "한국평생교육지원센터 설립",
        "한국실습지원센터 설립",
        "전국단위 실습섭외 서비스 구축",
      ],
    },
  ];

  return <Timeline data={timelineData} />;
};
