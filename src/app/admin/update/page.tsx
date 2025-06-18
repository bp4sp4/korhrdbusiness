"use client";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export default function UpdatePage() {
  return (
    <AdminAuthGuard>
      <div className="dev-log max-w-3xl mx-auto p-8">
        <h1>업데이트 일지</h1>
        <hr />
        <br />
        <h2>2024-06-18</h2>
        <ul>
          <li>
            <b>[기능 추가]</b> 상담 신청 폼{" "}
            <span className="text-blue-600">UI 개선</span>, 업데이트 메뉴 추가
          </li>

          <li>
            <b>[버그 수정]</b> 관리자 인증 로직{" "}
            <span className="text-green-600">수정</span>
          </li>

          <li>
            <b>[리팩토링]</b> Header 컴포넌트 코드 정리
          </li>
          <hr />
          <p>
            <b>작성자:</b> 박상훈
            <br />
            <b>비고:</b> 주요 변경점은 <code>src/app/counsel/page.tsx</code> 및{" "}
            <code>src/components/counsel.tsx</code> 참고
          </p>
          <br />
        </ul>
        <h2>2024-06-17</h2>
        <ul>
          <li>
            <b>[디자인 수정]</b>
            &nbsp;회사소개 디자인 생성 및 수정, 상담 신청 폼 디자인 수정
          </li>
          <li>
            <b>[문서]</b> README.md 작성 및 배포 가이드 추가
          </li>
        </ul>
        <hr />
        <p>
          <b>작성자:</b> 박상훈
          <br />
          <b>비고:</b> 주요 변경점은 <code>src/app/counsel/page.tsx</code> 및{" "}
          <code>src/components/Header.tsx</code> 참고
        </p>
      </div>
    </AdminAuthGuard>
  );
}
