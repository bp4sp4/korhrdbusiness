"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-primary mb-4">
            서비스 준비중입니다.
          </h1>
          <p className="text-muted-foreground mb-8">
            요청하신 페이지를 찾을 수 없거나 현재 준비 중에 있습니다.
            <br /> 조금만 기달려주세요
          </p>
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
}
