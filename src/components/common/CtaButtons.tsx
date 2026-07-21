"use client";

import type { ReactNode } from "react";
import { usePartnerModal } from "@/store/usePartnerModal";
import { useBrochureModal } from "@/store/useBrochureModal";

type Props = {
  className?: string;
  children?: ReactNode;
};

/** 소개서 받기 — 이름/연락처/이메일 입력 후 이메일로 소개서 발송 */
export function BrochureButton({ className, children }: Props) {
  const { openModal } = useBrochureModal();
  return (
    <button type="button" className={className} onClick={openModal}>
      {children ?? "소개서 받기"}
    </button>
  );
}

/** 파트너 문의 — 파트너 문의 모달 오픈 */
export function PartnerButton({ className, children }: Props) {
  const { openModal } = usePartnerModal();
  return (
    <button type="button" className={className} onClick={openModal}>
      {children ?? "파트너 문의"}
    </button>
  );
}
