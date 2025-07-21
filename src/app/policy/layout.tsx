"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = [
  { href: "/policy/terms", label: "서비스 이용약관" },
  { href: "/policy/privacy", label: "개인정보 처리방침" },
];

// 예시: 시행일 목록
const effectiveDates = [{ label: "2024.07.01", value: "2024-07-11" }];

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentTab = tabs.find((tab) => tab.href === pathname);
  const title = currentTab ? currentTab.label : "정책 및 약관";

  // 선택된 시행일 상태
  const [selectedDate, setSelectedDate] = useState(effectiveDates[0].value);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">{title}</h1>
          <div className="flex items-center gap-4 py-2 rounded-lg">
            <span className="text-l text-gray-800 font-normal">시행일</span>
            <select
              className="border rounded-lg px-4 py-2 text-l min-w-[200px] font-semibold shadow-sm focus:ring-2 focus:ring-blue-300 transition-all"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {effectiveDates.map((date) => (
                <option key={date.value} value={date.value}>
                  {date.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* 상단 탭 네비게이션 */}
        <nav className="flex border-b border-gray-200 mb-10">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "px-6 py-3 text-base font-medium transition-colors relative",
                  isActive
                    ? "text-[#2b7fff]"
                    : "text-gray-500 hover:text-[#1459c5]"
                )}
                style={{ minWidth: 0 }}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="w-full bg-white p-8 rounded-lg">{children}</main>
        </div>
      </div>
    </div>
  );
}
