"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./PopupManager.module.css";

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

interface PopupManagerProps {
  onClose?: () => void;
}

export default function PopupManager({ onClose }: PopupManagerProps) {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    loadActivePopups();
  }, [pathname]);

  // 메인 페이지에서만 팝업 표시 (로그인 페이지 제외)
  const isLoginPage = pathname === "/admin/login";

  // 오늘 하루 안보기 체크
  const isDevelopment = process.env.NODE_ENV !== "production";

  const devLog = (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  };

  const devError = (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  };

  const shouldShowPopup = (popupId: string) => {
    const hideUntil = localStorage.getItem(`popup_hide_${popupId}`);
    devLog("팝업 숨김 체크:", { popupId, hideUntil });

    if (hideUntil) {
      const hideDate = new Date(hideUntil);
      const now = new Date();

      devLog("날짜 비교:", {
        hideDate: hideDate.toISOString(),
        now: now.toISOString(),
        shouldShow: hideDate > now,
      });

      // 숨겨진 날짜가 현재 시간보다 크면 팝업을 보여주지 않음 (false 반환)
      const shouldHide = hideDate > now;
      devLog("최종 판단:", {
        shouldHide,
        hideDate: hideDate.getTime(),
        now: now.getTime(),
      });
      return !shouldHide; // shouldHide가 true면 false 반환 (팝업 숨김)
    }
    devLog("숨김 설정 없음, 팝업 표시");
    return true;
  };

  const handleHideToday = (popupId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const hideUntil = tomorrow.toISOString();

    devLog("오늘 하루 안보기 설정:", { popupId, hideUntil });

    // 모든 활성 팝업에 대해 오늘 하루 안보기 설정
    popups.forEach((popup) => {
      localStorage.setItem(`popup_hide_${popup.id}`, hideUntil);
    });

    setShowPopup(false);
  };

  const loadActivePopups = async () => {
    try {
      devLog("팝업 로드 시작...", "현재 경로:", pathname);
      const response = await fetch("/api/popups");
      devLog("팝업 API 응답:", response.status, response.headers.get("content-type"));

      // Content-Type 확인
      const contentType = response.headers.get("content-type");
      let data;
      
      if (!contentType || !contentType.includes("application/json")) {
        devError("팝업 API가 JSON이 아닌 응답을 반환했습니다:", contentType);
        // HTML 응답인 경우 텍스트를 읽어서 확인
        if (contentType?.includes("text/html")) {
          const text = await response.text();
          devError("HTML 응답 내용 (처음 500자):", text.substring(0, 500));
          devError("API 라우트가 제대로 작동하지 않습니다. 개발 서버를 재시작하거나 /api/popups 경로를 확인하세요.");
          // HTML 응답을 받았으므로 빈 데이터로 처리
          data = { popups: [] };
        } else {
          // 다른 타입의 응답도 빈 데이터로 처리
          const text = await response.text();
          devError("응답 내용:", text.substring(0, 200));
          data = { popups: [] };
        }
      } else {
        // JSON 응답인 경우 파싱 시도
        try {
          data = await response.json();
        } catch (jsonError) {
          devError("JSON 파싱 오류:", jsonError);
          // 응답을 이미 읽었으므로 다시 읽을 수 없음
          data = { popups: [] };
        }
      }

      devLog("팝업 데이터:", data);
      
      // 에러가 있어도 popups 배열이 있으면 사용
      const popupsList: Popup[] = data.popups || [];
      const activePopups = popupsList.filter((popup) => popup.is_active);
      devLog("활성 팝업:", activePopups);
      setPopups(activePopups);

      if (!response.ok) {
        devError("팝업 API 오류:", response.status, data.error, data.details);
        // 테이블이 없거나 에러가 있어도 앱이 크래시되지 않도록 빈 배열로 설정
        if (popupsList.length === 0) {
          devLog("팝업 데이터가 없습니다. popups 테이블이 생성되었는지 확인하세요.");
        }
      }

      // 메인 페이지에서만 팝업 표시 (로그인 페이지 제외)
      const isMainPage = pathname === "/";
      const isLoginPage = pathname === "/admin/login";
      devLog("메인 페이지 여부:", isMainPage, "로그인 페이지 여부:", isLoginPage);

      if (activePopups.length > 0 && isMainPage && !isLoginPage) {
        // 오늘 하루 안보기 체크
        const visiblePopups = activePopups.filter((popup) =>
          shouldShowPopup(popup.id)
        );
        if (visiblePopups.length > 0) {
          devLog("팝업 표시:", visiblePopups.length, "개");
          setShowPopup(true);
        } else {
          devLog("오늘 하루 안보기로 설정된 팝업들");
          setShowPopup(false);
        }
      } else {
        devLog("활성 팝업이 없거나 메인 페이지가 아닙니다.");
        setShowPopup(false);
      }
    } catch (error) {
      devError("팝업 로드 오류:", error);
      // 에러가 발생해도 빈 배열로 설정하여 앱이 크래시되지 않도록
      setPopups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    onClose?.();
  };

  // 외부 클릭으로 팝업 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    devLog("팝업 외부 클릭 이벤트:", e.target, e.currentTarget);
    if (e.target === e.currentTarget) {
      devLog("외부 클릭으로 팝업 닫기");
      handleClose();
    }
  };

  const handleNext = () => {
    setCurrentPopupIndex((prev) => (prev + 1) % popups.length);
  };

  const handlePrev = () => {
    setCurrentPopupIndex((prev) => (prev - 1 + popups.length) % popups.length);
  };

  if (loading || !showPopup || popups.length === 0 || isLoginPage) {
    return null;
  }

  const currentPopup = popups[currentPopupIndex];

  return (
    <>
      <div className={styles.popupOverlay} onClick={handleOverlayClick}>
        <div
          className={`${styles.popupContainer} ${currentPopup.link_url ? styles.clickable : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            // 링크가 있으면 클릭 시 이동
            if (currentPopup.link_url) {
              window.location.href = currentPopup.link_url;
            }
          }}
          style={{
            cursor: currentPopup.link_url ? "pointer" : "default",
          }}
        >
          {/* 오늘 하루 안보기 버튼 - 팝업 컨테이너 내부 */}
          <button
            className={styles.hideTodayButton}
            onClick={(e) => {
              e.stopPropagation();
              handleHideToday(currentPopup.id);
            }}
          >
            오늘 하루 안보기
          </button>
          {/* 템플릿에 따른 배경 */}
          <div
            className={
              currentPopup.template_type === "custom" && currentPopup.template_image
                ? "" // 커스텀 이미지가 있으면 backgroundGradient 클래스 제거
                : `${styles.backgroundGradient} ${styles[`template-${currentPopup.template_type}`]}`
            }
            style={
              currentPopup.template_type === "custom" &&
              currentPopup.template_image
                ? {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url('${currentPopup.template_image}')`,
                    backgroundSize: "cover",
                    zIndex: 1,
                  }
                : {}
            }
          />

          {/* 팝업 콘텐츠 */}
          <div className={styles.popupContent}>
            {/* 닫기 버튼 */}
            <button 
              className={styles.closeButton} 
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
            >
              <X size={24} />
            </button>

            {/* 중앙 이미지 */}
            {currentPopup.center_image ? (
              <div className={styles.centerImageContainer}>
                <img
                  src={currentPopup.center_image}
                  alt={currentPopup.name}
                  className={styles.centerImage}
                  onError={(e) => {
                    console.error("이미지 로드 실패:", currentPopup.center_image);
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
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            ) : null}

            {/* 하단 텍스트 */}
            {(currentPopup.bottom_title || currentPopup.bottom_subtitle) && (
              <div className={styles.bottomTextContainer}>
                {currentPopup.bottom_title && (
                  <h3 className={styles.bottomTitle}>
                    {currentPopup.bottom_title}
                  </h3>
                )}
                {currentPopup.bottom_subtitle && (
                  <p className={styles.bottomSubtitle}>
                    {currentPopup.bottom_subtitle}
                  </p>
                )}
              </div>
            )}

            {/* 네비게이션 (여러 팝업이 있을 때만 표시) */}
            {popups.length > 1 && (
              <>
                <button
                  className={styles.navButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  style={{ left: "20px" }}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className={styles.navButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  style={{ right: "20px" }}
                >
                  <ChevronRight size={24} />
                </button>

                {/* 페이지 인디케이터 */}
                <div className={styles.pageIndicators}>
                  {popups.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.indicator} ${
                        index === currentPopupIndex ? styles.active : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPopupIndex(index);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

