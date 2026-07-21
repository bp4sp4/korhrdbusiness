"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Upload, X, Eye } from "lucide-react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import popupStyles from "@/components/popups/PopupManager.module.css";
import pageStyles from "./page.module.css";

interface Popup {
  id: string;
  name: string;
  description: string;
  template_type: string;
  template_image?: string;
  center_image?: string;
  bottom_title?: string;
  bottom_subtitle?: string;
  link_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export default function PopupsPage() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    template_type: "default",
    template_image: "",
    center_image: "",
    bottom_title: "",
    bottom_subtitle: "",
    link_url: "",
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    loadPopups();
  }, []);

  // 디버깅: 이미지 URL 변경 시 로그 출력
  useEffect(() => {
    if (formData.center_image) {
      console.log("중앙 이미지 URL:", formData.center_image);
    }
    if (formData.template_image) {
      console.log("템플릿 이미지 URL:", formData.template_image);
    }
  }, [formData.center_image, formData.template_image]);

  const loadPopups = async () => {
    try {
      // 관리자 목록: 비활성 팝업 포함 + CDN 캐시 우회 (수정 즉시 반영)
      const response = await fetch("/api/popups?admin=1", {
        cache: "no-store",
      });
      const data = await response.json();
      setPopups(data.popups || []);
    } catch (error) {
      console.error("팝업 로드 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("로그인이 필요합니다.");
    }
    return {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    };
  };

  const handleImageUpload = async (
    file: File,
    type: "template" | "center"
  ) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const headers = await getAuthHeaders();
      const response = await fetch("/api/popups/upload", {
        method: "POST",
        headers: {
          Authorization: headers.Authorization,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        if (type === "template") {
          setFormData((prev) => ({
            ...prev,
            template_image: result.data.url,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            center_image: result.data.url,
          }));
        }
      } else {
        alert(result.error || "이미지 업로드 실패");
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = await getAuthHeaders();

      if (editingPopup) {
        // 수정
        const response = await fetch(`/api/popups/${editingPopup.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "수정 실패");
        }
      } else {
        // 생성
        const response = await fetch("/api/popups", {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "생성 실패");
        }
      }

      setShowDialog(false);
      resetForm();
      loadPopups();
    } catch (error) {
      console.error("저장 오류:", error);
      alert(error instanceof Error ? error.message : "저장 실패");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/popups/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "삭제 실패");
      }

      loadPopups();
    } catch (error) {
      console.error("삭제 오류:", error);
      alert(error instanceof Error ? error.message : "삭제 실패");
    }
  };

  const handleEdit = (popup: Popup) => {
    setEditingPopup(popup);
    setFormData({
      name: popup.name,
      description: popup.description || "",
      template_type: popup.template_type,
      template_image: popup.template_image || "",
      center_image: popup.center_image || "",
      bottom_title: popup.bottom_title || "",
      bottom_subtitle: popup.bottom_subtitle || "",
      link_url: popup.link_url || "",
      is_active: popup.is_active,
      display_order: popup.display_order,
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      template_type: "default",
      template_image: "",
      center_image: "",
      bottom_title: "",
      bottom_subtitle: "",
      link_url: "",
      is_active: true,
      display_order: 0,
    });
    setEditingPopup(null);
  };

  if (loading) {
    return (
      <AdminAuthGuard>
        <div className="p-8 text-center">로딩 중...</div>
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <div className="p-8">
        <div className="flex justify-between items-center ">
          <h1 className="text-2xl font-bold">팝업 관리</h1>
          <Button
            onClick={() => {
              resetForm();
              setShowDialog(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            새 팝업
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  템플릿
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  활성화
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  순서
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  생성일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {popups.map((popup) => (
                <tr key={popup.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {popup.name}
                    </div>
                    {popup.description && (
                      <div className="text-sm text-gray-500">
                        {popup.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {popup.template_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        popup.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {popup.is_active ? "활성" : "비활성"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {popup.display_order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(popup.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPopup(popup);
                        setFormData({
                          name: popup.name,
                          description: popup.description || "",
                          template_type: popup.template_type,
                          template_image: popup.template_image || "",
                          center_image: popup.center_image || "",
                          bottom_title: popup.bottom_title || "",
                          bottom_subtitle: popup.bottom_subtitle || "",
                          link_url: popup.link_url || "",
                          is_active: popup.is_active,
                          display_order: popup.display_order,
                        });
                        setShowDialog(true);
                      }}
                      className="mr-2"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(popup)}
                      className="mr-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(popup.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="!max-w-[95vw] !w-[80vw] max-h-[80vh] overflow-y-auto !sm:max-w-[95vw] p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>
                {editingPopup ? "팝업 수정" : "새 팝업"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col lg:flex-row gap-6 px-6 pb-6">
              {/* 폼 섹션 */}
              <div className="flex-1">
                <form onSubmit={handleSubmit}>
                  <div className={pageStyles.formGroup}>
                    <label htmlFor="name" className={pageStyles.label}>
                      팝업 이름 *
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={pageStyles.input}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className={pageStyles.formGroup}>
                    <label htmlFor="description" className={pageStyles.label}>
                      설명
                    </label>
                    <textarea
                      id="description"
                      className={pageStyles.textarea}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>

                  <div className={pageStyles.formGroup}>
                    <label className={pageStyles.label}>템플릿 선택</label>
                    <div className={pageStyles.templateGrid}>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, template_type: "default" })}
                        className={`${pageStyles.templateOption} ${
                          formData.template_type === "default" ? pageStyles.selected : ""
                        }`}
                      >
                        <div className={`${pageStyles.templatePreview} ${pageStyles.gradientPreview}`}></div>
                        <div className={pageStyles.templateLabel}>그라데이션 템플릿</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, template_type: "dark" })}
                        className={`${pageStyles.templateOption} ${
                          formData.template_type === "dark" ? pageStyles.selected : ""
                        }`}
                      >
                        <div className={`${pageStyles.templatePreview} ${pageStyles.darkPreview}`}></div>
                        <div className={pageStyles.templateLabel}>다크 템플릿</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, template_type: "custom" })}
                        className={`${pageStyles.templateOption} ${
                          formData.template_type === "custom" ? pageStyles.selected : ""
                        }`}
                      >
                        <div className={pageStyles.templatePreview}>
                          {formData.template_image ? (
                            <img
                              src={formData.template_image}
                              alt="템플릿"
                              className={pageStyles.templateImage}
                            />
                          ) : (
                            <div className={pageStyles.customTemplatePlaceholder}>
                              커스텀
                            </div>
                          )}
                        </div>
                        <div className={pageStyles.templateLabel}>커스텀 템플릿</div>
                      </button>
                    </div>
                  </div>

                  {formData.template_type === "custom" && (
                    <div className={pageStyles.formGroup}>
                      <label className={pageStyles.label}>템플릿 이미지</label>
                      <div className={pageStyles.imageUploadContainer}>
                        {!formData.template_image ? (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, "template");
                              }}
                              disabled={uploading}
                              className={pageStyles.fileInput}
                              id="template-image-upload"
                            />
                            <label
                              htmlFor="template-image-upload"
                              className={pageStyles.uploadButton}
                            >
                              <Upload size={16} />
                              ↑ 템플릿 이미지 선택
                            </label>
                          </>
                        ) : (
                          <div className={pageStyles.imagePreview}>
                            <img
                              src={formData.template_image}
                              alt="템플릿 이미지"
                              className={pageStyles.previewImg}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, template_image: "" })
                              }
                              className={pageStyles.removeImageBtn}
                            >
                              ×
                            </button>
                          </div>
                        )}
                        {uploading && (
                          <div className={pageStyles.uploadingIndicator}>
                            업로드 중...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={pageStyles.formGroup}>
                    <label className={pageStyles.label}>중앙 이미지</label>
                    <div className={pageStyles.imageUploadContainer}>
                      {!formData.center_image ? (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "center");
                            }}
                            disabled={uploading}
                            className={pageStyles.fileInput}
                            id="center-image-upload"
                          />
                          <label
                            htmlFor="center-image-upload"
                            className={pageStyles.uploadButton}
                          >
                            <Upload size={16} />
                            ↑ 중앙 이미지 선택
                          </label>
                        </>
                      ) : (
                        <div className={pageStyles.imagePreview}>
                          <img
                            src={formData.center_image}
                            alt="중앙 이미지"
                            className={pageStyles.previewImg}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, center_image: "" })
                            }
                            className={pageStyles.removeImageBtn}
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {uploading && (
                        <div className={pageStyles.uploadingIndicator}>
                          업로드 중...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={pageStyles.formGroup}>
                    <label htmlFor="bottom_title" className={pageStyles.label}>
                      하단 제목
                    </label>
                    <textarea
                      id="bottom_title"
                      className={pageStyles.textarea}
                      value={formData.bottom_title}
                      onChange={(e) =>
                        setFormData({ ...formData, bottom_title: e.target.value })
                      }
                      rows={2}
                      placeholder="두 줄로 입력 가능합니다"
                    />
                  </div>

                  <div className={pageStyles.formGroup}>
                    <label htmlFor="bottom_subtitle" className={pageStyles.label}>
                      하단 부제목
                    </label>
                    <textarea
                      id="bottom_subtitle"
                      className={pageStyles.textarea}
                      value={formData.bottom_subtitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bottom_subtitle: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={pageStyles.formGroup}>
                    <label htmlFor="link_url" className={pageStyles.label}>
                      링크 URL (선택사항)
                    </label>
                    {/* #brochure/#partner 같은 특수값도 허용해야 하므로 type="url" 대신 text */}
                    <input
                      id="link_url"
                      type="text"
                      className={pageStyles.input}
                      value={formData.link_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          link_url: e.target.value,
                        })
                      }
                      placeholder="https://example.com 또는 /recruit 등"
                    />
                    <small style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>
                      팝업 클릭 시 이동할 URL을 입력하세요 (#brochure: 소개서
                      받기 팝업, #partner: 파트너 문의 팝업)
                    </small>
                  </div>

                  <div className={pageStyles.formGroup}>
                    <label htmlFor="display_order" className={pageStyles.label}>
                      표시 순서
                    </label>
                    <input
                      id="display_order"
                      type="number"
                      className={pageStyles.input}
                      value={formData.display_order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          display_order: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className={pageStyles.formGroup}>
                    <label className={pageStyles.checkboxLabel}>
                      <input
                        type="checkbox"
                        className={pageStyles.checkbox}
                        checked={formData.is_active}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_active: e.target.checked,
                          })
                        }
                      />
                      활성화
                    </label>
                  </div>

                  <div className={pageStyles.modalActions}>
                    <button
                      type="button"
                      className={pageStyles.cancelBtn}
                      onClick={() => {
                        setShowDialog(false);
                        resetForm();
                      }}
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className={pageStyles.saveBtn}
                      disabled={uploading}
                    >
                      {uploading && "업로드 중..."}
                      {!uploading && (editingPopup ? "수정" : "생성")}
                    </button>
                  </div>
                </form>
              </div>

              {/* 미리보기 섹션 */}
              <div className="lg:sticky lg:top-4">
                <div className="mb-3">
                  <Label className="text-base font-semibold">실시간 미리보기</Label>
                </div>
                <div className="relative flex items-center justify-center rounded-lg p-4" style={{ minHeight: "400px" }}>
                  {/* 실제 팝업과 완전히 동일한 구조 - 원본 PopupManager 전체 구조 참고 */}
                  <div className={popupStyles.popupContainerPreview} onClick={(e) => e.stopPropagation()}>
                    {/* 오늘 하루 안보기 버튼 - 팝업 컨테이너 내부 */}
                    <button 
                      className={popupStyles.hideTodayButton}
                      type="button"
                      disabled
                      style={{ cursor: "not-allowed", opacity: 0.6 }}
                    >
                      오늘 하루 안보기
                    </button>
                    
                    {/* 템플릿에 따른 배경 */}
                    <div
                      className={
                        formData.template_type === "custom" && formData.template_image
                          ? "" // 커스텀 이미지가 있으면 backgroundGradient 클래스 제거
                          : `${popupStyles.backgroundGradient} ${popupStyles[`template-${formData.template_type}`]}`
                      }
                      style={
                        formData.template_type === "custom" && formData.template_image
                          ? {
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundImage: `url('${formData.template_image}')`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center center",
                              backgroundSize: "contain",
                              zIndex: 1,
                            }
                          : {}
                      }
                    />

                    {/* 팝업 콘텐츠 */}
                    <div className={popupStyles.popupContent}>
                      {/* 닫기 버튼 */}
                      <button 
                        className={popupStyles.closeButton}
                        type="button"
                        disabled
                        style={{ cursor: "not-allowed", opacity: 0.6 }}
                      >
                        <X size={24} />
                      </button>

                      {/* 중앙 이미지 */}
                      {formData.center_image ? (
                        <div className={popupStyles.centerImageContainer}>
                          <img
                            src={formData.center_image}
                            alt="중앙 이미지"
                            className={popupStyles.centerImage}
                            onError={(e) => {
                              console.error("이미지 로드 실패:", formData.center_image);
                              // 이미지 로드 실패 시 플레이스홀더 표시
                              const container = e.currentTarget.parentElement;
                              if (container) {
                                container.innerHTML = `
                                  <div style="
                                    width: 100%; 
                                    height: 200px; 
                                    display: flex; 
                                    flex-direction: column;
                                    align-items: center; 
                                    justify-content: center;
                                    color: rgba(255,255,255,0.7);
                                    font-size: 14px;
                                    gap: 8px;
                                    text-align: center;
                                    padding: 20px;
                                  ">
                                    <div style="font-size: 24px;">⚠️</div>
                                    <div>이미지를 불러올 수 없습니다</div>
                                    <div style="font-size: 11px; opacity: 0.6; word-break: break-all;">
                                      Storage 정책을 확인하세요
                                    </div>
                                  </div>
                                `;
                              }
                            }}
                            onLoad={() => {
                              console.log("이미지 로드 성공:", formData.center_image);
                            }}
                          />
                        </div>
                      ) : (
                        <div className={popupStyles.centerImageContainer}>
                          <div style={{ 
                            width: "300px", 
                            height: "400px", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "14px",
                            borderRadius: "12px"
                          }}>
                            중앙 이미지 없음
                          </div>
                        </div>
                      )}

                      {/* 하단 텍스트 */}
                      {(formData.bottom_title || formData.bottom_subtitle) && (
                        <div className={popupStyles.bottomTextContainer}>
                          {formData.bottom_title && (
                            <h3 className={popupStyles.bottomTitle}>
                              {formData.bottom_title}
                            </h3>
                          )}
                          {formData.bottom_subtitle && (
                            <p className={popupStyles.bottomSubtitle}>
                              {formData.bottom_subtitle}
                            </p>
                          )}
                        </div>
                      )}

                      {/* 미리보기에서는 빈 공간 표시 */}
                      {!formData.center_image &&
                        !formData.bottom_title &&
                        !formData.bottom_subtitle && (
                          <div className="text-white text-center opacity-50 mt-8">
                            이미지나 텍스트를 입력하면 미리보기가 표시됩니다
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminAuthGuard>
  );
}

