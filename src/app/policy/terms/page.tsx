"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { termsData } from "./termsData";

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

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">이용약관</h1>
      <Accordion type="single" collapsible className="w-full">
        {termsData.map((term) => (
          <AccordionItem key={term.id} value={term.id}>
            <AccordionTrigger className="text-[16px] font-bold">
              {term.title}
            </AccordionTrigger>
            <AccordionContent className="text-[16px]">
              {renderPolicyContent(term.content)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TermsPage;
