"use client";

import "./Footer.css";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer w-full bg-gray-50 footer__container">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-6">
        <div className="footer__logo flex text-lg font-bold text-blue-600 mb-2">
          <Image src="/images/logo.png" width={36} height={36} alt="logo" />
          <p>한평생OOO</p>
        </div>
        <div className="footer__links flex gap-4 mb-2">
          <a href="#" className="footer__link">
            이용약관
          </a>
          <a href="#" className="footer__link">
            개인정보처리방침
          </a>
          <a href="#" className="footer__link">
            고객센터
          </a>
        </div>
        <div className="footer__copyright text-xs text-gray-400">
          © 2024 Insurance. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
