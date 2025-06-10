"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isTop, setIsTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`header w-full fixed top-0 left-0 z-50 transition-colors duration-300 ${
        isTop ? "bg-transparent" : "bg-white shadow"
      }`}
    >
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="header__logo flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="로고"
            width={36}
            height={36}
            className="header__logo-img"
          />
          <span
            className={`text-xl font-bold ${
              isTop ? "text-white" : "text-gray-600"
            }`}
          >
            한평생OOO
          </span>
        </Link>
        <nav
          className={`header__nav hidden md:flex gap-6 ${
            isTop ? "text-white" : "text-gray-900"
          }`}
        >
          <Link href="/about" className="header__nav-link">
            회사소개
          </Link>
          <a href="#" className="header__nav-link">
            교육서비스
          </a>
          <a href="#" className="header__nav-link">
            설계사채용
          </a>
          <a href="#" className="header__nav-link">
            교육상담받기
          </a>
        </nav>
        <button
          className={`header__menu-btn md:hidden ${
            isTop ? "text-white" : "text-gray-900"
          }`}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="header__menu-icon">☰</span>
        </button>
      </div>
      {/* 모바일 메뉴 오버레이 */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-start">
          <div className="w-full max-w-sm bg-[#1a2233] rounded-b-2xl shadow-lg flex flex-col items-center pt-8 pb-4 relative">
            {/* 닫기 버튼 */}
            <button
              className="absolute top-4 right-4 text-3xl text-white"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>
            {/* 로고 */}
            <div className="mb-6 flex items-center gap-2">
              <Image src="/images/logo.png" alt="로고" width={40} height={40} />
              <span className="text-2xl font-bold text-white">한평생OOO</span>
            </div>
            {/* 안내문구 */}

            {/* 메뉴 */}
            <nav className="w-full flex flex-col items-center gap-2 mb-6">
              <a
                href="#"
                className="w-full py-3 px-2 text-lg font-semibold text-white hover:bg-[#22304a] rounded transition"
                onClick={() => setMenuOpen(false)}
              >
                회사 소개
              </a>
              <a
                href="#"
                className="w-full py-3 px-2 text-lg font-semibold text-white hover:bg-[#22304a] rounded transition"
                onClick={() => setMenuOpen(false)}
              >
                교육서비스
              </a>
              <a
                href="#"
                className="w-full py-3 px-2 text-lg font-semibold text-white hover:bg-[#22304a] rounded transition"
                onClick={() => setMenuOpen(false)}
              >
                설계사 채용
              </a>
              <a
                href="#"
                className="w-full py-3 px-2 text-lg font-semibold text-white hover:bg-[#22304a] rounded transition"
                onClick={() => setMenuOpen(false)}
              >
                교육상담받기
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
