
# 모바일/데스크톱 반응형 이미지 적용 가이드

이 문서는 기존 데스크톱 이미지를 유지하면서 모바일 전용 이미지를 추가하는 방법을 안내합니다.

## 목표

- **데스크톱**: 기존 `about_main_banner.png` 이미지를 표시합니다.
- **모바일 (768px 미만)**: 새로 추가할 모바일용 이미지를 표시합니다.

## 해결 방법

Tailwind CSS의 반응형 `display` 유틸리티 (`hidden`, `block`, `md:hidden`, `md:block`)를 사용하여 두 개의 `<img>` 태그를 만들고, 화면 너비에 따라 각각의 이미지가 보이거나 숨겨지도록 제어합니다.

---

### 코드 수정 안내

아래와 같이 `motion.div` 내부에 있는 `<img>` 태그 부분을 수정합니다.

**수정 전:**

```tsx
<motion.div
  style={{ y: bgY }}
  className="absolute inset-0 w-full h-full z-0"
>
  <div className="absolute inset-0 w-full h-full z-0">
    <img
      src="/images/about/about_main_banner.png"
      alt="eduservice001"
      className="w-full h-full object-cover"
    />
  </div>
</motion.div>
```

**수정 후:**

```tsx
<motion.div
  style={{ y: bgY }}
  className="absolute inset-0 w-full h-full z-0"
>
  <div className="absolute inset-0 w-full h-full z-0">
    {/* 데스크톱용 이미지 (md 사이즈 이상에서 보임) */}
    <img
      src="/images/about/about_main_banner.png"
      alt="메인 배너 이미지"
      className="hidden md:block w-full h-full object-cover"
    />
    {/* 모바일용 이미지 (md 사이즈 미만에서 보임) */}
    <img
      src="/images/about/about_main_banner_mobile.png" // <-- 모바일 이미지 경로를 여기에 입력하세요.
      alt="모바일 메인 배너 이미지"
      className="block md:hidden w-full h-full object-cover"
    />
  </div>
</motion.div>
```

### 주요 변경 사항

1.  **데스크톱 이미지 (`<img>`)**
    - `className`에 `hidden md:block`을 추가했습니다.
    - `hidden`: 기본적으로(모바일에서) 숨겨집니다.
    - `md:block`: 화면 너비가 768px 이상(md)일 때 다시 보이게(`display: block`) 됩니다.

2.  **모바일 이미지 (`<img>`)**
    - 모바일용 이미지를 위한 `<img>` 태그를 새로 추가했습니다.
    - `className`에 `block md:hidden`을 추가했습니다.
    - `block`: 기본적으로(모바일에서) 보입니다.
    - `md:hidden`: 화면 너비가 768px 이상(md)일 때 숨겨집니다.

**중요**: 위 코드의 `src="/images/about/about_main_banner_mobile.png"` 부분은 예시 경로입니다. 실제 사용하실 모바일 이미지의 경로로 수정해 주세요.
