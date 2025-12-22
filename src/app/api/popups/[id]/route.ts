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

// 특정 팝업 조회 (공개)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseAdmin = getSupabaseAdmin();
    const { data: popup, error } = await supabaseAdmin
      .from("popups")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      logger.error("팝업 조회 오류:", error);
      return NextResponse.json(
        { error: "팝업을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ popup });
  } catch (error) {
    logger.error("팝업 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 팝업 수정 (어드민 전용)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 어드민 인증 확인
    const authResult = await verifyAdmin(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }

    const { id } = await params;
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

    // 부분 업데이트를 위한 객체 생성
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || "";
    if (template_type !== undefined) updateData.template_type = template_type;
    if (template_image !== undefined)
      updateData.template_image = template_image?.trim() || null;
    if (center_image !== undefined)
      updateData.center_image = center_image?.trim() || null;
    if (bottom_title !== undefined)
      updateData.bottom_title = bottom_title?.trim() || null;
    if (bottom_subtitle !== undefined)
      updateData.bottom_subtitle = bottom_subtitle?.trim() || null;
    if (link_url !== undefined)
      updateData.link_url = link_url?.trim() || null;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (display_order !== undefined) updateData.display_order = display_order;

    const supabaseAdmin = getSupabaseAdmin();
    const { data: popup, error } = await supabaseAdmin
      .from("popups")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error("팝업 수정 오류:", error);
      return NextResponse.json(
        { error: "팝업 수정에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ popup });
  } catch (error) {
    logger.error("팝업 수정 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 팝업 삭제 (어드민 전용)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 어드민 인증 확인
    const authResult = await verifyAdmin(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from("popups").delete().eq("id", id);

    if (error) {
      logger.error("팝업 삭제 오류:", error);
      return NextResponse.json(
        { error: "팝업 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "팝업이 삭제되었습니다." });
  } catch (error) {
    logger.error("팝업 삭제 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

