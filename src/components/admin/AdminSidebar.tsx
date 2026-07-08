"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, CSSProperties } from "react";

const ACCENT = "#2b50c4";

const menuItems = [
  { href: "/admin/partner-inquiries", label: "파트너 문의" },
  { href: "/admin/popups", label: "팝업 관리" },
  { href: "/admin/recruit-applications", label: "설계사 지원자 관리" },
  { href: "/admin/consultations", label: "상담신청내역" },
];

const S = {
  aside: {
    width: 236,
    flex: "none",
    background: "#fafbfd",
    borderRight: "1px solid #eef0f4",
    padding: "28px 16px",
    minHeight: "100vh",
    fontFamily: '"Pretendard", -apple-system, sans-serif',
  } as CSSProperties,
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 8px 26px",
  } as CSSProperties,
  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 8,
    background: ACCENT,
    display: "inline-block",
  } as CSSProperties,
  brandName: {
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: "-.01em",
    color: "#161b26",
  } as CSSProperties,
  navLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".12em",
    color: "#a2aab8",
    textTransform: "uppercase",
    padding: "0 10px 14px",
  } as CSSProperties,
  navItemBase: {
    display: "block",
    padding: "11px 12px",
    borderRadius: 9,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "none",
    transition: "background .15s, color .15s",
  } as CSSProperties,
  navActive: {
    display: "block",
    padding: "11px 12px",
    borderRadius: 9,
    fontSize: 14,
    color: ACCENT,
    fontWeight: 700,
    background: "#eef2ff",
    cursor: "pointer",
    textDecoration: "none",
  } as CSSProperties,
};

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  const [hover, setHover] = useState(false);

  if (active) {
    return (
      <Link href={href} style={S.navActive}>
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...S.navItemBase,
        color: hover ? "#2a3040" : "#5b6474",
        background: hover ? "#eef1f6" : "transparent",
      }}
    >
      {label}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={S.aside}>
      <div style={S.navLabel}>관리자 메뉴</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {menuItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            active={pathname === item.href}
          />
        ))}
      </nav>
    </aside>
  );
}
