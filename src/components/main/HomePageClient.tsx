"use client";

import Image from "next/image";
import "@/app/main.css";
import { motion, Easing } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePageClient() {
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
      }, 2000);
      return () => clearInterval(interval);
    }, []);
    return (
      <span className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[22px] h-[30px]">
        <Image
          src="/images/main/arrow_action.png"
          width={22}
          height={11}
          alt="활성 화살표"
          className={`absolute top-0 left-0 transition-all ease-in-out duration-[2000ms] ${
            active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2.5"
          }`}
        />
        <Image
          src="/images/main/arrow_beaction.png"
          width={22}
          height={11}
          alt="비활성 화살표"
          className={`absolute top-0 left-0 transition-all ease-in-out duration-[2000ms] ${
            !active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
          }`}
        />
      </span>
    );
  }

  return (
    <main className="main w-screen min-h-screen flex flex-col items-center bg-white">
      {/* 구조화된 데이터 (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "에듀바이저스",
            alternateName: ["한평생 에듀바이저스", "한평생에듀바이저스"],
            description:
              "에듀바이저스(한평생 에듀바이저스)는 1:1 맞춤형 커리어 설계와 실무 중심 교육을 통해 성공적인 취업과 커리어 개발을 돕는 교육 서비스입니다. 자격증, 유학 프로그램까지 한평생교육의 전문가가 함께합니다.",
            url: "https://www.eduvisor.kr",
            logo: "https://www.eduvisor.kr/images/logo2.png",
            address: {
              "@type": "PostalAddress",
              addressCountry: "KR",
              addressLocality: "서울",
              addressRegion: "서울특별시",
            },
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              availableLanguage: "Korean",
            },
            sameAs: ["https://www.eduvisor.kr"],
            keywords:
              "에듀바이저스, 한평생 에듀바이저스, 커리어 설계, 자격증 교육, 유학 프로그램",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "교육 서비스",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "커리어 설계 상담",
                    description: "1:1 맞춤형 커리어 설계 상담 서비스",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "자격증 교육",
                    description: "민간자격증, 교육 프로그램",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "유학 프로그램",
                  },
                },
              ],
            },
          }),
        }}
      />
      {/* Desktop Hero Section */}
      <section
        className="main__hero hidden md:flex absolute inset-0 w-full h-full items-center justify-center relative"
        style={{
          width: "100vw",
          height: "75vh",
          backgroundImage: "url('/images/main/main__banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "80% 0",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="main__hero-content flex-1 flex flex-col items-start z-10 rounded-lg md:bg-transparent md:p-0 ">
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
      {/* Mobile Hero Section */}
      <section
        className="main__hero flex md:hidden absolute inset-0 w-full h-full items-center justify-center relative"
        style={{
          width: "100vw",
          height: "75vh",
          backgroundImage: "url('/images/main/main__banner__mobile.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="main__hero-content flex-1 flex flex-col items-start z-10 rounded-lg p-6">
          <div className="absolute bottom-[40px] left-0 right-0 max-w-[300px] mx-auto">
            <div className="main__hero-title text-white text-xl mb-4 flex flex-col gap-2 ">
              <motion.p
                className="text-white text-2xl font-normal"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                취업난 해결 프로젝트
              </motion.p>
              <motion.h2
                className="text-white text-4xl font-bold"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                한평생 에듀바이저스
              </motion.h2>
            </div>
            <div className="main__hero-buttons flex">
              <a href="about" className="main__hero-btn text-base px-4 py-2 ">
                시작하기
              </a>
            </div>
          </div>
        </div>
      </section>
      <section
        className="main__hero-btn-wrap w-full h-[20vh] "
        style={{
          backgroundImage: "url('/images/main/main__banner001.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex items-center flex-col justify-center w-full mt-10 md:mt-10">
          <div className="relative flex items-center justify-center gap-2">
            <img
              src="/images/logo2.png"
              className="w-[25px] h-[25px] md:w-[25px] md:h-[25px] hidden md:block"
              alt="로고"
            />
            <span className="text-white text-[14px] md:text-2xl font-bold">
              한평생 에듀바이저스의 시작
            </span>
            <ArrowBlink />
          </div>
        </div>
      </section>

      <div
        className="background-image "
        style={{
          backgroundImage: "url('/images/main/main__banner002.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
          width: "100%",
        }}
      >
        {/* 데스크탑 전용 */}
        <section className="hidden md:block main__service w-full mx-auto flex">
          <div className="main__service__title h-[600px] flex flex-col justify-center md:items-start md:px-0 px-10">
            <h2 className="text-[30px] md:text-[40px] font-bold  md:block">
              교육은 받았지만
              <br className="block md:hidden" />
              <span className="text-[#2B7FFF]">&nbsp;왜</span> 취업은
              어려울까요?
            </h2>
            <p className="text-[18px] md:text-[26px] flex flex-col md:items-center md:justify-center md:block">
              <br />
              한평생 에듀바이저스는 많은이들이
              <strong>자신과 맞지 않는 교육을 선택</strong>하거나 복잡해진
              <br className="hidden md:block" /> 실무·취업 환경에 적응하지 못해
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
        {/* 모바일 전용 */}
        <section className="md:hidden w-full px-6 py-20 mx-auto px-10">
          <h2 className="text-[30px] md:text-[40px] font-bold md:block">
            교육은 받았지만
            <br className="block md:hidden" />
            <span className="text-[#2B7FFF]">왜</span> 취업은 어려울까요?
          </h2>
          <p className="text-[18px] md:text-[26px] flex flex-col md:items-center md:justify-center md:block">
            <br />
            한평생 에듀바이저스는 많은이들이
            <strong>자신과 맞지 않는 교육을 선택 하거나</strong> 복잡해진
            <br className="hidden md:block" /> 실무·취업 환경에 적응하지 못해
            <strong>시작조차 어려운하는 경우가 많다는</strong> 사실을
            확인했습니다.
            <br />
            <br />
            <strong>이에 교육과 취업을 하나로 구축하고,</strong>
            <strong>&#39;시작부터 현장까지&#39; 책임지는</strong>
            <span className="text-[#2B7FFF] font-bold">
              맞춤형 실무교육을 실현
              <span className="text-[#1e1e1e]"> 하고 있습니다.</span>
            </span>
          </p>
        </section>
      </div>

      <section className="w-full max-w-5xl mx-auto py-0 md:py-20">
        <h2 className="text-2xl md:text-[40px] mt-[100px] md:mt-[150px] mb-[128px] font-bold text-center">
          한평생 에듀바이저스는 다릅니다.
        </h2>
        {/* STEP 1 */}
        <div className="flex flex-col md:flex-row items-center mb-[70px] md:mb-[158px] md:gap-[160px] md:px-0 px-10">
          <img
            src="/images/main/main001.png"
            width={391}
            height={303}
            alt="상담 장면"
            className="rounded-2xl shadow-md object-cover mb-4 md:mb-0"
          />
          <div className="flex-1 md:mt-0 mt-5">
            <div className="w-[60px] h-[26px]bg-[#CBE0FF] mb-[17px] flex items-center justify-center">
              <img
                className=" border-radius-[7px] "
                src="/images/main/step1.png"
                alt="step1"
              />
            </div>
            <div className="w-[300px] md:w-[380px]">
              <div className="text-[20px] md:text-[24px] font-bold text-[#2B7FFF] mb-3">
                학생분들이 처한 환경부터 확인합니다.
              </div>
              <div className="text-[#1e1e1e] text-[16px] md:text-[20px] leading-[1.5]">
                한평생의 교육은 <strong>&#39;어디서부터 시작하느냐&#39;</strong>
                가
                <br />
                무엇보다 중요하다고 생각합니다.
                <br />
                <br />
                학습자 각자의 환경과 여건을 먼저 이해하고,
                <br /> 그에 걸맞은 최적의 교육과정을 제공함으로써
                <br /> <strong>진짜 필요한 교육을 실현합니다.</strong>
                <br /> <span className="text-[#2b7fff]">(사회복지사 자격증 상담은 무료로 진행됩니다.
사회복지사 자격증 수강료 70% 할인)</span>
              </div>
            </div>
          </div>
        </div>
        {/* STEP 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center  mb-[70px] md:mb-[158px] md:gap-8 gap-0 md:px-0 px-10">
          <img
            src="/images/main/main002.png"
            width={391}
            height={303}
            alt="면접 장면"
            className="rounded-2xl shadow-md object-cover mb-4 md:mb-0"
          />
          <div className="flex-1 md:mt-0 mt-5">
            <div className="w-[60px] h-[26px]bg-[#CBE0FF] mb-[17px] flex items-center justify-center">
              <img
                className=" border-radius-[7px] "
                src="/images/main/step2.png"
                alt="step2"
              />
            </div>
            <div className="w-[300px] md:w-[518px]">
              <div className="md:text-[24px] text-[20px] font-bold text-[#2B7FFF] mb-3">
                꼼꼼하고 세밀하게 관리합니다.
              </div>
              <div className="text-[#1e1e1e] text-[16px] md:text-[20px] leading-[1.5]">
                한평생 에듀바이저스는 학습자의 중도 포기를{" "}
                <br className="md:hidden" />
                철저히 방지하기 위해, 전문 양성과정을 거친
                <br className="md:hidden" />
                설계사들이 체계적인 학습관리 시스템으로
                <br className="md:hidden" />
                &nbsp;
                <strong>학습 완료까지 책임지고 동행합니다.</strong>
                <br />
                <br />
                학습자 한 사람 한 사람의 끝맺음을
                <br className="md:hidden" />
                우리의 사명으로 여깁니다.
              </div>
            </div>
          </div>
        </div>
        {/* STEP 3 */}
        <div className="flex flex-col md:flex-row items-center md:gap-[160px] mb-[230px] md:px-0 px-10">
          <img
            src="/images/main/main003.png"
            width={391}
            height={303}
            alt="취업 준비 장면"
            className="rounded-2xl shadow-md object-cover mb-4 md:mb-0"
          />
          <div className="flex-1 md:mt-0 mt-5">
            <div className="w-[60px] h-[26px]bg-[#CBE0FF] mb-[17px] flex items-center justify-center">
              <img
                className=" border-radius-[7px] "
                src="/images/main/step3.png"
                alt="step3"
              />
            </div>
            <div className="w-[300px] md:w-[515px]">
              <div className="md:text-[24px] text-[20px] font-bold text-[#2B7FFF] mb-3">
                실기와 취업은 저희 몫입니다.
              </div>

              <div className="text-[#1e1e1e] text-[16px] md:text-[20px] leading-[1.5]">
                한평생은 교육의 끝이 아닌,
                <br className="hidden md:block" />
                <strong>
                  취업까지 연결되는 실질적인 결과를 중요하게 생각합니다.
                </strong>
                <br />
                <br />
                실기 능력 향상부터 취업 연계까지 전 과정을 지원하며, 교육이
                현장으로 자연스럽게 이어질 수 있도록 끝까지 책임집니다.
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 취업지원 섹션 */}
      <section className="main__recruit w-full flex-col md:flex-row items-stretch h-auto md:h-[400px] hidden md:flex">
        <div
          className="flex-1 h-[300px] md:h-full flex flex-col justify-center bg-[#aeb2a3]"
          style={{
            backgroundImage: "url('/images/main/metting.png')",
            backgroundSize: "cover",
          }}
        >
          <div className="w-[1180px] mx-auto flex text-left">
            <div className="w-full relative">
              <h2 className="text-[40px] font-semibold mb-4 text-white">
                한평생 에듀바이저스와
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
                  className="bg-[#2B7FFF] text-white w-[373px] h-[86px] flex items-center justify-center rounded-[20px] text-[20px] font-semibold hover:bg-blue-700 transition text-center"
                  href="/recruit"
                >
                  채용중인 공고 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모바일 취업지원 섹션 */}
      <section className="block md:hidden w-full h-[100vh] relative ">
        <img
          src="/images/main/main__banner002__mobile.png"
          alt="채용 미팅 모바일"
          className="w-full h-full object-cover"
        />

        <div className="absolute mt-10 inset-0 flex flex-col max-w-[300px] mx-auto">
          <h2 className="text-[30px] font-bold mb-3 text-white ">
            한평생 에듀바이저스와
            <br />
            함께하실 분을 찾습니다.
          </h2>
          <p className="text-white text-[15px] mt-[29px] ">
            판매 실적이 아닌, 고객만족 중심의
            <br />
            파격적인 보상을 드립니다.
            <br />
            <br />
            오직 고객 만족에만 집중할 수 있는
            <br />
            업무 환경과 최고의 복리후생을 제공합니다.
          </p>
          <Link
            href="/recruit"
            className="bg-[#2B7FFF] text-white rounded-[12px] w-[300px] h-[50px] mt-[37px] font-semibold shadow-md transition text-center text-[20px] flex items-center justify-center"
          >
            채용중인 공고 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
