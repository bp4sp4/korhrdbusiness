"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

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
  }, [handleActivity, resetTimers]);

  const extendSession = () => {
    setShowWarningModal(false);
    resetTimers();
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
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
