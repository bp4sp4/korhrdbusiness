"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import "../app/main.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const nationalCertificates = [
  {
    img: "/images/eduservice/national/national001.png",
    title: "신뢰받는 복지 전문가",
    desc: "공감과 실력을 갖춘 국가자격",
  },
  {
    img: "/images/eduservice/national/national002.png",
    title: "마음을 키우는 직업",
    desc: "순수함을 돌보는 전문직의 시작",
  },
  {
    img: "/images/eduservice/national/national003.jpg",
    title: "배움의 가치를 전하다",
    desc: "학습 설계부터 교육 운영까지",
  },
  {
    img: "/images/eduservice/national/national004.png",
    title: "한글로 세상을 만나다",
    desc: "세계가 주목하는 자격증",
  },
];

const educationServices = [
  {
    img: "/images/eduservice/edu/edu001.png",
    title: "실습 설외 서비스",
    desc: "전국 실습기관 섭외 가능해요",
  },
  {
    img: "/images/eduservice/edu/edu002.png",
    title: "취업 지원 서비스",
    desc: "걱정되는 취업준비 1:1 코칭",
  },
  {
    img: "/images/eduservice/edu/edu003.png",
    title: "취업 연계 서비스",
    desc: "자격증 최종 목표까지 연계",
  },
];

const extraCompetitiveness = [
  {
    img: "/images/eduservice/plus/plus001.png",
    title: "추가 경쟁력 1",
    desc: "설명 텍스트 1",
  },
  {
    img: "/images/eduservice/plus/plus002.png",
    title: "추가 경쟁력 2",
    desc: "설명 텍스트 2",
  },
  {
    img: "/images/eduservice/plus/plus003.png",
    title: "추가 경쟁력 3",
    desc: "설명 텍스트 3",
  },
  {
    img: "/images/eduservice/plus/plus001.png",
    title: "추가 경쟁력 4",
    desc: "설명 텍스트 4",
  },
];

// 학점은행제 12개
const creditBankSystem = [
  {
    img: "/images/eduservice/credit/eduservice.png",
    title: "학점은행제 1",
    desc: "학점은행제 설명 1",
  },
  {
    img: "/images/eduservice/credit/dream.png",
    title: "학점은행제 2",
    desc: "학점은행제 설명 2",
  },

  {
    img: "/images/eduservice/credit/haemeal.png",
    title: "학점은행제 4",
    desc: "학점은행제 설명 4",
  },
  {
    img: "/images/eduservice/credit/kstudy.png",
    title: "학점은행제 5",
    desc: "학점은행제 설명 5",
  },
  {
    img: "/images/eduservice/credit/allpass.png",
    title: "학점은행제 6",
    desc: "학점은행제 설명 6",
  },
  {
    img: "/images/eduservice/credit/line.png",
    title: "학점은행제 7",
    desc: "학점은행제 설명 7",
  },
  {
    img: "/images/eduservice/credit/ysu.png",
    title: "학점은행제 8",
    desc: "학점은행제 설명 8",
  },
  {
    img: "/images/eduservice/credit/ezen.png",
    title: "학점은행제 9",
    desc: "학점은행제 설명 9",
  },
  {
    img: "/images/eduservice/credit/seouledu.png",
    title: "학점은행제 10",
    desc: "학점은행제 설명 10",
  },
  {
    img: "/images/eduservice/credit/newm.png",
    title: "학점은행제 11",
    desc: "학점은행제 설명 11",
  },
  {
    img: "/images/eduservice/credit/psyedu.png",
    title: "학점은행제 12",
    desc: "학점은행제 설명 12",
  },
];

// 민간자격증 4개
const privateCertificates = [
  {
    img: "/images/eduservice/private/edutrain.png",
    title: "민간자격증 1",
    desc: "민간자격증 설명 1",
  },
  {
    img: "/images/eduservice/private/koreablack.png",
    title: "민간자격증 2",
    desc: "민간자격증 설명 2",
  },
  {
    img: "/images/eduservice/private/koreahuman.png",
    title: "민간자격증 3",
    desc: "민간자격증 설명 3",
  },
  {
    img: "/images/eduservice/private/koreanresource.png",
    title: "민간자격증 4",
    desc: "민간자격증 설명 4",
  },
];

// 유학 1개
const studyAbroad = [
  {
    img: "/images/eduservice/abroad/mk.png",
    title: "유학 프로그램",
    desc: "해외 유학 프로그램 설명",
  },
];

const SectionCards = ({
  cards,
  swipeOnMobile = false,
  cardWidth = 274,
  cardHeight = 314,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 mb-[71px] lg:grid-cols-4 gap-29 service__card text-left px-2 md:px-6",
  centerSingleCard = false,
  useFlex = false,
  showBorder = true,
  removeBorderRadius = false,
}: {
  cards: { img: string }[];
  swipeOnMobile?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  gridClassName?: string;
  centerSingleCard?: boolean;
  useFlex?: boolean;
  showBorder?: boolean;
  removeBorderRadius?: boolean;
}) => {
  const [hydrated, setHydrated] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
    if (typeof window !== "undefined") {
      const check = () => setIsMobile(window.innerWidth < 768);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }
  }, []);

  if (!hydrated) return null;

  // educationServices 카드인지 판별
  const isEducationServices = cards === educationServices;

  if (swipeOnMobile && isMobile) {
    return (
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        centeredSlides={true}
        loop={true}
        className="w-full px-2"
        style={{ paddingLeft: 0, paddingRight: 0, marginBottom: "30px" }}
      >
        {cards.map((card, idx) => (
          <SwiperSlide
            key={card.img + idx}
            style={{ width: cardWidth, maxWidth: cardWidth }}
            className={`!w-[${cardWidth}px] md:!w-[${cardWidth}px]`}
          >
            <div className="flex justify-center">
              <Card
                className="relative flex flex-col justify-end overflow-hidden"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  border: showBorder ? "1px solid #97979742" : "none",
                  borderRadius: removeBorderRadius ? "0px" : "16px",
                }}
              >
                <img
                  src={card.img}
                  alt=""
                  className="w-full h-full object-cover object-center"
                  style={{
                    borderTopLeftRadius: removeBorderRadius ? "0px" : "16px",
                    borderTopRightRadius: removeBorderRadius ? "0px" : "16px",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </Card>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  if (useFlex) {
    return (
      <div className="flex justify-center items-center mt-[47px] mb-[150px] md:mb-[0px] px-6">
        {cards.map((card, idx) => (
          <Card
            className="relative flex flex-col justify-end overflow-hidden"
            key={card.img + idx}
            style={{
              width: cardWidth,
              height: cardHeight,
              border: showBorder ? "1px solid #97979742" : "none",
              borderRadius: removeBorderRadius ? "0px" : "16px",
            }}
          >
            <img
              src={card.img}
              alt=""
              className="w-full h-full object-cover object-center"
              style={{
                borderTopLeftRadius: removeBorderRadius ? "0px" : "16px",
                borderTopRightRadius: removeBorderRadius ? "0px" : "16px",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {cards.map((card, idx) => (
        <Card
          className={
            isEducationServices
              ? "relative flex flex-col justify-end overflow-hidden w-[300px] h-[320px] md:w-[348px] md:h-[384px] mx-auto"
              : centerSingleCard && cards.length === 1
              ? "relative flex flex-col justify-end overflow-hidden  mx-auto col-start-2"
              : `relative flex flex-col justify-end overflow-hidden w-[${cardWidth}px] h-[${cardHeight}px]`
          }
          key={card.img + idx}
          style={{
            border: showBorder ? "1px solid #97979742" : "none",
            borderRadius: removeBorderRadius ? "0px" : "16px",
          }}
        >
          <img
            src={card.img}
            alt=""
            className="w-full h-full object-cover object-center"
            style={{
              borderTopLeftRadius: removeBorderRadius ? "0px" : "16px",
              borderTopRightRadius: removeBorderRadius ? "0px" : "16px",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </Card>
      ))}
    </div>
  );
};

const CategoryTabs: React.FC = () => {
  return (
    <div className="w-full bg-[linear-gradient(to_top,rgba(217,217,217,0.2),rgba(216,246,255,0.2))]">
      <div className="flex flex-col max-w-6xl mx-auto">
        {/* 업무제휴사 섹션 */}
        <div className="mt-[50px] mb-[50px]">
          <h2 className="text-[24px] md:text-[32px] md:text-[40px] text-[#1E1E1E] font-extrabold text-center leading-tight mb-[35px] px-6 flex flex-col items-center">
            업무제휴사
            <span className="text-[16px] md:text-[20px] mt-[8px] text-[#979797] font-normal">
              신뢰할 수 있는 업무 제휴 파트너
            </span>
          </h2>
          <SectionCards
            cards={creditBankSystem}
            swipeOnMobile={true}
            cardWidth={274}
            cardHeight={314}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-items-center mt-[37px]  gap-10 px-6"
            showBorder={true}
            removeBorderRadius={true}
          />
        </div>

        {/* 민간자격증 섹션 */}
        <div className="mt-[50px] mb-[50px]">
          <SectionCards
            cards={privateCertificates}
            swipeOnMobile={true}
            cardWidth={274}
            cardHeight={314}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-items-center mt-[37px] gap-10 px-6"
            showBorder={true}
            removeBorderRadius={true}
          />
        </div>

        {/* 유학 섹션 */}
        <div className="mt-[50px] mb-[50px]">
          <SectionCards
            cards={studyAbroad}
            swipeOnMobile={true}
            cardWidth={274}
            cardHeight={314}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-items-center mt-[47px] mb-[50px] gap-10 px-6"
            showBorder={true}
            removeBorderRadius={true}
          />
        </div>

        {/* 국가 자격증 섹션 */}
        <h2 className="text-[24px] md:text-[32px] md:text-[40px] text-[#1E1E1E] font-extrabold text-center leading-tight mb-[35px] px-6 flex flex-col items-center">
          국가 자격증
          <span className="text-[16px] md:text-[20px] mt-[8px] text-[#979797] font-normal">
            공감과 실력을 갖춘 국가자격
          </span>
        </h2>
        <SectionCards
          cards={nationalCertificates}
          swipeOnMobile={true}
          cardWidth={274}
          cardHeight={314}
          gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-items-center mt-[47px] mb-[100px] md:mb-[120px] gap-10 px-6"
          showBorder={false}
        />

        {/* 추가자격증 섹션 */}
        <h2 className="text-[24px] md:text-[32px] md:text-[40px] text-[#1E1E1E] font-extrabold text-center leading-tight mt-[82px] md:mt-[0px] mb-[35px] md:mb-[47px] px-6 flex flex-col items-center">
          추가자격증
          <span className="text-[16px] md:text-[20px] mt-[8px] text-[#979797] font-normal">
            다양한 실력을 갖춘 추가경쟁력
          </span>
        </h2>
        <SectionCards
          cards={extraCompetitiveness}
          swipeOnMobile={true}
          cardWidth={274}
          cardHeight={314}
          gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-items-center mt-[47px] mb-[150px] md:mb-[120px] gap-10 px-6"
          showBorder={false}
        />

        {/* 교육서비스 섹션 */}
        <h2 className="text-[24px] md:text-[32px] md:text-[40px] text-[#1E1E1E] font-extrabold text-center leading-tight mb-4 px-6 mt-[76px] md:mt-[0px] flex flex-col items-center">
          교육서비스
          <span className="text-[16px] md:text-[20px] mt-[8px] text-[#979797] font-normal">
            한평생 에듀바이저스만의 교육 여정
          </span>
        </h2>
        <SectionCards
          cards={educationServices}
          cardWidth={348}
          cardHeight={384}
          gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center mt-[47px] mb-[150px] md:mb-[120px] gap-10 px-6"
          showBorder={false}
        />
      </div>
    </div>
  );
};

export default CategoryTabs;
