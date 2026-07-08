"use client";

import type { ReactNode } from "react";
import { usePartnerModal } from "@/store/usePartnerModal";

export const BROCHURE_MESSAGE =
  "소개서는 현재 준비 중입니다.\n궁금한 점이 있으시면 파트너 문의를 남겨주세요.";

type Props = {
  className?: string;
  children?: ReactNode;
};

/** 소개서 받기 — 준비중 안내 후 파트너 문의 모달 오픈 */
export function BrochureButton({ className, children }: Props) {
  const { openModal } = usePartnerModal();
  const handleClick = () => {
    alert(BROCHURE_MESSAGE);
    openModal();
  };
  return (
    <button type="button" className={className} onClick={handleClick}>
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
