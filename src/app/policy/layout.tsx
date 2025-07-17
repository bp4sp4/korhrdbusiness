"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/policy/terms", label: "서비스 이용약관" },

  { href: "/policy/privacy", label: "개인정보 처리방침" },
];

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // 현재 경로에 맞는 탭의 label을 찾음
  const currentTab = tabs.find((tab) => tab.href === pathname);
  const title = currentTab ? currentTab.label : "정책 및 약관";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10">{title}</h1>
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
          <main className="w-full bg-white p-8 rounded-lg shadow-md">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
