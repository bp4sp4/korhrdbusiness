"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import "../app/main.css";

interface CategoryItem {
  id: number;
  title: string;
  image?: string;
  subTitle: string;
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
        title: "국가자격증\n사회복지사 2급",
        subTitle: "자격증 정보를 즐겨보세요",
        image: "",
      },
      {
        id: 2,
        title: "커리어",
        subTitle: "커리어 정보를 즐겨보세요",
        image: "",
      },
      {
        id: 3,
        title: "취업",
        subTitle: "취업 정보를 즐겨보세요",
        image: "",
      },
      {
        id: 4,
        title: "창업",
        subTitle: "창업 정보를 즐겨보세요",
        image: "",
      },
    ],
    커리어: [
      {
        id: 5,
        title: "커리어",
        subTitle: "커리어 정보를 즐겨보세요",
        image: "",
      },
      {
        id: 6,
        title: "커리어",
        subTitle: "커리어 정보를 즐겨보세요",
        image: "",
      },
      {
        id: 7,
        title: "취업",
        subTitle: "취업 정보를 즐겨보세요",
        image: "",
      },
      {
        id: 8,
        title: "창업",
        subTitle: "창업 정보를 즐겨보세요",
        image: "",
      },
    ],
    취업: [
      {
        id: 9,
        title: "취업",
        subTitle: "취업 정보를 즐겨보세요",
        image: "",
      },
      {
        id: 10,
        title: "취업",
        subTitle: "취업 정보를 즐겨보세요",
        image: "",
      },
      {
        id: 11,
        title: "취업",
        subTitle: "취업 정보를 즐겨보세요",
        image: "",
      },
      {
        id: 12,
        title: "창업",
        subTitle: "창업 정보를 즐겨보세요",
        image: "",
      },
    ],
    창업: [
      {
        id: 13,
        title: "창업",
        subTitle: "창업 정보를 즐겨보세요",
        image: "",
      },
      {
        id: 14,
        title: "창업",
        subTitle: "창업 정보를 즐겨보세요",
        image: "",
      },
      {
        id: 15,
        title: "창업",
        subTitle: "창업 정보를 즐겨보세요",
        image: "",
      },
      {
        id: 16,
        title: "창업",
        subTitle: "창업 정보를 즐겨보세요",
        image: "",
      },
    ],
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-background">
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
                  : "bg-muted text-muted-foreground hover:bg-blue-100 hover:text-blue-600"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
        {categoryData[activeTab]?.map((item) => (
          <Card
            key={item.id}
            className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group border-0 h-[320px] max-w-[300px] w-full mx-auto  "
            style={{
              background: item.image
                ? `url(${item.image}) center/cover no-repeat`
                : "linear-gradient(to bottom, #3b82f6, #ffffff)",
            }}
          >
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
            {/* 텍스트 오버레이 */}
            <div className="absolute top-0 left-0 w-full p-6 z-20">
              <h3 className="text-white font-extrabold text-2xl mb-2 drop-shadow-lg whitespace-pre-line">
                {item.title}
              </h3>
              <p className="text-white text-base font-medium drop-shadow">
                {item.subTitle}
              </p>
            </div>
            {/* 이미지가 없을 때 대체 */}
            {!item.image && (
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <span className="text-white/70 text-xl font-bold">
                  {item.title}
                </span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
