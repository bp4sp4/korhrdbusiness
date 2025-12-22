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
  const isMainPage = pathname === '/';
  const isLoginPage = pathname === '/auth/login';

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
    devLog('팝업 숨김 체크:', { popupId, hideUntil });
    
    if (hideUntil) {
      const hideDate = new Date(hideUntil);
      const now = new Date();
      
      devLog('날짜 비교:', { 
        hideDate: hideDate.toISOString(), 
        now: now.toISOString(),
        shouldShow: hideDate > now 
      });
      
      // 숨겨진 날짜가 현재 시간보다 크면 팝업을 보여주지 않음 (false 반환)
      const shouldHide = hideDate > now;
      devLog('최종 판단:', { shouldHide, hideDate: hideDate.getTime(), now: now.getTime() });
      return !shouldHide; // shouldHide가 true면 false 반환 (팝업 숨김)
    }
    devLog('숨김 설정 없음, 팝업 표시');
    return true;
  };

  const handleHideToday = (popupId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const hideUntil = tomorrow.toISOString();
    
    devLog('오늘 하루 안보기 설정:', { popupId, hideUntil });
    
    // 모든 활성 팝업에 대해 오늘 하루 안보기 설정
    popups.forEach(popup => {
      localStorage.setItem(`popup_hide_${popup.id}`, hideUntil);
    });
    
    setShowPopup(false);
  };

  const loadActivePopups = async () => {
    try {
      devLog('팝업 로드 시작...', '현재 경로:', pathname);
      const response = await fetch('/api/popups');
      devLog('팝업 API 응답:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        devLog('팝업 데이터:', data);
        const activePopups = data.popups?.filter((popup: Popup) => popup.is_active) || [];
        devLog('활성 팝업:', activePopups);
        setPopups(activePopups);
        
        // 메인 페이지에서만 팝업 표시 (로그인 페이지 제외)
        const isMainPage = pathname === '/';
        const isLoginPage = pathname === '/auth/login';
        devLog('메인 페이지 여부:', isMainPage, '로그인 페이지 여부:', isLoginPage);
        
        if (activePopups.length > 0 && isMainPage && !isLoginPage) {
          // 오늘 하루 안보기 체크
          const visiblePopups = activePopups.filter((popup: Popup) => shouldShowPopup(popup.id));
          if (visiblePopups.length > 0) {
            devLog('팝업 표시:', visiblePopups.length, '개');
            setShowPopup(true);
          } else {
            devLog('오늘 하루 안보기로 설정된 팝업들');
            setShowPopup(false);
          }
        } else {
          devLog('활성 팝업이 없거나 메인 페이지가 아닙니다.');
          setShowPopup(false);
        }
      } else {
        devError('팝업 API 오류:', response.status);
      }
    } catch (error) {
      devError('팝업 로드 오류:', error);
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
        <div className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
          {/* 오늘 하루 안보기 버튼 - 팝업 컨테이너 내부 */}
          <button 
            className={styles.hideTodayButton} 
            onClick={() => handleHideToday(currentPopup.id)}
          >
            오늘 하루 안보기
          </button>
          {/* 템플릿에 따른 배경 */}
          <div 
            className={`${styles.backgroundGradient} ${styles[`template-${currentPopup.template_type}`]}`}
            style={currentPopup.template_type === "custom" && currentPopup.template_image ? {
              backgroundImage: `url('${currentPopup.template_image}')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: 'cover'
            } : {}}
          />

        {/* 팝업 콘텐츠 */}
        <div className={styles.popupContent}>
          {/* 닫기 버튼 */}
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={24} />
          </button>

          {/* 중앙 이미지 */}
          {currentPopup.center_image && (
            <div className={styles.centerImageContainer}>
              <img 
                src={currentPopup.center_image} 
                alt={currentPopup.name}
                className={styles.centerImage}
              />
            </div>
          )}

          {/* 하단 텍스트 */}
          {(currentPopup.bottom_title || currentPopup.bottom_subtitle) && (
            <div className={styles.bottomTextContainer}>
              {currentPopup.bottom_title && (
                <h3 className={styles.bottomTitle}>{currentPopup.bottom_title}</h3>
              )}
              {currentPopup.bottom_subtitle && (
                <p className={styles.bottomSubtitle}>{currentPopup.bottom_subtitle}</p>
              )}
            </div>
          )}

          {/* 네비게이션 (여러 팝업이 있을 때만 표시) */}
          {popups.length > 1 && (
            <>
              <button 
                className={styles.navButton} 
                onClick={handlePrev}
                style={{ left: '20px' }}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className={styles.navButton} 
                onClick={handleNext}
                style={{ right: '20px' }}
              >
                <ChevronRight size={24} />
              </button>
              
              {/* 페이지 인디케이터 */}
              <div className={styles.pageIndicators}>
                {popups.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${
                      index === currentPopupIndex ? styles.active : ''
                    }`}
                    onClick={() => setCurrentPopupIndex(index)}
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
