"use client";

import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles.topRow}>
          <div className={styles.col120}>
            <div className={styles.colHeading}>회사</div>
            <Link
              target="_blank"
              href="https://www.korhrdcorp.co.kr/"
              className={styles.linkItem}
            >
              한평생교육
            </Link>
            <Link
              target="_blank"
              href="https://korhrd.co.kr/"
              className={styles.linkItem}
            >
              한평생 직업훈련
            </Link>
            <Link
              target="_blank"
              href="https://pf.kakao.com/_inxaTn"
              className={styles.linkItem}
            >
              한평생 학습지원
            </Link>
          </div>

          <div className={styles.col180}>
            <div className={styles.colHeading}>문의</div>
            <a href="tel:0221356513" className={styles.linkItem}>
              전화: 02-2135-6514 (평일 10:00 ~ 18:00)
            </a>
            <a
              href="mailto:korhrdlicense@korhrdoffice.com"
              className={styles.linkItem}
            >
              이메일: korhrdlicense@korhrdoffice.com
            </a>
          </div>
        </div>
        {/* 회사 정보 */}
        <div className={styles.infoRow}>
          {/* 회사 텍스트 정보 */}
          <div className={styles.infoCol}>
            <div className={styles.companyName}>(주)한평생교육</div>
            <div>
              사업자등록번호 : 227-88-03196 | 직업평생교육시설신고 (제
              원격20-6호) | 대표: 양병웅
            </div>
            <div>주소 : 서울시 도봉구 창동 마들로13길 61 씨드큐브 905호</div>
            <div className={styles.linksRow}>
              <Link href="/policy/terms" className={styles.policyLink}>
                서비스 이용약관
              </Link>
              <Link href="/policy/privacy" className={styles.underlineLink}>
                개인정보 처리방침
              </Link>
            </div>
            <div className={styles.copyright}>
              2025 © Eduvisors (KORHRD Partners). All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
