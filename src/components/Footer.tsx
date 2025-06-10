"use client";

import "./Footer.css";
import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f8f9fa] border-t border-gray-200 pt-12 pb-8 px-4 mt-12">
      {/* 상단 4컬럼 메뉴 */}
      <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-12">
        {/* 서비스 */}
        <div className="flex-1 min-w-[120px] mb-6 md:mb-0">
          <h3 className="font-semibold text-gray-800 mb-2">서비스</h3>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>
              <a href="#notice" className="hover:underline">
                공지사항
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:underline">
                자주 묻는 질문
              </a>
            </li>
          </ul>
        </div>
        {/* 회사 */}
        <div className="flex-1 min-w-[120px] mb-6 md:mb-0">
          <h3 className="font-semibold text-gray-800 mb-2">회사</h3>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>
              <a
                href="http://korhrdedugroup.co.kr/"
                target="_blank"
                className="hover:underline"
              >
                한평생교육그룹
              </a>
            </li>
            <li>
              <a
                href="https://www.korhrd.co.kr/"
                target="_blank"
                className="hover:underline"
              >
                한평생직업훈련
              </a>
            </li>
            <li>
              <a
                href="http://www.korhrdsup.kr/"
                target="_blank"
                className="hover:underline"
              >
                한편생실습지원센터
              </a>
            </li>
            <li>
              <a href="#recruit" className="hover:underline">
                채용
              </a>
            </li>
            <li>
              <a href="#blog" className="hover:underline">
                블로그
              </a>
            </li>
            <li>
              <a href="#notice2" className="hover:underline">
                공고
              </a>
            </li>
          </ul>
        </div>
        {/* 문의 */}
        <div className="flex-1 min-w-[120px] mb-6 md:mb-0">
          <h3 className="font-semibold text-gray-800 mb-2">문의</h3>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>
              <a href="#biz" className="hover:underline">
                사업 제휴
              </a>
            </li>
            <li>
              <a href="#cert-biz" className="hover:underline">
                인증 사업 문의
              </a>
            </li>
            <li>
              <a href="#pr" className="hover:underline">
                마케팅 · PR
              </a>
            </li>
            <li>
              <a href="#ir" className="hover:underline">
                IR
              </a>
            </li>
          </ul>
        </div>
        {/* 고객센터 */}
        <div className="flex-1 min-w-[160px]">
          <h3 className="font-semibold text-gray-800 mb-2">고객센터</h3>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>
              <a href="tel:15994905" className="hover:underline">
                전화: 1599-4905(평일 10:00 ~ 18:00)
              </a>
            </li>
            <li>
              <a href="mailto:support@toss.im" className="hover:underline">
                이메일: korhrdpartners@naver.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* 하단 회사 정보 및 링크 */}
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 items-start">
        <div>
          <h2 className="font-bold text-lg mb-2 flex justify-left items-left text-gray-800 leading-[2]">
            <span>
              <Image
                width={36}
                height={36}
                src="/images/logo.png"
                alt="한평생교육그룹"
              />
            </span>
            <span className="ml-2">한평생교육그룹</span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-1">
            사업자등록번호 : 227-88-03196 원격평생교육시설신고 (제 원격20-6호) |
            대표: 양병웅
            <br />
            주소 : 서울시 방학로 174, 4층
          </p>
        </div>
        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* 하단 링크 */}
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-gray-700">
            <div>
              <a href="#terms" className="font-semibold hover:underline">
                서비스 이용약관
              </a>
              <br />
            </div>
            <div>
              <a href="#privacy" className="font-semibold hover:underline">
                개인정보 처리방침
              </a>
              <br />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
