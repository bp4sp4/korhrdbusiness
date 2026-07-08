"use client";

import { useEffect, useState } from "react";
import CounselingModal from "@/components/modals/CounselingModal";
import PartnerInquiryModal from "@/components/modals/PartnerInquiryModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CounselingModal />
      <PartnerInquiryModal />
    </>
  );
};

export default ModalProvider;
