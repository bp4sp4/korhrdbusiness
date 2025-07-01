"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useCounselModal } from "@/store/useCounselModal";

export default function Header() {
  // isAdmin: null(아직 확인 전), true(어드민), false(비어있음)
  const [isAdmin, setIsAdmin] = useState<null | boolean>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { openModal } = useCounselModal();
  const [isMounted, setIsMounted] = useState(false);
  const menuListRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    // 클라이언트에서만 실행되는 코드
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data: admins } = await supabase
        .from("admins")
        .select("email")
        .eq("email", user.email);
      setIsAdmin(Array.isArray(admins) && admins.length > 0);
    }
    checkAdmin();

    // 로그인/로그아웃 등 인증 상태 변화 감지
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (menuOpen && menuListRef.current) {
      setMenuHeight(menuListRef.current.scrollHeight);
    } else {
      setMenuHeight(0);
    }
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleOpenCounselModal = () => {
    openModal();
    setMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-white"
      style={{
        backgroundColor: "#191f28",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="header__logo flex items-center gap-2">
          <Image
            src="/images/logo2.png"
            alt="로고"
            width={28}
            height={28}
            className="header__logo-img"
          />
          <span className="text-[28px] font-bold text-white">Eduvisors</span>
        </Link>
        <nav className="header__nav hidden md:flex gap-3 text-white items-center">
          <Link href="/about" className="group">
            <span className="header__nav-link text-[15px] px-4 py-2 rounded-[8px] transition-colors duration-150 group-hover:bg-[rgba(217,217,255,0.11)]">
              회사소개
            </span>
          </Link>
          <Link href="/eduservice" className="group">
            <span className="header__nav-link text-[15px] px-4 py-2 rounded-[8px] transition-colors duration-150 group-hover:bg-[rgba(217,217,255,0.11)]">
              교육서비스
            </span>
          </Link>
          <button
            onClick={handleOpenCounselModal}
            className="group bg-transparent border-none cursor-pointer"
          >
            <span className="header__nav-link text-[15px] px-4 py-2 rounded-[8px] transition-colors duration-150 group-hover:bg-[rgba(217,217,255,0.11)]">
              교육상담받기
            </span>
          </button>
          <Link href="/recruit" className="group">
            <span className="header__nav-link text-[15px] px-4 py-2 rounded-[8px] transition-colors duration-150 group-hover:bg-[rgba(217,217,255,0.11)]">
              설계사채용
            </span>
          </Link>
          {/* admin 메뉴는 isAdmin === true일 때만 렌더링 */}
          {isAdmin === true && (
            <>
              <Link href="/admin/consultations" className="group">
                <span className="header__nav-link text-[15px] px-4 py-2 rounded-[8px] transition-colors duration-150 group-hover:bg-[rgba(217,217,255,0.11)] font-bold text-blue-300">
                  상담 신청 내역
                </span>
              </Link>
              <Link href="/admin/recruit-applications" className="group">
                <span className="header__nav-link text-[15px] px-4 py-2 rounded-[8px] transition-colors duration-150 group-hover:bg-[rgba(217,217,255,0.11)] font-bold text-blue-300">
                  설계사 지원자 관리
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="header__nav-link text-[15px] px-4 py-2 rounded-[8px] transition-colors duration-150 group-hover:bg-[rgba(217,217,255,0.11)] font-bold text-red-300"
                style={{
                  border: 0,
                  background: "none",
                  display: "inline-block",
                  verticalAlign: "middle",
                  lineHeight: "normal",
                  cursor: "pointer",
                }}
              >
                로그아웃
              </button>
            </>
          )}
        </nav>
        {/* 모바일: 햄버거/X 버튼 토글 */}
        <button
          className="header__menu-btn md:hidden text-white"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          <span className="header__menu-icon text-3xl">
            {menuOpen ? "×" : "☰"}
          </span>
        </button>
      </div>
      {/* 모바일 메뉴 오버레이 */}
      {isMounted && (
        <>
          {/* 오버레이 배경: 모바일 메뉴가 열릴 때만 */}
          <div
            className={`
              fixed inset-0 z-40 transition-opacity duration-300
              ${
                menuOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }
              md:hidden
            `}
            onClick={() => setMenuOpen(false)}
          />
          {/* 메뉴 리스트: 헤더 아래에서 height transition으로 스르륵 */}
          <div
            className={`
              fixed left-0 right-0 z-50 bg-[#191f28] text-white shadow-lg md:hidden overflow-hidden
              transition-[max-height] duration-200 ease-in-out
            `}
            style={{
              top: "60px",
              maxHeight: menuOpen ? `${menuHeight}px` : "0px",
            }}
          >
            <div ref={menuListRef}>
              <nav className="w-full flex flex-col items-center gap-2 px-4 py-4">
                <Link
                  href="/about"
                  className="w-full py-3 text-lg font-normal text-white hover:bg-[#22304a] rounded transition"
                  onClick={() => setMenuOpen(false)}
                >
                  회사 소개
                </Link>
                <Link
                  href="/eduservice"
                  className="w-full py-3 text-lg font-normal text-white hover:bg-[#22304a] rounded transition"
                  onClick={() => setMenuOpen(false)}
                >
                  교육서비스
                </Link>
                <button
                  onClick={() => {
                    handleOpenCounselModal();
                    setMenuOpen(false);
                  }}
                  className="w-full py-3 text-lg font-normal text-white hover:bg-[#22304a] rounded transition bg-transparent border-none text-left md:text-left"
                >
                  교육상담받기
                </button>
                <Link
                  href="/recruit"
                  className="w-full py-3 text-lg font-normal text-white hover:bg-[#22304a] rounded transition"
                  onClick={() => setMenuOpen(false)}
                >
                  설계사 채용
                </Link>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
