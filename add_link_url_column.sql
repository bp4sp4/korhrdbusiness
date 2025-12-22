-- popups 테이블에 link_url 컬럼 추가
-- 이미 테이블이 존재하는 경우에만 실행하세요.

-- link_url 컬럼이 없으면 추가
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'popups' AND column_name = 'link_url'
  ) THEN
    ALTER TABLE popups ADD COLUMN link_url TEXT;
    RAISE NOTICE 'link_url 컬럼이 성공적으로 추가되었습니다.';
  ELSE
    RAISE NOTICE 'link_url 컬럼이 이미 존재합니다.';
  END IF;
END $$;

