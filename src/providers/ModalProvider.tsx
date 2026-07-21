"use client";

import { useEffect, useState } from "react";
import CounselingModal from "@/components/modals/CounselingModal";
import PartnerInquiryModal from "@/components/modals/PartnerInquiryModal";
import BrochureModal from "@/components/modals/BrochureModal";

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
      <BrochureModal />
    </>
  );
};

export default ModalProvider;
