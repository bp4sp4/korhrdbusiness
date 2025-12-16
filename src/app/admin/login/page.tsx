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

    // 이메일로 관리자 정보 가져오기
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (adminError || !admin) {
      alert("등록되지 않은 관리자입니다.");
      return;
    }

    // 비밀번호는 Supabase Auth를 통해 로그인 시도
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("로그인 실패: " + error.message);
      return;
    }

    router.push("/");
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
