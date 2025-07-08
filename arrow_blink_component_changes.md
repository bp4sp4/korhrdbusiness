
# `ArrowBlink` 컴포넌트 및 부모 요소 CSS 수정 가이드

이 문서는 "한평생 에듀바이저의 시작" 텍스트 아래에 화살표 애니메이션이 올바르게 위치하도록 코드를 수정하는 방법을 안내합니다.

## 문제점

기존 코드는 `ArrowBlink` 컴포넌트의 위치를 화면 하단(`bottom`)을 기준으로 고정하여, 함께 있는 텍스트와의 간격이 화면 크기에 따라 달라지는 문제가 있었습니다.

## 해결 방법

텍스트와 화살표를 감싸는 부모 `div`를 **위치 기준점(`relative`)**으로 만들고, `ArrowBlink` 컴포넌트의 위치를 해당 기준점 바로 아래(`absolute top-full`)로 설정하여 문제를 해결합니다.

---

### 1단계: 부모 컴포넌트 수정

`ArrowBlink` 컴포넌트를 사용하는 파일(예: `src/app/page.tsx`)에서, 텍스트와 화살표를 감싸는 `div`에 `relative` 클래스를 추가합니다.

**수정 전:**
```tsx
<div className="flex items-center justify-center gap-2">
  {/* ... */}
  <ArrowBlink />
</div>
```

**수정 후:**
```tsx
<div className="relative flex items-center justify-center gap-2">
  <img
    src="/images/logo2.png"
    className="w-[31px] h-[27px] md:w-[31px] md:h-[27px] hidden md:block"
    alt="로고"
  />
  <span className="text-white text-[14px] md:text-2xl font-bold">
    한평생 에듀바이저의 시작
  </span>
  <ArrowBlink />
</div>
```

---

### 2단계: `ArrowBlink` 컴포넌트 수정

`ArrowBlink` 컴포넌트 파일(예: `src/components/ArrowBlink.tsx`)의 `<span>` 태그 클래스를 수정하여 위치를 조정합니다.

**수정 전:**
```tsx
<span className="absolute bottom-10 md:bottom-5 left-1/2 -translate-x-1/2 w-[22px] h-[30px]">
  {/* ... */}
</span>
```

**수정 후:**
```tsx
// src/components/ArrowBlink.tsx

import { useState, useEffect } from "react";
import Image from "next/image";

function ArrowBlink() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    // 'top-full'을 사용하여 부모 요소 바로 아래에 위치시키고, 'mt-4'로 여백을 줍니다.
    <span className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[22px] h-[30px]">
      <Image
        src="/images/main/arrow_action.png"
        width={22}
        height={11}
        alt="활성 화살표"
        className={`absolute top-0 left-0 transition-all ease-in-out duration-[2000ms] ${
          active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2.5"
        }`}
      />
      <Image
        src="/images/main/arrow_beaction.png"
        width={22}
        height={11}
        alt="비활성 화살표"
        className={`absolute top-0 left-0 transition-all ease-in-out duration-[2000ms] ${
          !active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
        }`}
      />
    </span>
  );
}

export default ArrowBlink;
```

### 요약

- **부모 `div`**: `relative` 클래스 추가
- **`ArrowBlink` `span`**: `absolute top-full mt-4 ...` 로 클래스 변경

이렇게 수정하면 화살표가 항상 텍스트 바로 아래에 위치하여 모든 화면에서 일관된 디자인을 유지할 수 있습니다.
