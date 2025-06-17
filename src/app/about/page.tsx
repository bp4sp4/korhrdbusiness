"use client";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";

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

  const bgY = useTransform(scrollY, [0, 500], [0, 80]); // 배경은 느리게
  const textY = useTransform(scrollY, [0, 500], [0, -120]); // 텍스트는 더 빠르게

  return (
    <div className=" text-white w-full min-h-screen">
      {/* 1. 히어로/인트로 */}
      <div
        ref={heroRef}
        className="relative w-full bg-[#181d23] h-[100vh] flex items-center justify-center overflow-hidden"
      >
        {/* 배경 이미지에 parallax */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <Image
            src="/images/about/office-bg.png"
            alt="오피스 배경"
            fill
            className="object-cover opacity-60"
            priority
          />
        </motion.div>
        {/* 텍스트에 parallax */}
        <motion.div
          style={{ y: textY }}
          className="relative z-10 flex flex-col w-[1200px] mx-auto pl-[40px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-2">
            누구도 끝까지 책임지지 않던
          </h2>
          <p className="text-2xl md:text-4xl ">교육의 본질을 바꿉니다.</p>
          <p className="text-base font-bold md:text-2xl text-gray-200 mt-10">
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
      <motion.section className="bg-white text-black py-16 relative">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl md:text-4xl font-extrabold mb-10">
            &apos;<span className="text-blue-600">왜?</span>&apos; 교육은
            어렵게만 느껴질까?
          </h3>
          <p className="mb-23 text-2xl">
            수많은 학생분들을 만나오면서
            <br />
            &apos;되는 방법&apos;을 알고, 실제로 &apos;되게&apos; 만듭니다.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 max-w-[1200px] mx-auto mb-16">
            {/* 주부 */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl flex flex-col items-center p-10 text-center">
              <div className="text-gray-500 text-lg md:text-xl mb-2">
                아기 엄마도 쉽게!
              </div>
              <div className="font-extrabold text-3xl md:text-4xl mb-6">
                주부
              </div>
              <img
                src="/images/about/001.png"
                alt="주부"
                className="w-full h-auto object-contain mb-2"
              />
            </div>
            {/* 대학생 */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl flex flex-col items-center p-10 text-center">
              <div className="text-gray-500 text-lg md:text-xl mb-2">
                경쟁력을 원해요
              </div>
              <div className="font-extrabold text-3xl md:text-4xl mb-6">
                대학생
              </div>
              <img
                src="/images/about/002.png"
                alt="대학생"
                className="w-full h-auto object-contain mb-2"
              />
            </div>
            {/* 중장년층 */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl flex flex-col items-center p-10 text-center">
              <div className="text-gray-500 text-lg md:text-xl mb-2">
                제2의직업 대비
              </div>
              <div className="font-extrabold text-3xl md:text-4xl mb-6">
                중장년층
              </div>
              <img
                src="/images/about/003.png"
                alt="중장년층"
                className="w-full h-auto object-contain mb-2"
              />
            </div>
            {/* 노년층 */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl flex flex-col items-center p-10 text-center">
              <div className="text-gray-500 text-lg md:text-xl mb-2">
                정말 쓸모있는 교육
              </div>
              <div className="font-extrabold text-3xl md:text-4xl mb-6">
                노년층
              </div>
              <img
                src="/images/about/004.png"
                alt="노년층"
                className="w-full h-auto object-contain mb-2"
              />
            </div>
          </div>
        </motion.div>
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl md:text-4xl font-extrabold font-extragray-50mt-[200px] mb-4">
            교육은 진짜{" "}
            <span className="bg-blue-500 text-white ">써먹어야 합니다</span>
          </h3>
          <p className="mb-8 text-2xl mt-10">
            수많은 학생분들을 만나오면서
            <br />
            &apos;되는 방법&apos;을 알고, 실제로 &apos;되게&apos; 만듭니다.
          </p>
        </div>
      </motion.section>

      {/* 5. 실제 교육 사례(카드) */}
      <motion.section
        className="bg-white py-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          {/* 1번째 카드 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-left">
              <div className="font-extrabold text-black text-2xl md:text-3xl mb-2">
                검증된 에듀바이저
                <br />
                1:1 배정
              </div>
              <div className="text-gray-400 text-lg md:text-xl">
                한평생교육 정식 소속
              </div>
            </div>
            <div className="flex-1">
              <img
                src="/images/chart.jpg"
                alt="에듀바이저 상담"
                className="w-full h-auto aspect-[4/3] object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
          {/* 2번째 카드 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-left">
              <div className="font-extrabold text-black text-2xl md:text-3xl mb-2">
                검증된 에듀바이저
                <br />
                1:1 배정
              </div>
              <div className="text-gray-400 text-lg md:text-xl">
                한평생교육 정식 소속
              </div>
            </div>
            <div className="flex-1">
              <img
                src="/images/chart.jpg"
                alt="교육기관"
                className="w-full h-auto aspect-[4/3] object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6. CEO 메시지 */}
      <motion.section
        className="bg-white text-black py-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center  gap-12">
          {/* 메시지 영역 */}
          <div className="flex-1 text-left">
            <div className="font-extrabold text-2xl md:text-3xl mb-6">
              CEO Message
            </div>
            <div className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
              한평생가이던스 홈페이지에 방문해 주신 모든 분께 감사의 말씀을
              전합니다.
              <br />
              한평생가이던스는 학생들의 성장과 성공을 최우선으로 생각하며
              <br />
              실질적이고 현장감 있는 교육, 그리고 내일을 바꾸는 서비스를
              제공합니다. 앞으로도 더 많은 분들이 성장의 기회를 잡을 수 있도록
              혁신을 멈추지 않겠습니다.
              <br />
              <br />
              한평생가이던스 임직원 일동
            </div>
            <div className="text-right text-gray-400  text-sm mt-8">
              - 한평생가이던스 대표 양병웅 -
            </div>
          </div>
          {/* 사인 영역 */}
          <div className="flex-1 flex justify-center md:justify-end items-start w-full">
            <img
              src="/images/chart.jpg"
              alt="CEO 서명"
              className="w-64 max-w-full h-auto object-contain"
              style={{ minWidth: 400, minHeight: 400 }}
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
    <section className="bg-[#191f28] py-16">
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
                className="flex justify-start pt-10 md:pt-40 md:gap-10"
              >
                <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                  <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white flex items-center justify-center">
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
                    <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
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
      year: "2022",
      title: "디지털 금융의 새로운 기준",
      description:
        "코로나19 팬데믹 속에서도 토스는 디지털 금융 서비스의 새로운 기준을 제시하며 성장을 이어갔습니다.",
      achievements: [
        "토스뱅크 예비인가 획득",
        "토스증권 출범",
        "간편송금 누적 거래액 100조원 돌파",
        "토스 신용카드 출시",
      ],
    },
    {
      year: "2021",
      title: "금융 슈퍼앱으로의 도약",
      description:
        "토스는 단순한 송금 앱을 넘어 종합 금융 플랫폼으로 진화하며 금융 슈퍼앱의 지위를 확립했습니다.",
      achievements: [
        "시리즈 E 투자 유치 완료",
        "토스페이 출시",
        "토스보험 서비스 시작",
        "월 활성 사용자 1,500만명 돌파",
      ],
    },
    {
      year: "2020",
      title: "비대면 금융의 선두주자",
      description:
        "코로나19로 인한 비대면 서비스 수요 증가와 함께 토스는 디지털 금융의 선두주자로 자리매김했습니다.",
      achievements: [
        "토스 투자 서비스 출시",
        "간편송금 일일 거래량 신기록 달성",
        "토스 대출 서비스 확대",
        "누적 가입자 2,000만명 돌파",
      ],
    },
    {
      year: "2019",
      title: "금융 혁신의 가속화",
      description:
        "토스는 기존 금융권의 한계를 뛰어넘는 혁신적인 서비스들을 연이어 출시하며 금융 혁신을 가속화했습니다.",
      achievements: [
        "토스 가계부 서비스 출시",
        "AI 기반 개인 신용 평가 시스템 도입",
        "오픈뱅킹 서비스 연동",
        "월 활성 사용자 1,000만명 돌파",
      ],
    },
  ];

  return <Timeline data={timelineData} />;
};
