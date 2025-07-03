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
    img: "/images/eduservice/national/national003.png",
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
    img: "/images/eduservice/Frame5.png",
    title: "실습 설외 서비스",
    desc: "전국 실습기관 섭외 가능해요",
  },
  {
    img: "/images/eduservice/Frame6.png",
    title: "취업 지원 서비스",
    desc: "걱정되는 취업준비 1:1 코칭",
  },
  {
    img: "/images/eduservice/Frame7.png",
    title: "취업 연계 서비스",
    desc: "자격증 최종 목표까지 연계",
  },
];

const extraCompetitiveness = [
  {
    img: "/images/eduservice/Frame8.png",
    title: "추가 경쟁력 1",
    desc: "설명 텍스트 1",
  },
  {
    img: "/images/eduservice/Frame9.png",
    title: "추가 경쟁력 2",
    desc: "설명 텍스트 2",
  },
  {
    img: "/images/eduservice/Frame10.png",
    title: "추가 경쟁력 3",
    desc: "설명 텍스트 3",
  },
  {
    img: "/images/eduservice/Frame11.png",
    title: "추가 경쟁력 4",
    desc: "설명 텍스트 4",
  },
];

const SectionCards = ({
  cards,
  swipeOnMobile = false,
  cardWidth = 274,
  cardHeight = 314,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 mb-[148px] lg:grid-cols-4 gap-29 service__card text-left px-2 md:px-6",
}: {
  cards: { img: string }[];
  swipeOnMobile?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  gridClassName?: string;
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

  if (swipeOnMobile && isMobile) {
    return (
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        centeredSlides={true}
        loop={true}
        className="w-full px-2"
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        {cards.map((card, idx) => (
          <SwiperSlide
            key={card.img + idx}
            style={{ width: cardWidth, maxWidth: cardWidth }}
            className={`!w-[${cardWidth}px] md:!w-[${cardWidth}px]`}
          >
            <div className="flex justify-center">
              <Card
                className="relative flex flex-col justify-end overflow-hidden rounded-2xl"
                style={{ width: cardWidth, height: cardHeight }}
              >
                <img
                  src={card.img}
                  alt=""
                  className="w-full h-full object-cover object-center"
                  style={{
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
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

  return (
    <div className={gridClassName}>
      {cards.map((card, idx) => (
        <Card
          className="relative flex flex-col justify-end overflow-hidden rounded-2xl"
          style={{ width: cardWidth, height: cardHeight }}
          key={card.img + idx}
        >
          <img
            src={card.img}
            alt=""
            className="w-full h-full object-cover object-center"
            style={{
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
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
    <>
      <div className="w-full bg-[linear-gradient(to_top,rgba(217,217,217,0.2),rgba(216,246,255,0.2))]">
        <div className="flex flex-col max-w-6xl mx-auto">
          <h2 className="text-[24px] md:text-[32px] md:text-[40px] mt-[83px] text-[#1E1E1E] font-extrabold text-center leading-tight mb-[47px] px-6 flex flex-col items-center">
            국가 자격증
            <span className="text-[16px] md:text-[20px] mt-[8px] text-[#979797] font-normal">
              공감과 실력을 갖춘 국가자격
            </span>
          </h2>

          <SectionCards cards={nationalCertificates} swipeOnMobile={true} />

          <h2 className="text-[24px] md:text-[32px] md:text-[40px] text-[#1E1E1E] font-extrabold text-center leading-tight mt-[82px] mb-[47px] md:mb-[47px] px-6 flex flex-col items-center">
            추가경쟁력
            <span className="text-[16px] md:text-[20px] mt-[8px] text-[#979797] font-normal">
              다양한 실력을 갖춘 추가경쟁력
            </span>
          </h2>

          <SectionCards cards={extraCompetitiveness} swipeOnMobile={true} />
        </div>
      </div>
      {/* 교육서비스는 배경색 없이 */}
      <div className=" w-full margin-0">
        <div className="flex flex-col max-w-6xl mx-auto">
          <h2 className="text-[24px] md:text-[32px] md:text-[40px] text-[#1E1E1E] font-extrabold text-center leading-tight mb-8 px-6 mt-[176px] flex flex-col items-center">
            교육서비스
            <span className="text-[16px] md:text-[20px] mt-[8px] text-[#979797] font-normal">
              한평생 에듀바이저만의 교육 여정
            </span>
          </h2>
          <SectionCards
            cards={educationServices}
            cardWidth={368}
            cardHeight={384}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center mt-[47px] mb-[158px] gap-10 md:gap-30 gap-10 service__card text-left px-2 md:px-6"
          />
        </div>
      </div>
    </>
  );
};

export default CategoryTabs;
