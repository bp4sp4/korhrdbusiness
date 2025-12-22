import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

// 서비스 역할을 사용하는 Supabase 클라이언트
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// 팝업 목록 조회
export async function GET() {
  try {
    const { data: popups, error } = await supabaseAdmin
      .from("popups")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("팝업 조회 오류:", error);
      return NextResponse.json(
        { error: "팝업을 불러오는 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ popups });
  } catch (error) {
    logger.error("팝업 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 새 팝업 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, template_type, template_image, center_image, bottom_title, bottom_subtitle, is_active, display_order } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "팝업 이름은 필수입니다." },
        { status: 400 }
      );
    }

    // 권한 확인은 RLS 정책에서 처리

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
