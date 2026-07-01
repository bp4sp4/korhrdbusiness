"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useCounselModal } from "@/store/useCounselModal";
import styles from "./Header.module.css";

export default function Header() {
  // isAdmin: null(아직 확인 전), true(어드민), false(비어있음)
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { openModal } = useCounselModal();
  const [isMounted, setIsMounted] = useState(false);
  const menuListRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const [adminRole, setAdminRole] = useState<
    null | "super" | "manager" | "none"
  >(null);

  useEffect(() => {
    setIsMounted(true);
    // 클라이언트에서만 실행되는 코드
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setAdminRole("none");
        return;
      }
      const { data: admins } = await supabase
        .from("admins")
        .select("email, role")
        .eq("email", user.email)
        .single();
      if (admins && admins.role) {
        setAdminRole(admins.role); // "super" or "manager"
      } else {
        setAdminRole("none");
      }
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
      className={styles.header}
      style={{
        backgroundColor: "#191f28",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo2.png"
            alt="로고"
            width={28}
            height={28}
            className={styles.logoImg}
          />
          <span className={styles.logoText}>한평생 에듀바이저스</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/about" className={styles.navItem}>
            <span className={styles.navLink}>회사소개</span>
          </Link>
          {/* 교육서비스 임시 비활성화 */}
          {/* <Link href="/eduservice" className="group">
            <span className="header__nav-link text-[15px] px-4 py-2 rounded-[8px] transition-colors duration-150 group-hover:bg-[rgba(217,217,255,0.11)]">
              교육서비스
            </span>
          </Link> */}
          <button
            onClick={handleOpenCounselModal}
            className={`${styles.navItem} ${styles.btnReset}`}
          >
            <span className={styles.navLink}>교육상담받기</span>
          </button>
          {/* 설계사채용/지점모집 임시 비활성화 */}
          {/* <Link href="/recruit" className="group">
            <span className="header__nav-link text-[15px] px-4 py-2 rounded-[8px] transition-colors duration-150 group-hover:bg-[rgba(217,217,255,0.11)]">
              설계사채용
            </span>
          </Link>
          <Link href="/addbranch" className="group">
            <span className="header__nav-link text-[15px] px-4 py-2 rounded-[8px] transition-colors duration-150 group-hover:bg-[rgba(217,217,255,0.11)]">
              지점모집
            </span>
          </Link> */}

          {(adminRole === "super" || adminRole === "manager") && (
            <>
              <Link href="/admin/recruit-applications" className={styles.navItem}>
                <span className={`${styles.navLink} ${styles.adminLink}`}>
                  어드민
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className={`${styles.navLink} ${styles.logoutBtn}`}
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
          className={styles.menuBtn}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          <span className={styles.menuIcon}>{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>
      {/* 모바일 메뉴 오버레이 */}
      {isMounted && (
        <>
          {/* 오버레이 배경: 모바일 메뉴가 열릴 때만 */}
          <div
            className={`${styles.overlay} ${
              menuOpen ? styles.overlayOpen : styles.overlayClosed
            }`}
            onClick={() => setMenuOpen(false)}
          />
          {/* 메뉴 리스트: 헤더 아래에서 height transition으로 스르륵 */}
          <div
            className={styles.menuPanel}
            style={{
              top: "60px",
              maxHeight: menuOpen ? `${menuHeight}px` : "0px",
            }}
          >
            <div ref={menuListRef}>
              <nav className={styles.mobileNav}>
                <Link
                  href="/about"
                  className={styles.mobileLink}
                  onClick={() => setMenuOpen(false)}
                >
                  회사 소개
                </Link>
                {/* 교육서비스 임시 비활성화 */}
                {/* <Link
                  href="/eduservice"
                  className="w-full py-3 text-lg font-normal text-white hover:bg-[#22304a] rounded transition"
                  onClick={() => setMenuOpen(false)}
                >
                  교육서비스
                </Link> */}
                <button
                  onClick={() => {
                    handleOpenCounselModal();
                    setMenuOpen(false);
                  }}
                  className={`${styles.mobileLink} ${styles.mobileBtnReset}`}
                >
                  교육상담받기
                </button>
                {/* 설계사채용/지점모집 임시 비활성화 */}
                {/* <Link
                  href="/recruit"
                  className="w-full py-3 text-lg font-normal text-white hover:bg-[#22304a] rounded transition"
                  onClick={() => setMenuOpen(false)}
                >
                  설계사 채용
                </Link>
                <Link
                  href="/addbranch"
                  className="w-full py-3 text-lg font-normal text-white hover:bg-[#22304a] rounded transition"
                  onClick={() => setMenuOpen(false)}
                >
                  지점모집
                </Link> */}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
