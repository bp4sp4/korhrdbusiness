# 팝업 관리 시스템 사용 방법

## 개요
이 팝업 관리 시스템은 어드민만 사용할 수 있으며, 메인 페이지(`/`)에서 활성화된 팝업을 자동으로 표시합니다.

## 기능
- 팝업 생성, 수정, 삭제
- 이미지 업로드 (템플릿 배경 이미지, 중앙 이미지)
- 활성화/비활성화 제어
- 표시 순서 설정
- 여러 팝업 슬라이드 네비게이션
- "오늘 하루 안보기" 기능

## 데이터베이스 설정

### Supabase 테이블 생성

**중요**: 팝업 시스템을 사용하기 전에 반드시 데이터베이스 테이블을 생성해야 합니다!

1. **Supabase 대시보드 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택

2. **SQL Editor 열기**
   - 왼쪽 메뉴에서 "SQL Editor" 클릭
   - "New query" 클릭

3. **SQL 스크립트 실행**
   - 프로젝트 루트의 `supabase_popups_setup.sql` 파일 내용을 복사
   - SQL Editor에 붙여넣기
   - "Run" 버튼 클릭하여 실행

   또는 아래 SQL을 직접 실행:

```sql
-- popups 테이블 생성
CREATE TABLE IF NOT EXISTS popups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_type VARCHAR(50) DEFAULT 'default',
  template_image TEXT,
  center_image TEXT,
  bottom_title TEXT,
  bottom_subtitle TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE popups ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능 (팝업 조회용)
CREATE POLICY "Anyone can read popups"
  ON popups FOR SELECT
  USING (true);

-- 어드민만 쓰기 가능 (생성, 수정, 삭제)
CREATE POLICY "Only admins can insert popups"
  ON popups FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Only admins can update popups"
  ON popups FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Only admins can delete popups"
  ON popups FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.email = auth.jwt() ->> 'email'
    )
  );
```

**참고**: `supabase_popups_setup.sql` 파일에는 더 완전한 스크립트(트리거, 인덱스 포함)가 있습니다.

### Supabase Storage 설정

1. Supabase 대시보드 → Storage로 이동
2. `post-attachments` 버킷이 없으면 생성
3. `popups/` 폴더에 이미지가 저장됩니다

## 사용 방법

### 1. 어드민 로그인
- `/admin/login`에서 어드민 계정으로 로그인

### 2. 팝업 관리 페이지 접속
- `/admin/popups`로 이동
- 또는 사이드바에서 "팝업 관리" 클릭

### 3. 새 팝업 생성
1. "새 팝업" 버튼 클릭
2. 팝업 정보 입력:
   - **팝업 이름** (필수): 팝업을 식별할 이름
   - **설명**: 관리용 설명 (사용자에게 표시되지 않음)
   - **템플릿 타입**: 
     - `default`: 기본 그라데이션 배경
     - `custom`: 커스텀 배경 이미지 사용
   - **템플릿 배경 이미지** (custom 타입일 때): 팝업 배경 이미지
   - **중앙 이미지**: 팝업 중앙에 표시될 이미지
   - **하단 제목**: 팝업 하단에 표시될 제목
   - **하단 부제목**: 팝업 하단에 표시될 부제목
   - **표시 순서**: 숫자가 작을수록 먼저 표시 (같으면 생성일 기준)
   - **활성화**: 체크하면 메인 페이지에 표시됨
3. "생성" 버튼 클릭

### 4. 팝업 수정
1. 수정할 팝업의 "수정" 버튼 클릭
2. 정보 수정
3. "수정" 버튼 클릭

### 5. 팝업 삭제
1. 삭제할 팝업의 "삭제" 버튼 클릭
2. 확인 대화상자에서 "확인" 클릭

### 6. 이미지 업로드
1. "템플릿 배경 이미지" 또는 "중앙 이미지" 필드에서 파일 선택
2. 이미지가 자동으로 업로드되고 URL이 입력됨
3. 업로드된 이미지 미리보기 표시
4. X 버튼으로 이미지 제거 가능

## 팝업 표시 규칙

- **표시 위치**: 메인 페이지(`/`)에서만 표시
- **활성화 조건**: `is_active = true`인 팝업만 표시
- **표시 순서**: `display_order` 오름차순, 같으면 `created_at` 내림차순
- **오늘 하루 안보기**: 사용자가 "오늘 하루 안보기"를 클릭하면 24시간 동안 표시되지 않음
- **여러 팝업**: 여러 팝업이 활성화되어 있으면 슬라이드로 표시

## 템플릿 타입

### default
- 기본 파란색 그라데이션 배경
- `template_image` 필드는 무시됨

### custom
- `template_image`에 지정된 이미지를 배경으로 사용
- 이미지가 없으면 기본 배경 사용

## 팝업 구조

```
┌─────────────────────────┐
│  [오늘 하루 안보기] [X]  │
├─────────────────────────┤
│                         │
│      [중앙 이미지]       │
│                         │
│   [하단 제목]            │
│   [하단 부제목]          │
│                         │
│  [◀]  [●] [○] [○]  [▶] │
└─────────────────────────┘
```

## 주의사항

1. **이미지 크기**: 
   - 템플릿 배경 이미지: 권장 420x520px
   - 중앙 이미지: 최대 높이 300px (모바일 200px)

2. **파일 형식**: 
   - 지원 형식: JPEG, PNG, GIF, WebP, SVG, BMP
   - 최대 크기: 5MB

3. **활성화 관리**: 
   - 비활성화된 팝업은 메인 페이지에 표시되지 않지만 데이터는 유지됨
   - 삭제하면 영구적으로 제거됨

4. **표시 순서**: 
   - `display_order`가 같으면 최신순으로 표시
   - 숫자가 작을수록 먼저 표시

## API 엔드포인트

### 공개 (인증 불필요)
- `GET /api/popups` - 팝업 목록 조회
- `GET /api/popups/[id]` - 특정 팝업 조회

### 어드민 전용 (인증 필요)
- `POST /api/popups` - 새 팝업 생성
- `PUT /api/popups/[id]` - 팝업 수정
- `DELETE /api/popups/[id]` - 팝업 삭제
- `POST /api/popups/upload` - 이미지 업로드

## 문제 해결

### 팝업이 표시되지 않는 경우
1. `is_active`가 `true`인지 확인
2. 메인 페이지(`/`)에서만 표시되는지 확인
3. "오늘 하루 안보기"가 설정되어 있지 않은지 확인 (localStorage 확인)
4. 브라우저 콘솔에서 에러 확인

### 이미지가 업로드되지 않는 경우
1. Supabase Storage의 `post-attachments` 버킷이 존재하는지 확인
2. 파일 크기가 5MB 이하인지 확인
3. 지원되는 이미지 형식인지 확인
4. 어드민 권한이 있는지 확인

### API 오류가 발생하는 경우
1. 어드민으로 로그인되어 있는지 확인
2. 세션 토큰이 유효한지 확인
3. Supabase 환경 변수가 올바르게 설정되어 있는지 확인

