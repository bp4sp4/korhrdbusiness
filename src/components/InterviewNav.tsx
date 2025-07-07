"use client";

import Link from "next/link";

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
      <div className="fixed bottom-8 right-8 z-50 sm:bottom-8 sm:right-8 bottom-4 right-4">
        <img
          src="/images/upbtn.png"
          alt="upbtn"
          aria-label="맨 위로 이동"
          className="w-10 h-10 cursor-pointer sm:w-10 sm:h-10 w-8 h-8"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        />
      </div>
      <hr className="border-[#97979780] my-10" />
      <div className="text-[#1E1E1E] font-bold font-family-pretendard text-[26px] mb-2 relative after:content-[''] after:absolute after:w-[60px] after:h-1 after:bg-[#2B7FFF] after:bottom-[-10px] after:left-0">
        다른 이야기
      </div>
      <div className="flex justify-between mt-8  gap-4">
        {/* 이전글 */}
        {prev ? (
          <Link
            href={`/recruit/interview/${prev.name}`}
            className="flex-1 group"
          >
            <div className="bg-[#F5F5F5] rounded-xl p-6 flex items-center gap-3 hover:bg-gray-100 transition">
              <svg
                className="w-4 h-4 text-[#2B7FFF]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="text-xs text-gray-500 mb-1">이전 인터뷰</div>
                <div className="font-bold">{prev.title}</div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {/* 다음글 */}
        {next ? (
          <Link
            href={`/recruit/interview/${next.name}`}
            className="flex-1 group text-right"
          >
            <div className="bg-[#F5F5F5] rounded-xl p-6 flex items-center justify-end gap-3 hover:bg-gray-200 transition">
              <div>
                <div className="text-xs text-gray-500 mb-1">다음 인터뷰</div>
                <div className="font-bold">{next.title}</div>
              </div>
              <svg
                className="w-4 h-4 text-[#2B7FFF]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </>
  );
}
