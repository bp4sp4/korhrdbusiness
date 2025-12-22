import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 어드민 인증 확인 함수 (서버 사이드)
export async function verifyAdmin(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 가져오기
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { isAdmin: false, error: "인증 토큰이 없습니다." };
    }

    const token = authHeader.replace("Bearer ", "");

    // Supabase 클라이언트 생성
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // 사용자 정보 가져오기
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { isAdmin: false, error: "인증에 실패했습니다." };
    }

    // 어드민 테이블에서 확인
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("email")
      .eq("email", user.email)
      .single();

    if (adminError || !admin) {
      return { isAdmin: false, error: "관리자 권한이 없습니다." };
    }

    return { isAdmin: true, user };
  } catch (error) {
    return {
      isAdmin: false,
      error: error instanceof Error ? error.message : "인증 오류가 발생했습니다.",
    };
  }
}

