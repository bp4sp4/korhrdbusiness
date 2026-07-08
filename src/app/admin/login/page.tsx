"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);
  const [role] = useState<string | null>(null);
  const [roleLoading] = useState(true);
  const [, setShowHistory] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    // 1. Supabase Auth 로그인 (자격 증명 검증)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      alert("로그인 실패: " + signInError.message);
      return;
    }

    // 2. 인증된 본인 계정이 관리자 목록에 있는지 확인
    //    (admins 테이블은 본인 행만 조회 가능하도록 RLS로 보호됨)
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (adminError || !admin) {
      await supabase.auth.signOut();
      alert("등록되지 않은 관리자입니다.");
      return;
    }

    router.push("/admin/partner-inquiries");
  };

  useEffect(() => {
    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="space-y-4 w-80">
        <h1 className="text-2xl font-bold mb-4">관리자 로그인</h1>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-2">
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            로그인
          </Button>
          {/* 히스토리 버튼: super만 노출, roleLoading 중엔 렌더링 X */}
          {!roleLoading && role === "super" && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowHistory(true)}
            >
              <History className="w-4 h-4" />
              히스토리 보기
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
