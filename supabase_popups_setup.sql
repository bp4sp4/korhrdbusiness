-- 팝업 관리 시스템을 위한 Supabase 테이블 생성 스크립트
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요.

-- 1. popups 테이블 생성
CREATE TABLE IF NOT EXISTS popups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_type VARCHAR(50) DEFAULT 'default',
  template_image TEXT,
  center_image TEXT,
  bottom_title TEXT,
  bottom_subtitle TEXT,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기존 테이블에 link_url 컬럼 추가 (이미 테이블이 있는 경우)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'popups' AND column_name = 'link_url'
  ) THEN
    ALTER TABLE popups ADD COLUMN link_url TEXT;
  END IF;
END $$;

-- 2. updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. updated_at 자동 업데이트 트리거
DROP TRIGGER IF EXISTS update_popups_updated_at ON popups;
CREATE TRIGGER update_popups_updated_at
  BEFORE UPDATE ON popups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. RLS (Row Level Security) 활성화
ALTER TABLE popups ENABLE ROW LEVEL SECURITY;

-- 5. RLS 정책 생성
-- 모든 사용자가 읽기 가능 (팝업 조회용)
DROP POLICY IF EXISTS "Anyone can read popups" ON popups;
CREATE POLICY "Anyone can read popups"
  ON popups FOR SELECT
  USING (true);

-- 어드민만 쓰기 가능 (생성, 수정, 삭제)
-- 참고: API 라우트에서 서비스 역할 키를 사용하므로 RLS는 선택적입니다.
-- 하지만 추가 보안을 위해 RLS 정책을 설정할 수 있습니다.

DROP POLICY IF EXISTS "Only admins can insert popups" ON popups;
CREATE POLICY "Only admins can insert popups"
  ON popups FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.email = auth.jwt() ->> 'email'
    )
  );

DROP POLICY IF EXISTS "Only admins can update popups" ON popups;
CREATE POLICY "Only admins can update popups"
  ON popups FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.email = auth.jwt() ->> 'email'
    )
  );

DROP POLICY IF EXISTS "Only admins can delete popups" ON popups;
CREATE POLICY "Only admins can delete popups"
  ON popups FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.email = auth.jwt() ->> 'email'
    )
  );

-- 6. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_popups_is_active ON popups(is_active);
CREATE INDEX IF NOT EXISTS idx_popups_display_order ON popups(display_order);
CREATE INDEX IF NOT EXISTS idx_popups_created_at ON popups(created_at DESC);

-- 7. Storage 버킷 'post-attachments'의 공개 읽기 권한 설정
-- 팝업 이미지가 저장되는 경로: popups/*
-- 참고: Storage 정책은 Supabase 대시보드에서도 설정할 수 있습니다.

-- 팝업 이미지 공개 읽기 권한 (모든 사용자)
-- 주의: Storage 정책은 storage.objects 테이블에 대해 설정됩니다.
DROP POLICY IF EXISTS "Public read access for popup images" ON storage.objects;
CREATE POLICY "Public read access for popup images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'post-attachments' 
    AND name LIKE 'popups/%'
  );

-- 대안: Storage 대시보드에서 직접 설정하는 방법
-- 1. Supabase 대시보드 → Storage → post-attachments 버킷
-- 2. Policies 탭 클릭
-- 3. "New Policy" 클릭
-- 4. Policy name: "Public read access for popup images"
-- 5. Allowed operation: SELECT
-- 6. Policy definition:
--    (bucket_id = 'post-attachments' AND name LIKE 'popups/%')
-- 7. Save 클릭

-- 완료 메시지
SELECT 'popups 테이블이 성공적으로 생성되었습니다!' AS message;

