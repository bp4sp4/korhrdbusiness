import { createClient } from "@supabase/supabase-js";

// 빌드(page data 수집) 단계에서 환경변수가 비어 있어도 createClient 가
// "supabaseUrl is required" 로 크래시 나지 않도록 안전한 placeholder 를 둔다.
// 실제 운영/개발에서는 NEXT_PUBLIC_* 값이 주입되어 placeholder 가 쓰이지 않는다.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
