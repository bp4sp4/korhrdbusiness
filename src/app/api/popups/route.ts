import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { verifyAdmin } from "@/lib/admin-auth";

// Supabase 클라이언트 생성 헬퍼 함수
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// 팝업 목록 조회 (공개)
export async function GET() {
  try {
    logger.log("팝업 API GET 요청 수신");
    
    // 환경 변수 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      logger.error("환경 변수가 설정되지 않음", {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      });
      return NextResponse.json(
        { 
          error: "서버 설정 오류가 발생했습니다.",
          popups: [] // 테이블이 없을 때를 대비해 빈 배열 반환
        },
        { 
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: popups, error } = await supabaseAdmin
      .from("popups")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("팝업 조회 오류:", error);
      // 테이블이 없을 때를 대비해 빈 배열 반환
      if (error.code === "PGRST116" || error.message?.includes("does not exist")) {
        logger.error("popups 테이블이 존재하지 않습니다. POPUP_USAGE.md의 SQL 스크립트를 실행하세요.");
        return NextResponse.json({ popups: [] });
      }
      return NextResponse.json(
        { 
          error: "팝업을 불러오는 중 오류가 발생했습니다.",
          details: error.message,
          popups: [] // 에러가 나도 빈 배열 반환하여 앱이 크래시되지 않도록
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ popups: popups || [] });
  } catch (error) {
    logger.error("팝업 조회 오류:", error);
    return NextResponse.json(
      { 
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
        popups: [] // 에러가 나도 빈 배열 반환
      },
      { status: 500 }
    );
  }
}

// 새 팝업 생성 (어드민 전용)
export async function POST(request: NextRequest) {
  try {
    // 어드민 인증 확인
    const authResult = await verifyAdmin(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      template_type,
      template_image,
      center_image,
      bottom_title,
      bottom_subtitle,
      link_url,
      is_active,
      display_order,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "팝업 이름은 필수입니다." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: popup, error } = await supabaseAdmin
      .from("popups")
      .insert([
        {
          name: name.trim(),
          description: description?.trim() || "",
          template_type: template_type || "default",
          template_image: template_image?.trim() || null,
          center_image: center_image?.trim() || null,
          bottom_title: bottom_title?.trim() || null,
          bottom_subtitle: bottom_subtitle?.trim() || null,
          link_url: link_url?.trim() || null,
          is_active: is_active !== false,
          display_order: display_order || 0,
        },
      ])
      .select()
      .single();

    if (error) {
      logger.error("팝업 생성 오류:", error);
      return NextResponse.json(
        { error: "팝업 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ popup }, { status: 201 });
  } catch (error) {
    logger.error("팝업 생성 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

