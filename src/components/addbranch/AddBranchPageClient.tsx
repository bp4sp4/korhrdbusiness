"use client";

import "@/app/main.css";
import { motion, Easing } from "framer-motion";
import Link from "next/link";

export default function AddBranchPageClient() {
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


  return (
    <main className="main w-full min-h-screen flex flex-col items-center bg-white overflow-x-hidden">
      {/* Desktop Hero Section */}
      <section
        className="main__hero hidden md:flex w-full h-full items-center justify-center relative"
        style={{
          width: "100%",
          height: "75vh",
          left: 0,
          right: 0,
          backgroundImage: "url('/images/addbranch/addbranch_main.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="main__hero-content flex-1 flex flex-col items-start z-10 rounded-lg md:bg-transparent md:p-0 px-10">
          <div className="main__hero-title text-white text-xl md:text-7xl mb-6 flex flex-col gap-3">
            <motion.p
              className="text-white text-2xl md:text-4xl font-normal"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              개인이 아닌
            </motion.p>
            <motion.h2
              className="text-white text-4xl md:text-5xl font-bold"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              지점으로 성장하는 교육파트너
            </motion.h2>
          </div>
          <div className="main__hero-buttons flex">
            <Link href="#contact" className="main__hero-btn">
              지점 모집 문의
            </Link>
          </div>
        </div>
      </section>
      {/* Mobile Hero Section */}
      <section
        className="main__hero flex md:hidden w-full h-full items-center justify-center relative"
        style={{
          width: "100%",
          height: "75vh",
          left: 0,
          right: 0,
          backgroundImage: "url('/images/addbranch/addbranch_main.png')",
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
                개인이 아닌
              </motion.p>
              <motion.h2
                className="text-white text-4xl font-bold"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                지점으로 성장하는 교육파트너
              </motion.h2>
            </div>
            <div className="main__hero-buttons flex">
              <Link href="#contact" className="main__hero-btn text-base px-4 py-2 ">
                지점 모집 문의
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section
        className="main__hero-btn-wrap w-full h-[190px] flex items-center justify-center "
        style={{
          backgroundColor: "#040D33",
        }}
      >
        <div className="flex items-center flex-col justify-center w-full ">
          <div className="relative flex items-center justify-center gap-2">
           
            <span className="text-white text-[14px] md:text-2xl font-bold">
              한평생 에듀바이저스와 함께할 지점을 모십니다.
            </span>
          </div>
        </div>
      </section>

      {/* 섹션 1: 교육은 본사가 준비했어요 */}
      <section className="w-full bg-white py-16 md:py-[150px] flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-[346px]">
            <div className="flex-1">
              <h2 className="text-[28px] md:text-[48px] font-bold mb-4">
                <span className="text-[#525F96] text-[20px] md:text-[60px] font-normal">교육은</span>
                <br />
                <span className="text-[#040D33] md:text-[60px] extra-bold">본사가</span>
                <br />
                <span className="text-[#525F96] text-[20px] md:text-[60px] font-normal">준비했어요</span>
              </h2>
            </div>
            <div>
              <img
                src="/images/addbranch/addbranch_01.png"
                alt="교육 준비"
                width={390}
                height={300}
                className="w-[390px] h-[300px] rounded-[20px] object-cover"
                style={{ width: '390px', height: '300px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 2: 지점은 운영에만 집중하세요 */}
      <section 
        className="w-full py-16 md:py-[150px]"
        style={{
          backgroundColor: "#040D33",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-center">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-[346px]">
            <div className="flex-1">
              <h2 className="text-[28px] md:text-[48px] font-bold mb-4 text-white">
                <span className="text-[#A3AEDE] text-[20px] md:text-[60px] font-normal">지점은</span>
                <br />
                <span className="text-white md:text-[60px] extra-bold">운영에만</span>
                <br />
                <span className="text-[#A3AEDE] text-[20px] md:text-[60px] font-normal"><span className="text-[#FFFFFF] md:text-[60px] font-extrabold">집중</span>하세요</span>
              </h2>
            </div>
            <div>
              <img
                src="/images/addbranch/addbranch_02.png"
                alt="운영 집중"
                width={390}
                height={300}
                className="w-[390px] h-[300px] object-cover"
                style={{ width: '390px', height: '300px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 3: 혼자가 아닌 구조로 오래가요 */}
      <section className="w-full bg-white py-16 md:py-[150px] flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-[346px]">
            <div className="flex-1">
              <h2 className="text-[28px] md:text-[48px] font-bold mb-4">
                <span className="text-[#040D33] text-[20px] md:text-[60px] extra-bold">혼자가 아닌</span>
                <br />
                <span className="text-[#525F96] md:text-[60px] font-normal">구조로</span>
                <br />
                <span className="text-[#525F96] text-[20px] md:text-[60px] font-normal">오래가요</span>
              </h2>
            </div>
            <div>
              <img
                src="/images/addbranch/addbranch_03.png"
                alt="구조로 오래가요"
                width={390}
                height={300}
                className="w-[390px] h-[300px] object-cover"
                style={{ width: '390px', height: '300px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 문의 섹션 */}
      <section id="contact" className="main__recruit w-full flex-col md:flex-row items-stretch h-auto md:h-[400px] hidden md:flex">
        <div
          className="flex-1 h-[300px] md:h-full flex flex-col justify-center bg-[#aeb2a3]"
          style={{
            backgroundImage: "url('/images/addbranch/addbranch-footer.png')",
            backgroundSize: "cover",
          }}
        >
          <div className="w-[1080px] mx-auto flex text-left">
            <div className="w-full relative">
              <h2 className="text-[40px] font-semibold mb-4 text-white">
                에듀바이저스와 함께<br/>
                성장하실 지점을 모십니다.
              </h2>
              <p className="text-white text-[16px] mb-8">
              지점 설립 후 성장계획에 맞추어 에듀바이저스만의 관리 체계를 제공합니다.
                <br />
                평생교육의 미래를 꿈꾸는 에듀바이저스의 비전에 공감하시는 지점을 찾습니다.
              </p>
            </div>
            <div className="w-[1000px] mx-auto relative">
              <div className="absolute left-[49px] bottom-[35px] ">
                <Link
                  className="bg-[#2B7FFF] text-white w-[373px] h-[86px] flex items-center justify-center rounded-[20px] text-[20px] font-semibold hover:bg-blue-700 transition text-center"
                  href="/about"
                >
                  지점 모집 문의하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모바일 문의 섹션 */}
      <section id="contact" className="block md:hidden w-full h-[100vh] relative ">
        <img
          src="/images/main/main__banner002__mobile.png"
          alt="지점 모집 모바일"
          className="w-full h-full object-cover"
        />

        <div className="absolute mt-10 inset-0 flex flex-col max-w-[300px] mx-auto">
          <h2 className="text-[30px] font-bold mb-3 text-white ">
            지점 모집 문의
          </h2>
          <p className="text-white text-[15px] mt-[29px] ">
            한평생 에듀바이저스와 함께 성장할
            <br />
            파트너를 찾고 있습니다.
            <br />
            <br />
            체계적인 교육 시스템과 마케팅 지원으로
            <br />
            안정적인 지점 운영이 가능합니다.
          </p>
          <Link
            href="/about"
            className="bg-white text-[#040D33] rounded-[12px] w-[300px] h-[50px] mt-[37px] font-semibold shadow-md transition text-center text-[20px] flex items-center justify-center"
          >
            지점 상담 신청
          </Link>
        </div>
      </section>
    </main>
  );
}

