"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      // 에러 메시지 한글로 변환
      if (error.message === "Invalid login credentials") {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setError(error.message); // 기타 에러는 원문 노출
      }
      return;
    }
    // 관리자 이메일만 허용 (예시)
    if (email !== "korhrd@guidance.com") {
      setError("관리자만 접근할 수 있습니다.");
      await supabase.auth.signOut();
      return;
    }
    router.push("/"); // 로그인 후 이동

    // 30분 후 자동 로그아웃 타이머 설정
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(async () => {
      await supabase.auth.signOut();
      alert("30분이 지나 자동 로그아웃 되었습니다.");
      router.push("/admin/login");
    }, 30 * 60 * 1000); // 30분

    // 로그인 후, 관리자 권한 체크
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user?.email); // 실제 로그인된 이메일 확인
    const { data: admins } = await supabase
      .from("admins")
      .select("email")
      .eq("email", user?.email);
    console.log(admins); // 배열이어야 하고, length > 0 이어야 함

    const isAdmin = admins && admins.length > 0;
    if (isAdmin) {
      // 관리자 권한 있음
    } else {
      // 관리자 아님 (작성/수정/삭제 버튼 숨기기 등)
    }
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
