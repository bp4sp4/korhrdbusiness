"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin/recruit-applications", label: "설계사 지원자 관리" },
    { href: "/admin/consultations", label: "상담신청내역" },
  
    { href: "/admin/popups", label: "팝업 관리" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">관리자 메뉴</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={`block px-4 py-2 rounded hover:bg-gray-700 ${
              pathname === item.href ? "bg-gray-700" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
