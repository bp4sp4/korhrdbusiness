-- recruit_applications 테이블 구조 수정
-- 기존 필드들을 nullable로 변경하여 기존 데이터와 호환성 유지
-- Supabase SQL Editor에서 실행하세요

-- 1. 선택적 필드들을 nullable로 변경
-- (이미 nullable인 경우 에러가 발생할 수 있지만 무시해도 됩니다)

-- email을 nullable로 변경
DO $$ 
BEGIN
  ALTER TABLE recruit_applications ALTER COLUMN email DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- birth_date를 nullable로 변경
DO $$ 
BEGIN
  ALTER TABLE recruit_applications ALTER COLUMN birth_date DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- cover_letter를 nullable로 변경
DO $$ 
BEGIN
  ALTER TABLE recruit_applications ALTER COLUMN cover_letter DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- resume_url을 nullable로 변경
DO $$ 
BEGIN
  ALTER TABLE recruit_applications ALTER COLUMN resume_url DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- portfolio_file_url을 nullable로 변경
DO $$ 
BEGIN
  ALTER TABLE recruit_applications ALTER COLUMN portfolio_file_url DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- portfolio_url을 nullable로 변경
DO $$ 
BEGIN
  ALTER TABLE recruit_applications ALTER COLUMN portfolio_url DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- website_url을 nullable로 변경 (이미 nullable일 수 있음)
DO $$ 
BEGIN
  ALTER TABLE recruit_applications ALTER COLUMN website_url DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- educations를 nullable로 변경
DO $$ 
BEGIN
  ALTER TABLE recruit_applications ALTER COLUMN educations DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- experiences를 nullable로 변경
DO $$ 
BEGIN
  ALTER TABLE recruit_applications ALTER COLUMN experiences DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 2. 필수 필드 확인
-- name, phone, address, introduction, status, consent, job_id, created_at는 필수로 유지

-- 3. 주석 추가 (선택사항)
COMMENT ON COLUMN recruit_applications.address IS '거주지 (서울, 경기/인천, 그외)';
COMMENT ON COLUMN recruit_applications.introduction IS '하고싶은말';

-- 참고: 
-- - 기존 데이터는 그대로 유지됩니다
-- - 새로운 지원서는 name, phone, address(거주지), introduction(하고싶은말), status, consent만 입력됩니다
-- - 이메일, 생년월일, 학력, 경력, 파일 첨부 등은 선택적 필드가 됩니다

