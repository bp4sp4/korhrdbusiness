"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Wrench, Home } from "lucide-react";

export default function MaintenancePage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 fixed inset-0 z-[9999] overflow-hidden">
      <div className="max-w-2xl w-full">
        {/* 메인 카드 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 text-center border border-white/20 shadow-2xl">
          {/* 아이콘 */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Wrench className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            점검 중입니다
          </h1>

          {/* 부제목 */}
          <h2 className="text-xl md:text-2xl text-blue-200 mb-8">
            더 나은 서비스를 위해 시스템을 점검하고 있습니다
          </h2>

          {/* 설명 */}
          <div className="text-gray-300 mb-8 space-y-4">
            <p className="text-lg font-medium">
              🔒 현재 시스템 점검으로 인해 모든 서비스가 일시 중단되었습니다.
            </p>
            <p className="text-base">
              홈페이지 접속이 완전히 차단된 상태입니다.
            </p>
            <p className="text-sm text-gray-400">
              점검 완료 후 정상 서비스를 재개할 예정입니다.
            </p>
            <p className="text-xs text-red-300 font-medium">
              ⚠️ 모든 페이지 접속이 제한됩니다.
            </p>
          </div>

          {/* 현재 시간 */}
          <div className="bg-white/10 rounded-2xl p-6 mb-8 border border-white/20">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-blue-300" />
              <span className="text-blue-300 font-medium">현재 시간</span>
            </div>
            <div className="text-2xl font-mono text-white">
              {isClient && currentTime ? formatTime(currentTime) : "로딩 중..."}
            </div>
          </div>

          {/* 점검 완료 안내 */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6 mb-8 border border-green-400/30">
            <div className="text-green-300 font-medium mb-2">
              점검 완료 안내
            </div>
            <div className="text-white text-lg">
              빠른 시간 내에 점검 완료하겠습니다
            </div>
          </div>

          {/* 새로고침 버튼 */}
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Home className="mr-2 h-4 w-4" />
            새로고침
          </Button>
        </div>
        {/* 하단 정보 */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>한평생 에듀바이저스</p>
          <p>© 2024 All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
