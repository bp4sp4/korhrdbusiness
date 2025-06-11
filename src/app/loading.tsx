"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <img src="/loading.gif" alt="로딩 중" style={{ width: 150 }} />
    </div>
  );
}
