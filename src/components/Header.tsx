"use client";

import { useState, useEffect } from "react";
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
      className="header w-full transition-colors duration-300"
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
        <button
          className="header__menu-btn md:hidden text-white"
          onClick={() => setMenuOpen(true)}
        >
          <span className="header__menu-icon">☰</span>
        </button>
      </div>
      {/* 오버레이는 마운트 후에만 렌더링 */}
      {isMounted && (
        <div
          className={`
            fixed inset-0 z-50 flex flex-col items-center justify-start
            transition-all duration-500
            ${
              menuOpen
                ? "bg-black/80 opacity-100 pointer-events-auto"
                : "bg-black/0 opacity-0 pointer-events-none"
            }
          `}
        >
          <div
            className={`
              w-full bg-[#1a2233] shadow-lg flex flex-col pt-0 pb-4 relative
              transform transition-transform duration-300
              ${menuOpen ? "translate-y-0" : "-translate-y-full"}
            `}
          >
            {/* 상단 바: 로고(왼쪽) + 햄버거/닫기(오른쪽) */}
            <div className="flex items-center justify-between w-full px-4 py-4">
              {/* 로고+이름 묶음 */}
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo2.png"
                  alt="로고"
                  width={29}
                  height={28}
                />
                <span className="text-[16px] font-bold text-white">
                  Eduvisors
                </span>
              </div>
              {/* 오른쪽 버튼: 메뉴 상태에 따라 변경 */}
              {menuOpen ? (
                <button
                  className="text-3xl text-white"
                  onClick={() => setMenuOpen(false)}
                  aria-label="메뉴 닫기"
                >
                  ×
                </button>
              ) : (
                <button
                  className="text-3xl text-white"
                  onClick={() => setMenuOpen(true)}
                  aria-label="메뉴 열기"
                >
                  <span className="header__menu-icon">☰</span>
                </button>
              )}
            </div>
            {/* 메뉴 */}
            <nav className="w-full flex flex-col items-center gap-2 mb-6 px-4">
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
                onClick={handleOpenCounselModal}
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
              {/* admin 메뉴는 isAdmin === true일 때만 렌더링 */}
              {isAdmin === true && (
                <>
                  <Link
                    href="/admin/consultations"
                    className="w-full py-3 text-lg font-semibold text-blue-300 hover:bg-[#22304a] rounded transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    상담 신청 내역
                  </Link>
                  <Link
                    href="/admin/recruit-applications"
                    className="w-full py-3 text-lg font-semibold text-blue-300 hover:bg-[#22304a] rounded transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    설계사 지원자 관리
                  </Link>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setMenuOpen(false);
                      router.push("/admin/login");
                    }}
                    className="w-full py-3 text-lg text-left font-semibold text-white hover:bg-[#22304a] rounded transition"
                  >
                    로그아웃
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
