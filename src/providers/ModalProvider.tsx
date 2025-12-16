"use client";

import { useEffect, useState } from "react";
import CounselingModal from "@/components/modals/CounselingModal";

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
    </>
  );
};

export default ModalProvider;
