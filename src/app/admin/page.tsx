import { redirect } from "next/navigation";

// 어드민 기본 진입 → 파트너 문의로 이동
export default function AdminIndexPage() {
  redirect("/admin/partner-inquiries");
}
