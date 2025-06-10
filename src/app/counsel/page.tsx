"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  Briefcase,
  GraduationCap,
  MapPin,
  CheckCircle,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  field: string;
  preferredDate: string;
  preferredTime: string;
  consultationType: string;
  message: string;
}

const CareerConsultationUI = () => {
  const [formData, setFormData] = useState<ConsultationFormData>({
    name: "",
    email: "",
    phone: "",
    experience: "",
    field: "",
    preferredDate: "",
    preferredTime: "",
    consultationType: "",
    message: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalSteps = 3;

  const handleInputChange = (
    field: keyof ConsultationFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsDialogOpen(false);
      setIsSubmitted(false);
      setCurrentStep(1);
      setFormData({
        name: "",
        email: "",
        phone: "",
        experience: "",
        field: "",
        preferredDate: "",
        preferredTime: "",
        consultationType: "",
        message: "",
      });
    }, 2000);
  };

  const consultationTypes = [
    {
      value: "career-change",
      label: "커리어 전환",
      icon: <ArrowRight className="w-4 h-4" />,
    },
    {
      value: "resume-review",
      label: "이력서 검토",
      icon: <User className="w-4 h-4" />,
    },
    {
      value: "interview-prep",
      label: "면접 준비",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      value: "skill-development",
      label: "스킬 개발",
      icon: <GraduationCap className="w-4 h-4" />,
    },
  ];

  const experienceLevels = [
    "신입 (0-1년)",
    "주니어 (1-3년)",
    "미드레벨 (3-5년)",
    "시니어 (5-10년)",
    "리드/매니저 (10년+)",
  ];

  const fields = [
    "소프트웨어 개발",
    "데이터 사이언스",
    "디자인",
    "마케팅",
    "영업",
    "기획",
    "인사",
    "재무/회계",
    "기타",
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                이름 *
              </Label>
              <Input
                id="name"
                placeholder="홍길동"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                이메일 *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="hong@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                연락처 *
              </Label>
              <Input
                id="phone"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label className="text-sm font-medium">경력 수준 *</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) =>
                  handleInputChange("experience", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="경력을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">관심 분야 *</Label>
              <Select
                value={formData.field}
                onValueChange={(value) => handleInputChange("field", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="분야를 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">상담 유형 *</Label>
              <div className="grid grid-cols-2 gap-2">
                {consultationTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() =>
                      handleInputChange("consultationType", type.value)
                    }
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border text-sm transition-all",
                      formData.consultationType === type.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  희망 날짜
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) =>
                    handleInputChange("preferredDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">
                  희망 시간
                </Label>
                <Select
                  value={formData.preferredTime}
                  onValueChange={(value) =>
                    handleInputChange("preferredTime", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="시간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                추가 메시지
              </Label>
              <Textarea
                id="message"
                placeholder="상담받고 싶은 내용이나 궁금한 점을 자유롭게 작성해주세요..."
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone;
      case 2:
        return (
          formData.experience && formData.field && formData.consultationType
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  const templateParams = {
    title: "상담 신청", // 제목 (원하는 텍스트)
    name: formData.name, // 신청자 이름
    message: formData.message, // 상담 내용
    time: new Date().toLocaleString(), // 현재 시간
    email: formData.email, // 신청자 이메일
    phone: formData.phone, // 신청자 연락처(전화번호)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            취업 상담 서비스
          </h1>
          <p className="text-gray-600">
            전문 커리어 컨설턴트와 함께 당신의 커리어를 설계해보세요
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* 서비스 소개 카드 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />왜 취업 상담이
                  필요한가요?
                </CardTitle>
                <CardDescription>
                  전문가의 도움으로 더 나은 커리어를 만들어보세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">개인 맞춤 커리어 로드맵</h4>
                    <p className="text-sm text-gray-600">
                      당신의 경험과 목표에 맞는 구체적인 계획을 제시합니다
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">이력서 & 면접 코칭</h4>
                    <p className="text-sm text-gray-600">
                      채용 담당자의 시선을 사로잡는 이력서와 면접 스킬을
                      배워보세요
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">업계 인사이트 제공</h4>
                    <p className="text-sm text-gray-600">
                      최신 채용 트렌드와 업계 동향을 파악할 수 있습니다
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">네트워킹 기회</h4>
                    <p className="text-sm text-gray-600">
                      업계 전문가들과의 연결고리를 만들어드립니다
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">상담 정보</span>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 상담 시간: 60분</li>
                    <li>• 상담 방식: 온라인/오프라인</li>
                    <li>• 상담 비용: 무료 (첫 상담)</li>
                    <li>• 후속 지원: 이메일 피드백 제공</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 상담 신청 폼 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>상담 신청하기</CardTitle>
                <CardDescription>
                  간단한 정보를 입력하고 전문가와 상담을 예약하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      상담 예약하기
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>취업 상담 신청</DialogTitle>
                      <DialogDescription>
                        단계별로 정보를 입력해주세요. ({currentStep}/
                        {totalSteps})
                      </DialogDescription>
                    </DialogHeader>

                    {!isSubmitted ? (
                      <>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                          <motion.div
                            className="bg-primary h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(currentStep / totalSteps) * 100}%`,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>

                        <AnimatePresence mode="wait">
                          {renderStep()}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4">
                          <Button
                            variant="outline"
                            onClick={handlePrev}
                            disabled={currentStep === 1}
                          >
                            이전
                          </Button>

                          {currentStep < totalSteps ? (
                            <Button
                              onClick={handleNext}
                              disabled={!isStepValid()}
                            >
                              다음
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          ) : (
                            <Button
                              onClick={handleSubmit}
                              disabled={!isStepValid()}
                            >
                              신청 완료
                              <CheckCircle className="w-4 h-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                        >
                          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">
                          신청이 완료되었습니다!
                        </h3>
                        <p className="text-gray-600 mb-4">
                          담당자가 24시간 내에 연락드릴 예정입니다.
                        </p>
                        <div className="text-sm text-gray-500">
                          <p>• 이메일로 상담 확정 안내를 보내드립니다</p>
                          <p>• 상담 전 준비사항을 미리 안내해드립니다</p>
                        </div>
                      </motion.div>
                    )}
                  </DialogContent>
                </Dialog>

                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>상담 문의: career@company.com</p>
                  <p>전화: 02-1234-5678 (평일 9:00-18:00)</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CareerConsultationUI;
