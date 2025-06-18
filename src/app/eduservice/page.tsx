"use client";

import { useScroll } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import PurposeSection from "@/components/PurposeSection";
import GoalsSection from "@/components/GoalsSection";
import WorkingMethodSection from "@/components/WorkingMethodSection";

export default function Home() {
  useScroll();

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <PurposeSection />
      <GoalsSection />
      <WorkingMethodSection />
    </div>
  );
}
