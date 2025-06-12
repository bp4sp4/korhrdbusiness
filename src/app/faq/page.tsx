"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface SalesFaqProps {
  heading?: string;
  description?: string;
  items?: FaqItem[];
  supportHeading?: string;
  supportDescription?: string;
  supportButtonText?: string;
  supportButtonUrl?: string;
}

const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

const SalesFaq = ({
  heading = "영업 관련 자주 묻는 질문",
  description = "영업 프로세스와 서비스에 대한 궁금한 점들을 확인해보세요. 더 자세한 상담이 필요하시면 언제든 연락주세요.",
  items = [
    {
      id: "faq-1",
      question: "영업 상담은 어떻게 진행되나요?",
      answer:
        "초기 상담은 무료로 진행되며, 고객님의 니즈를 파악한 후 맞춤형 솔루션을 제안드립니다. 상담 시간은 보통 30분에서 1시간 정도 소요됩니다.",
      category: "상담 프로세스",
    },
    {
      id: "faq-2",
      question: "견적서는 언제 받을 수 있나요?",
      answer:
        "상담 완료 후 영업일 기준 2-3일 내에 상세한 견적서를 제공해드립니다. 급한 경우 당일 견적서 발급도 가능합니다.",
      category: "견적 및 가격",
    },
    {
      id: "faq-3",
      question: "계약 후 서비스 시작까지 얼마나 걸리나요?",
      answer:
        "계약 체결 후 일반적으로 1-2주 내에 서비스를 시작할 수 있습니다. 프로젝트 규모에 따라 일정이 조정될 수 있습니다.",
      category: "서비스 시작",
    },
    {
      id: "faq-4",
      question: "결제 방법은 어떻게 되나요?",
      answer:
        "현금, 카드, 계좌이체 등 다양한 결제 방법을 지원합니다. 기업 고객의 경우 세금계산서 발행 및 후불 결제도 가능합니다.",
      category: "결제 방법",
    },
    {
      id: "faq-5",
      question: "A/S 및 유지보수는 어떻게 이루어지나요?",
      answer:
        "계약 기간 동안 무상 A/S를 제공하며, 정기적인 점검과 업데이트 서비스를 포함합니다. 24시간 고객지원 센터를 운영하고 있습니다.",
      category: "A/S 및 지원",
    },
    {
      id: "faq-6",
      question: "맞춤형 솔루션 개발이 가능한가요?",
      answer:
        "네, 고객의 특별한 요구사항에 맞춘 맞춤형 솔루션 개발이 가능합니다. 별도 상담을 통해 개발 범위와 비용을 협의합니다.",
      category: "맞춤 개발",
    },
    {
      id: "faq-7",
      question: "대량 구매 시 할인 혜택이 있나요?",
      answer:
        "대량 구매 고객에게는 별도의 할인 혜택을 제공합니다. 구매 규모에 따라 최대 20%까지 할인이 가능합니다.",
      category: "할인 혜택",
    },
  ],
  supportHeading = "추가 상담이 필요하신가요?",
  supportDescription = "전문 영업팀이 고객님의 문의사항에 대해 신속하고 정확한 답변을 드립니다. 언제든지 편하게 연락주세요.",
  supportButtonText = "영업팀 연결",
  supportButtonUrl = "#contact",
}: SalesFaqProps) => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text">
            {heading}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem
                  value={item.id}
                  className={cn(
                    "rounded-xl border border-border/60 bg-card shadow-sm",
                    "hover:shadow-md transition-all duration-300",
                    "data-[state=open]:shadow-lg data-[state=open]:border-primary/20"
                  )}
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                    <div className="flex flex-col items-start gap-3 text-left">
                      {item.category && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {item.category}
                        </Badge>
                      )}
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.question}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="pt-2 border-t border-border/30">
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 p-8 text-center">
            {/* Avatar Group */}

            <h3 className="text-xl font-semibold text-foreground mb-3">
              {supportHeading}
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {supportDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <a href={supportButtonUrl}>
                  <Phone className="h-4 w-4" />
                  {supportButtonText}
                </a>
              </Button>
              <Link href="/counsel">
                <Button variant="outline" size="lg" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  온라인 상담
                </Button>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-border/30">
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  평일 09:00-18:00
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  sales@company.com
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function SalesFaqDemo() {
  return <SalesFaq />;
}
