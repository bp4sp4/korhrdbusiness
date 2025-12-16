"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      const { data: admins } = await supabase
        .from("admins")
        .select("email")
        .eq("email", user.email);
      if (!admins || admins.length === 0) {
        router.replace("/admin/login");
        return;
      }
      setLoading(false);
    }
    checkAdmin();
  }, [router]);

  if (loading)
    return <div className="p-8 text-center">관리자 인증 확인 중...</div>;
  return <>{children}</>;
}
