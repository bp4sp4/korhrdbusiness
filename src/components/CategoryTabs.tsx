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
  "/images/eduservice/Frame1.png",
  "/images/eduservice/Frame2.png",
  "/images/eduservice/Frame3.png",
];

const extraCompetitiveness = [
  "/images/eduservice/Frame4.png",
  "/images/eduservice/Frame3.png",
  "/images/eduservice/Frame2.png",
  "/images/eduservice/Frame1.png",
];

const SectionCards = ({
  title,
  images,
}: {
  title: string;
  images: string[];
}) => (
  <div className="mb-12">
    <h2 className="text-[32px] md:text-[40px] font-extrabold text-left leading-tight mb-6">
      {title}
    </h2>
    <div className="flex flex-wrap gap-6 justify-start">
      {images.map((img, idx) => (
        <Card
          key={img + idx}
          className="relative h-[374px] w-[282px] sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)]"
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
        <h2 className="text-[32px] md:text-[40px] font-extrabold text-left leading-tight mb-6 ">
          교육서비스
        </h2>
        <div className="flex flex-row gap-6 justify-start">
          {educationServices.map((img, idx) => (
            <Card
              key={img + idx}
              className="relative h-[374px] w-[282px] sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)]"
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
