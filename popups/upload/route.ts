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

export async function POST(request: NextRequest) {
  try {
    logger.log("팝업 이미지 업로드 요청 시작");
    
    // 환경 변수 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      logger.error("환경 변수가 설정되지 않음:", {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      });
      return NextResponse.json({
        success: false,
        error: "서버 설정 오류가 발생했습니다.",
      });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      logger.log("파일이 없음");
      return NextResponse.json({ success: false, error: "파일이 없습니다." });
    }

    logger.log("업로드할 파일:", file.name, "크기:", file.size);

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: "파일 크기가 5MB를 초과합니다.",
      });
    }

    // 이미지 파일 타입만 허용
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
    ];

    if (!allowedTypes.includes(file.type)) {
      logger.log("지원되지 않는 파일 타입:", file.type);
      return NextResponse.json({
        success: false,
        error: `지원되지 않는 파일 형식입니다. (${file.type})`,
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9가-힣._-]/g, "_");
    const fileName = `popup_${timestamp}_${safeFileName}`;

    logger.log("Supabase Storage에 팝업 이미지 업로드 중:", fileName);

    // Supabase Storage에 파일 업로드
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("post-attachments")
      .upload(`popups/${fileName}`, buffer, {
        contentType: file.type,
        upsert: true, // 기존 파일이 있으면 덮어쓰기 허용
      });

    if (uploadError) {
      logger.error("Supabase Storage 업로드 오류:", uploadError);
      logger.error("업로드 오류 상세:", {
        message: uploadError.message,
        name: uploadError.name
      });
      return NextResponse.json({
        success: false,
        error: `파일 업로드 중 오류가 발생했습니다: ${uploadError.message}`,
      });
    }

    logger.log("Supabase Storage 업로드 완료:", uploadData.path);

    // Supabase Storage에서 공개 URL 생성
    const { data: urlData } = supabaseAdmin.storage
      .from("post-attachments")
      .getPublicUrl(uploadData.path);

    const result = {
      success: true,
      data: {
        fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        path: uploadData.path,
      },
    };

    logger.log("팝업 이미지 업로드 성공:", result);
    return NextResponse.json(result);
  } catch (error) {
    logger.error("팝업 이미지 업로드 오류:", error);
    return NextResponse.json({
      success: false,
      error: "파일 업로드 중 오류가 발생했습니다.",
    });
  }
}
