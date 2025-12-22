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

// 팝업 이미지 업로드 (어드민 전용)
export async function POST(request: NextRequest) {
  try {
    // 어드민 인증 확인
    const authResult = await verifyAdmin(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { success: false, error: authResult.error || "관리자 권한이 필요합니다." },
        { status: 401 }
      );
    }

    logger.log("팝업 이미지 업로드 요청 시작");

    // 환경 변수 확인
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      logger.error("환경 변수가 설정되지 않음:", {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
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
      return NextResponse.json({
        success: false,
        error: "파일이 없습니다.",
      });
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
    // 파일 확장자 추출
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'png';
    // 파일명에서 확장자 제거하고 안전한 파일명 생성
    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9가-힣._-]/g, '_');
    // 연속된 언더스코어를 하나로 통합
    const cleanBaseName = baseName.replace(/_+/g, '_').replace(/^_+|_+$/g, '');
    // 최종 파일명: popup_타임스탬프_파일명.확장자
    const fileName = `popup_${timestamp}_${cleanBaseName || 'image'}.${fileExtension}`;

    logger.log("Supabase Storage에 팝업 이미지 업로드 중:", fileName);

    // Supabase Storage에 파일 업로드
    const supabaseAdmin = getSupabaseAdmin();
    const { data: uploadData, error: uploadError } =
      await supabaseAdmin.storage
        .from("post-attachments")
        .upload(`popups/${fileName}`, buffer, {
          contentType: file.type,
          upsert: true, // 기존 파일이 있으면 덮어쓰기 허용
        });

    if (uploadError) {
      logger.error("Supabase Storage 업로드 오류:", uploadError);
      logger.error("업로드 오류 상세:", {
        message: uploadError.message,
        name: uploadError.name,
      });
      return NextResponse.json({
        success: false,
        error: `파일 업로드 중 오류가 발생했습니다: ${uploadError.message}`,
      });
    }

    logger.log("Supabase Storage 업로드 완료:", uploadData.path);

    // 업로드된 파일이 실제로 존재하는지 확인
    const { data: fileList, error: listError } = await supabaseAdmin.storage
      .from("post-attachments")
      .list("popups", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (listError) {
      logger.error("파일 목록 조회 오류:", listError);
    } else {
      const uploadedFile = fileList?.find((f) => f.name === fileName);
      logger.log("업로드된 파일 확인:", uploadedFile ? "존재함" : "존재하지 않음", fileName);
    }

    // Supabase Storage에서 공개 URL 생성
    const { data: urlData } = supabaseAdmin.storage
      .from("post-attachments")
      .getPublicUrl(uploadData.path);

    logger.log("생성된 공개 URL:", urlData.publicUrl);
    logger.log("업로드된 경로:", uploadData.path);

    // URL 접근 가능 여부 확인 (HEAD 요청)
    try {
      const urlResponse = await fetch(urlData.publicUrl, { 
        method: "HEAD",
        headers: {
          'Accept': '*/*',
        }
      });
      logger.log("URL 접근 가능 여부:", urlResponse.status, urlResponse.statusText);
      if (!urlResponse.ok) {
        logger.warn("⚠️ 공개 URL에 접근할 수 없습니다. Storage 정책을 확인하세요.");
        logger.warn("⚠️ URL:", urlData.publicUrl);
        logger.warn("⚠️ Storage 버킷 'post-attachments'가 공개로 설정되어 있는지 확인하세요.");
        logger.warn("⚠️ Storage 정책에서 'popups/*' 경로에 대한 SELECT 권한이 있는지 확인하세요.");
      } else {
        logger.log("✅ URL 접근 성공!");
      }
    } catch (fetchError) {
      logger.error("URL 접근 확인 오류:", fetchError);
    }

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

