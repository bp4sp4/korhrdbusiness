"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import "../app/main.css";

interface CategoryItem {
  id: number;
  image?: string;
}

interface CategoryData {
  [key: string]: CategoryItem[];
}

const CategoryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("자격증");

  const categories = ["자격증", "커리어", "취업", "창업"];

  const categoryData: CategoryData = {
    자격증: [
      {
        id: 1,
        image: "/images/eduservice/Frame1.png",
      },
      {
        id: 2,
        image: "/images/eduservice/Frame3.png",
      },
      {
        id: 3,

        image: "/images/eduservice/Frame4.png",
      },
      {
        id: 4,

        image: "/images/eduservice/Frame2.png",
      },
    ],
    커리어: [
      {
        id: 5,

        image: "",
      },
      {
        id: 6,

        image: "",
      },
      {
        id: 7,

        image: "",
      },
      {
        id: 8,

        image: "",
      },
    ],
    취업: [
      {
        id: 9,

        image: "",
      },
      {
        id: 10,

        image: "",
      },
      {
        id: 11,

        image: "",
      },
      {
        id: 12,

        image: "",
      },
    ],
    창업: [
      {
        id: 13,

        image: "",
      },
      {
        id: 14,

        image: "",
      },
      {
        id: 15,

        image: "",
      },
      {
        id: 16,

        image: "",
      },
    ],
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-background">
      <div className="flex flex-col mb-15 ">
        <h2 className="text-[54px] font-extrabold flex items-center">
          <span>
            <img
              src="/images/eduservice/internet.png"
              width={66}
              height={30}
              alt=""
            />
          </span>
          교육서비스
        </h2>
        <p className="text-[36px] font-normal">교육으로 세상을 바꾸는 힘</p>
      </div>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 ">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`
              block px-6 py-3 rounded-full transition-all duration-200
              font-medium text-[17px] leading-[27px] tracking-[-0.5px] font-bold
              ${
                activeTab === category
                  ? "bg-[#000000] text-white  shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-blue-100 hover:text-white-100"
              }
            `}
            style={{
              fontWeight: "bold",
            }}
          >
            {category}
          </button>
        ))}
      </div>
      {/* Category Cards Grid */}
      <div className="flex flex-wrap gap-6 justify-center">
        {categoryData[activeTab]?.map((item) => (
          <Card
            key={item.id}
            className="
              relative  
              h-[374px] w-[282px] sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] w-full mx-auto 
            "
          >
            {item.image && item.image !== "" && (
              <img
                src={item.image}
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
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
