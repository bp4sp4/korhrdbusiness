"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

// 어드민 페이지(/admin/*)에서는 푸터를 숨긴다.
export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Footer />;
}
