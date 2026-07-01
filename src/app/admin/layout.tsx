"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AUTO_LOGOUT_TIME = 30 * 60 * 1000;
const WARNING_TIME = 5 * 60 * 1000;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  // null = 확인 중, false = 관리자 아님, true = 인증된 관리자
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // 로그인 여부 확인 (로그인 시 사이드바 노출용) + 로그인/로그아웃 실시간 반영
  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (mounted) setIsAdmin(false);
        return;
      }
      const { data: admins } = await supabase
        .from("admins")
        .select("email")
        .eq("email", user.email);
      if (mounted) setIsAdmin(!!admins && admins.length > 0);
    };
    checkAdmin();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const resetTimers = useCallback(() => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    if (warningTimer.current) {
      clearTimeout(warningTimer.current);
    }

    logoutTimer.current = setTimeout(async () => {
      await supabase.auth.signOut();
      router.push("/admin/login");
    }, AUTO_LOGOUT_TIME);

    warningTimer.current = setTimeout(() => {
      setShowWarningModal(true);
    }, AUTO_LOGOUT_TIME - WARNING_TIME);
  }, [router]);

  const handleActivity = useCallback(() => {
    if (showWarningModal) {
      setShowWarningModal(false);
    }
    resetTimers();
  }, [resetTimers, showWarningModal]);

  useEffect(() => {
    // 로그인 페이지이거나 인증 전에는 자동 로그아웃 타이머를 돌리지 않는다.
    if (isLoginPage || isAdmin !== true) return;

    resetTimers();

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
      if (warningTimer.current) {
        clearTimeout(warningTimer.current);
      }
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [handleActivity, resetTimers, isLoginPage, isAdmin]);

  const extendSession = () => {
    setShowWarningModal(false);
    resetTimers();
  };

  // 로그인 페이지는 사이드바 없이 전체 폭으로 렌더링
  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* 사이드바는 인증된 관리자일 때만 노출 */}
      {isAdmin && <AdminSidebar />}
      <main className="flex-1 bg-gray-50">{children}</main>

      <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>세션 만료 경고</DialogTitle>
          </DialogHeader>
          <p>
            활동이 없어 잠시 후 자동으로 로그아웃됩니다. 세션을
            연장하시겠습니까?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={extendSession}>
              세션 연장
            </Button>
            <Button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/admin/login");
              }}
            >
              로그아웃
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
