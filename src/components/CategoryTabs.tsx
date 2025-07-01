"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import "../app/main.css";

const nationalCertificates = [
  {
    img: "/images/eduservice/Frame1.png",
    title: "신뢰받는 복지 전문가",
    desc: "공감과 실력을 갖춘 국가자격",
  },
  {
    img: "/images/eduservice/Frame_2.png",
    title: "마음을 키우는 직업",
    desc: "순수함을 돌보는 전문직의 시작",
  },
  {
    img: "/images/eduservice/Frame3.png",
    title: "배움의 가치를 전하다",
    desc: "학습 설계부터 교육 운영까지",
  },
  {
    img: "/images/eduservice/Frame4.png",
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

const SectionCards = ({ cards }: { cards: { img: string }[] }) => (
  <div className="mb-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-29 lg:grid-cols-4 gap-8 service__card text-left px-2 md:px-6">
      {cards.map((card, idx) => (
        <Card
          className="relative h-[314px] w-[274px] flex flex-col justify-end overflow-hidden rounded-2xl shadow-lg"
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
  </div>
);

const CategoryTabs: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto  p-6 bg-background">
      <SectionCards cards={nationalCertificates} />
      <div className="mb-12">
        <SectionCards cards={educationServices} />
      </div>
      <SectionCards cards={extraCompetitiveness} />
    </div>
  );
};

export default CategoryTabs;
