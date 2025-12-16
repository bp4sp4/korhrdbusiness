"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
export default function AddBranchPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <div className="max-w-md">
        <h1 className="text-2xl font-bold text-primary mb-4">
          서비스 준비중입니다.
        </h1>

        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            메인으로 이동하기
          </Link>
        </Button>
      </div>
    </div>
  );
}
