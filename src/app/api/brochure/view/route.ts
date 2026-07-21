import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 소개서 열람 링크
// 메일의 "소개서 열람하기" 버튼 → 열람 기록 남기고 PDF로 리다이렉트
// 잘못된 id여도 소개서는 열리게 한다 (기록만 실패)

const PDF_PATH = "/brochure/eduvisors-intro.pdf";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const pdfUrl = new URL(PDF_PATH, request.nextUrl.origin);

  if (id) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && serviceKey) {
        const admin = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: row } = await admin
          .from("brochure_requests")
          .select("id, viewed_at, view_count")
          .eq("id", id)
          .maybeSingle();
        if (row) {
          await admin
            .from("brochure_requests")
            .update({
              viewed_at: row.viewed_at ?? new Date().toISOString(),
              view_count: (row.view_count ?? 0) + 1,
            })
            .eq("id", row.id);
        }
      }
    } catch (error) {
      console.error("소개서 열람 기록 실패:", error);
    }
  }

  return NextResponse.redirect(pdfUrl, 302);
}
