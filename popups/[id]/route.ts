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

// 특정 팝업 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

// 팝업 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, template_type, template_image, center_image, bottom_title, bottom_subtitle, is_active, display_order } = body;

    // 부분 업데이트를 위한 객체 생성
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || "";
    if (template_type !== undefined) updateData.template_type = template_type;
    if (template_image !== undefined) updateData.template_image = template_image?.trim() || null;
    if (center_image !== undefined) updateData.center_image = center_image?.trim() || null;
    if (bottom_title !== undefined) updateData.bottom_title = bottom_title?.trim() || null;
    if (bottom_subtitle !== undefined) updateData.bottom_subtitle = bottom_subtitle?.trim() || null;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (display_order !== undefined) updateData.display_order = display_order;

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

// 팝업 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabaseAdmin
      .from("popups")
      .delete()
      .eq("id", id);

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
