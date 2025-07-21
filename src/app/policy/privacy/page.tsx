"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { privacyData } from "./privacyData";

function renderPolicyContent(content: string) {
  return content.split("\n").map((line, idx) => {
    const trimmed = line.trim();
    if (/^[0-9]+\)/.test(trimmed)) {
      // 1) 2) ... 두 단계 들여쓰기
      return (
        <div key={idx} className="pl-12 whitespace-pre-line">
          {trimmed}
        </div>
      );
    }
    if (/^[가-힣]\./.test(trimmed)) {
      // 가. 나. ... 한 단계 들여쓰기
      return (
        <div key={idx} className="pl-6 whitespace-pre-line">
          {trimmed}
        </div>
      );
    }
    // 그 외(1. 등)는 들여쓰기 없음
    return (
      <div key={idx} className="whitespace-pre-line">
        {trimmed}
      </div>
    );
  });
}

const PrivacyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">개인정보처리방침</h1>
      <Accordion type="single" collapsible className="w-full">
        {privacyData.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-[16px] font-bold">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-[16px]">
              {renderPolicyContent(item.content)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default PrivacyPage;
