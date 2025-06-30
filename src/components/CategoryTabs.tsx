"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import "../app/main.css";

const nationalCertificates = [
  "/images/eduservice/Frame1.png",
  "/images/eduservice/Frame2.png",
  "/images/eduservice/Frame3.png",
  "/images/eduservice/Frame4.png",
];

const educationServices = [
  "/images/eduservice/Frame5.png",
  "/images/eduservice/Frame6.png",
  "/images/eduservice/Frame7.png",
];

const extraCompetitiveness = [
  "/images/eduservice/Frame8.png",
  "/images/eduservice/Frame9.png",
  "/images/eduservice/Frame10.png",
  "/images/eduservice/Frame11.png",
];

const SectionCards = ({
  title,
  images,
}: {
  title: string;
  images: string[];
}) => (
  <div className="mb-12">
    <h2 className="text-[32px] md:text-[40px] font-extrabold text-left leading-tight mb-8">
      {title}
    </h2>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 ">
      {images.map((img, idx) => (
        <Card
          key={img + idx}
          className="relative h-[265px] w-full sm:h-[260px] lg:h-[374px] p-0"
        >
          <img
            src={img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
            style={{
              objectPosition: "center center",
              borderRadius: "12px",
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
    <div className="w-full max-w-6xl mx-auto p-6 bg-background">
      <SectionCards title="국가자격증" images={nationalCertificates} />
      <div className="mb-12">
        <h2 className="text-[32px] md:text-[40px] font-extrabold text-left leading-tight mb-8 ">
          교육서비스
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 ">
          {educationServices.map((img, idx) => (
            <Card
              key={img + idx}
              className="relative h-[265px] w-[100%] sm:h-[320px] sm:w-[220px] md:h-[374px] md:w-[252px]"
            >
              <img
                src={img}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center z-0"
                style={{
                  objectPosition: "center center",
                  borderRadius: "12px",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </Card>
          ))}
        </div>
      </div>
      <SectionCards title="추가경쟁력" images={extraCompetitiveness} />
    </div>
  );
};

export default CategoryTabs;
