"use client";

import "./Footer.css";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f7f8fa] text-[#222b45]">
      <div className="footer__wrap max-w-5xl mx-auto py-8">
        <div className="flex flex-col md:flex-row items-start text-[#666] text-[15px] gap-[20px] mb-8">
          <div className="min-w-[120px]">
            <div className="font-bold mb-2">서비스</div>
            <Link href="/notice" className="mb-1 block hover:underline">
              공지사항
            </Link>
            <Link href="/faq" className="mb-1 block hover:underline">
              자주 묻는 질문
            </Link>
          </div>
          <div className="min-w-[120px]">
            <div className="font-bold mb-2">회사</div>
            <Link
              target="_blank"
              href="http://korhrdedugroup.co.kr/"
              className="mb-1 block hover:underline"
            >
              한평생교육그룹
            </Link>
            <Link
              target="_blank"
              href="https://korhrd.co.kr/"
              className="mb-1 block hover:underline"
            >
              한평생직업훈련
            </Link>
            <Link
              target="_blank"
              href="http://www.korhrdsup.kr/"
              className="mb-1 block hover:underline"
            >
              한평생실습지원센터
            </Link>
            <Link href="/recruit" className="mb-1 block hover:underline">
              채용
            </Link>
            <a
              href="https://blog.naver.com/korhrdpartners"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 block hover:underline"
            >
              블로그
            </a>
            <Link href="/notice" className="mb-1 block hover:underline">
              공고
            </Link>
          </div>
          <div className="min-w-[120px]">
            <div className="font-bold mb-2">문의</div>
            <Link
              href="/contact/partnership"
              className="mb-1 block hover:underline"
            >
              사업 제휴
            </Link>
            <Link
              href="/contact/certification"
              className="mb-1 block hover:underline"
            >
              인증 사업 문의
            </Link>
            <Link
              href="/contact/marketing"
              className="mb-1 block hover:underline"
            >
              마케팅 · PR
            </Link>
            <Link href="/contact/ir" className="mb-1 block hover:underline">
              IR
            </Link>
          </div>
          <div className="min-w-[180px]">
            <div className="font-bold mb-2">고객센터</div>
            <a href="tel:15994905" className="mb-1 block hover:underline">
              전화: 1599-4905 (평일 10:00 ~ 18:00)
            </a>
            <a
              href="mailto:korhrdpartners@naver.com"
              className="mb-1 block hover:underline"
            >
              이메일: korhrdpartners@naver.com
            </a>
          </div>
        </div>
        {/* 회사 정보 */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
          {/* 회사 텍스트 정보 */}
          <div className="text-sm text-[#666] text-left md:text-left">
            <div className="font-bold text-[15px] pb-[16px] text-[#222b45] mb-1">
              (주)한평생교육그룹
            </div>
            <div>
              사업자등록번호 : 227-88-03196 | 직업평생교육시설신고 (제
              원격20-6호) | 대표: 양병웅
            </div>
            <div>주소 : 서울시 도봉구 창동 마들로13길 61 씨드큐브 905호</div>
            <div className="mt-2">
              <Link href="/terms" className="mr-4 hover:underline">
                서비스 이용약관
              </Link>
              <Link href="/privacy" className="hover:underline">
                개인정보 처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
