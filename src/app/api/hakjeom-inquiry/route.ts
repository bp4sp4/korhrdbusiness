import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 학점은행제 사업부 문의 DB (KorhrdGroupDB - 별도 Supabase 프로젝트)
// 교육상담 신청 내용을 hakjeom_consultations 테이블로 전송한다.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contact, education, hope_course, click_source } = body;

    if (!name || !contact) {
      return NextResponse.json(
        { success: false, error: "이름과 연락처는 필수입니다." },
        { status: 400 }
      );
    }

    const url = process.env.KORHRD_GROUP_SUPABASE_URL;
    const serviceKey = process.env.KORHRD_GROUP_SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      console.error("❌ KorhrdGroupDB Supabase 환경변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { success: false, error: "KorhrdGroupDB configuration missing" },
        { status: 500 }
      );
    }

    // service role 클라이언트 (RLS 우회, 서버 전용)
    const groupSupabase = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await groupSupabase
      .from("hakjeom_consultations")
      .insert([
        {
          name,
          contact,
          education: education || null,
          hope_course: hope_course || null,
          // 유입경로 → 대분류: 에듀바이저스 / 중분류: 상담폼 ("대분류_중분류" 형식)
          click_source: click_source || "에듀바이저스_상담폼",
          status: "상담대기",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ hakjeom_consultations insert 실패:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log("✅ 학점은행제 사업부 문의 DB 등록 완료:", data?.id);
    return NextResponse.json({ success: true, id: data?.id }, { status: 201 });
  } catch (error) {
    console.error("❌ hakjeom-inquiry 처리 중 오류:", error);
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
