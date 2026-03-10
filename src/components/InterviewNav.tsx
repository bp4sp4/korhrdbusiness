"use client";

import Link from "next/link";
import { interviews } from "@/app/recruit/interview/interviewList";

type NavItem = { name: string; title: string } | null;

export default function InterviewNav({
  prev,
  next,
}: {
  prev: NavItem;
  next: NavItem;
}) {
  return (
    <>

      <hr className="border-[#97979780] my-10" />
      <div className="text-[#1E1E1E] font-bold font-family-pretendard text-[26px] mb-2 relative after:content-[''] after:absolute after:w-[60px] after:h-1 after:bg-[#2B7FFF] after:bottom-[-10px] after:left-0">
        {!prev ? "다음 이야기" : !next ? "마지막 이야기" : "다른 이야기"}
      </div>
      <div className="flex justify-between mt-8  gap-4">
        {/* 이전글 */}
        {prev ? (
          (() => {
            const prevData = interviews.find((item) => item.name === prev.name);
            return (
              <Link
                href={`/recruit/interview/${prev.name}`}
                className="flex-1 group"
              >
                <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col items-start">
                  <div className="relative w-full aspect-square bg-gray-100">
                    <img
                      src={prevData?.image}
                      alt={prev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/20 flex flex-col items-start justify-end p-4">
                      <div className="text-white text-xs mb-1">
                        {prev ? "이전 인터뷰" : "다음 이야기"}
                      </div>
                      <div className="text-white font-bold text-lg">
                        {prev.title}
                      </div>
                      {prevData?.subtitle && (
                        <div className="text-white text-xs mt-1">
                          {prevData.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })()
        ) : (
          <div className="flex-1" />
        )}
        {/* 다음글 */}
        {next ? (
          (() => {
            const nextData = interviews.find((item) => item.name === next.name);
            return (
              <Link
                href={`/recruit/interview/${next.name}`}
                className="flex-1 group text-right"
              >
                <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col items-end">
                  <div className="relative w-full aspect-square bg-gray-100">
                    <img
                      src={nextData?.image}
                      alt={next.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/20 flex flex-col items-end justify-end p-4">
                      <div className="text-white text-xs mb-1">다음 인터뷰</div>
                      <div className="text-white font-bold text-lg">
                        {next.title}
                      </div>
                      {nextData?.subtitle && (
                        <div className="text-white text-xs mt-1">
                          {nextData.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })()
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </>
  );
}
