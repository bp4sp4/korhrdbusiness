"use client";

import "./Footer.css";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f7f8fa] text-[#222b45]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 네 개 컬럼 */}
        <div className="flex flex-col md:flex-row items-start gap-12 mb-8">
          <div className="min-w-[120px]">
            <div className="font-bold mb-2">서비스</div>
            <div className="mb-1">공지사항</div>
            <div className="mb-1">자주 묻는 질문</div>
          </div>
          <div className="min-w-[120px]">
            <div className="font-bold mb-2">회사</div>
            <div className="mb-1">한평생교육그룹</div>
            <div className="mb-1">한평생직업훈련</div>
            <div className="mb-1">한평생실습지원센터</div>
            <div className="mb-1">채용</div>
            <div className="mb-1">블로그</div>
            <div className="mb-1">공고</div>
          </div>
          <div className="min-w-[120px]">
            <div className="font-bold mb-2">문의</div>
            <div className="mb-1">사업 제휴</div>
            <div className="mb-1">인증 사업 문의</div>
            <div className="mb-1">마케팅 · PR</div>
            <div className="mb-1">IR</div>
          </div>
          <div className="min-w-[180px]">
            <div className="font-bold mb-2">고객센터</div>
            <div className="mb-1">전화: 1599-4905 (평일 10:00 ~ 18:00)</div>
            <div className="mb-1">이메일: korhrdpartners@naver.com</div>
          </div>
        </div>
        {/* 회사 정보 */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
          {/* 회사 텍스트 정보 */}
          <div className="text-sm text-[#666] text-center md:text-left">
            <div className="font-bold text-lg text-[#222b45] mb-1">
              한평생교육그룹
            </div>
            <div>
              사업자등록번호 : 227-88-03196 | 직업평생교육시설신고 (제
              원격20-6호) | 대표: 양병웅
            </div>
            <div>주소 : 서울시 방학로 174, 4층</div>
            <div className="mt-2">
              <span className="mr-4">서비스 이용약관</span>
              <span>개인정보 처리방침</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
