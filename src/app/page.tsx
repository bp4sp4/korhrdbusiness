"use client";

import "./main.css";
import { motion, Easing } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const textVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as Easing,
      },
    },
  };

  function ArrowBlink() {
    const [active, setActive] = useState(true);
    useEffect(() => {
      const interval = setInterval(() => {
        setActive((prev) => !prev);
      }, 700);
      return () => clearInterval(interval);
    }, []);
    return (
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center w-[22px] h-[30px]">
        <img
          src="/images/main/arrow_action.png"
          width={22}
          height={11}
          alt="활성"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0px)" : "translateY(-10px)",
            transition: "opacity 1s, transform 1s",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <img
          src="/images/main/arrow_beaction.png"
          width={22}
          height={11}
          alt="비활성"
          style={{
            opacity: active ? 0 : 1,
            transform: active ? "translateY(10px)" : "translateY(0px)",
            transition: "opacity 1s, transform 1s",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </span>
    );
  }

  return (
    <main className="main w-screen min-h-screen flex flex-col items-center bg-white">
      <section
        className="main__hero absolute inset-0 w-full h-full flex items-center justify-center relative"
        style={{
          width: "100vw",
          height: "80vh",
          backgroundImage: "url('/images/main/main__banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "80% 0",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="main__hero-content flex-1 flex flex-col items-start z-10 rounded-lg md:bg-transparent md:p-0">
          <div className="main__hero-title text-white text-xl md:text-7xl mb-6 flex flex-col gap-3">
            <motion.p
              className="text-white text-2xl md:text-4xl font-normal"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              취업난 해결 프로젝트
            </motion.p>
            <motion.h2
              className="text-white text-4xl md:text-5xl font-bold"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              한평생 에듀바이저스
            </motion.h2>
          </div>
          <div className="main__hero-buttons flex">
            <a href="about" className="main__hero-btn">
              시작하기
            </a>
          </div>
        </div>
      </section>
      <section className="main__hero-btn-wrap w-full h-[10vh] flex bg-[#040D33] justify-center items-center">
        <div className="flex items-center flex-col relative w-full h-full mt-10">
          <div className="relative flex items-center gap-2">
            <img src="/images/logo2.png" width={41} height={37} alt="로고" />
            <span className="text-white text-2xl font-bold">
              한평생 에듀바이저의 시작
            </span>
          </div>
          <ArrowBlink />
        </div>
      </section>
      <div className="w-full h-[10vh]">
        <img src="/images/main/main__banner001.png" alt="" />
      </div>
      <div
        className="background-image"
        style={{
          backgroundImage: "url('/images/main/main__banner002.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          width: "100%",
        }}
      >
        <section className="main__service w-full mx-auto flex">
          <div className="main__service__title h-[600px] flex flex-col justify-center">
            <h2 className="text-[40px] font-bold">
              교육은 받았지만 <span className="text-[#2B7FFF]">왜</span> 취업은
              어려울까요?
            </h2>
            <p className="text-[26px]">
              <br />
              한평생 에듀바이저는 많은이들이{" "}
              <strong>자신과 맞지 않는 교육을 선택</strong>하거나 복잡해진
              <br /> 실무·취업 환경에 적응하지 못해{" "}
              <strong>시작조차 어려운하는 경우가 많다</strong>는 사실을
              확인했습니다.
              <br />
              <br />
              <strong>이에 교육과 취업을 하나로 구축하고,</strong>
              <br />
              <strong>&#39;시작부터 현장까지&#39;</strong> 책임지는
              <span className="text-[#2B7FFF] font-bold">
                맞춤형 실무교육을 실현
              </span>
              하고 있습니다.
            </p>
          </div>
        </section>
      </div>
      {/* 3-Image Modern Layout Section */}
      <section className="w-full max-w-5xl mx-auto py-20">
        <h2 className="text-2xl md:text-[40px] mt-[150px] mb-[128px] font-bold text-center">
          한평생 에듀바이저는 다릅니다.
        </h2>
        {/* STEP 1 */}
        <div className="flex flex-col md:flex-row items-center mb-[158px] md:gap-[160px]">
          <img
            src="/images/main/main001.png"
            width={391}
            height={303}
            alt="상담 장면"
            className="rounded-2xl shadow-md object-cover mb-4 md:mb-0"
          />
          <div className="flex-1">
            <div className="w-[60px] h-[26px]bg-[#CBE0FF] mb-[17px] flex items-center justify-center">
              <img
                className=" border-radius-[7px] "
                src="/images/main/step1.png"
                alt=""
              />
            </div>
            <div className="w-[380px]">
              <div className="text-[24px] font-bold text-[#2B7FFF] mb-2">
                학생분들이 처한 환경부터 확인합니다.
              </div>
              <div className="text-[#1e1e1e] text-[20px] leading-relaxed">
                <br />
                한평생의 교육은 <strong>&#39;어디서부터 시작하느냐&#39;</strong>
                가
                <br />
                무엇보다 중요하다고 생각합니다.
                <br />
                <br />
                학습자 각자의 환경과 여건을 먼저 이해하고,
                <br /> 그에 걸맞은 최적의 교육과정을 제공함으로써
                <br /> <strong>진짜 필요한 교육을 실현합니다.</strong>
              </div>
            </div>
          </div>
        </div>
        {/* STEP 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center mb-16 gap-8">
          <img
            src="/images/main/main002.png"
            width={391}
            height={303}
            alt="면접 장면"
            className="rounded-2xl shadow-md object-cover mb-4 md:mb-0"
          />
          <div className="flex-1">
            <div className="w-[60px] h-[26px]bg-[#CBE0FF] mb-[17px] flex items-center justify-center">
              <img
                className=" border-radius-[7px] "
                src="/images/main/step2.png"
                alt=""
              />
            </div>
            <div className="w-[518px]">
              <div className="text-[24px] font-bold text-[#2B7FFF] mb-2">
                꼼꼼하고 세밀하게 관리합니다.
              </div>
              <div className="text-[#1e1e1e] text-[20px] leading-relaxed">
                <br />
                한평생 에듀바이저는 학습자의 중도 포기를 철저히 방지하기 위해,
                전문 양성과정을 거친 설계사들이 체계적인 학습관리 시스템으로
                <br />
                <strong>학습 완료까지 책임지고 동행합니다.</strong>
                <br />
                <br />
                학습자 한 사람 한 사람의 끝맺음을 우리의 사명으로 여깁니다.
              </div>
            </div>
          </div>
        </div>
        {/* STEP 3 */}
        <div className="flex flex-col md:flex-row items-center md:gap-[160px] mb-[230px]">
          <img
            src="/images/main/main003.png"
            width={391}
            height={303}
            alt="취업 준비 장면"
            className="rounded-2xl shadow-md object-cover mb-4 md:mb-0"
          />
          <div className="flex-1">
            <div className="w-[60px] h-[26px]bg-[#CBE0FF] mb-[17px] flex items-center justify-center">
              <img
                className=" border-radius-[7px] "
                src="/images/main/step3.png"
                alt=""
              />
            </div>
            <div className="w-[515px]">
              <div className="text-[24px] font-bold text-[#2B7FFF] mb-2">
                실기와 취업은 저희 몫입니다.
              </div>

              <div className="text-[#1e1e1e] text-[20px] leading-relaxed">
                <br />
                한평생은 교육의 끝이 아닌,
                <br />
                <strong>
                  취업까지 연결되는 실질적인 결과를 중요하게 생각합니다.
                </strong>
                <br />
                <br />
                실기 능력 향상부터 취업 연계까지 전 과정을 지원하며,
                <br />
                교육이 현장으로 자연스럽게 이어질 수 있도록 끝까지 책임집니다.
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Recruit Section */}
      <section className="main__recruit w-full flex-col md:flex-row items-stretch h-auto md:h-[400px] hidden md:flex">
        <div
          className="flex-1 h-[300px] md:h-full flex flex-col justify-center bg-[#aeb2a3]"
          style={{
            backgroundImage: "url('/images/main/metting.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-[1180px] mx-auto flex text-left">
            <div className="w-full relative">
              <h2 className="text-[40px] font-semibold mb-4 text-white">
                한평생 에듀바이저와
                <br />
                함께하실 분을 찾습니다.
              </h2>
              <p className="text-white text-[20px] mb-8">
                판매 실적이 아닌, 고객만족 중심의 파격적인 보상을 드립니다.
                <br />
                오직 고객 만족에만 집중할 수 있는 업무 환경과 최고의 복리후생을
                제공합니다.
              </p>
            </div>
            <div className="w-[1000px] mx-auto relative">
              <div className="absolute left-[49px] bottom-[35px] ">
                <Link
                  className="bg-blue-600 text-white w-[373px] h-[86px] flex items-center justify-center rounded-[20px] text-[32px] font-semibold hover:bg-blue-700 transition text-center"
                  href="/recruit"
                >
                  채용중인 공고 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모바일: 토스 스타일 오버레이 구조 */}
      <section className="relative w-full h-[100vh] flex md:hidden">
        {/* 배경 이미지 */}
        <img
          src="/images/main/metting.png"
          alt="채용 미팅"
          className="w-full h-full object-cover"
          style={{ height: "100vh" }}
        />
        {/* 오버레이 텍스트/버튼 */}
        <div
          className="absolute inset-0 flex flex-col items-center px-4"
          style={{
            padding: "60px 0 0",
          }}
        >
          <h2 className="text-xl text-[#3b2e1a] font-semibold mb-3 text-center text-black drop-shadow">
            함께하실 분을 찾습니다.
          </h2>
          <p className="text-base text-[#4b3a1a] mb-6 text-center text-black drop-shadow">
            판매 실적이 아닌, 고객만족 중심의 파격적인 보상을 드립니다.
            <br />
            오직 고객 만족에만 집중할 수 있는 업무 환경과
            <br />
            최고의 복리후생을 제공합니다.
          </p>
          <Link
            href="/recruit"
            className="bg-[#2B7FFF] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-blue-700 transition text-center inline-block"
          >
            채용중인 분야 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
