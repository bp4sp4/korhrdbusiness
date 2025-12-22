# Supabase Storage 정책 설정 가이드

## 문제
이미지 업로드는 성공하지만, 공개 URL 접근 시 400 Bad Request 오류가 발생합니다.

## 해결 방법

### 방법 1: Supabase 대시보드에서 직접 설정 (권장)

1. **Supabase 대시보드 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택

2. **Storage 버킷 확인**
   - 왼쪽 메뉴에서 **Storage** 클릭
   - `post-attachments` 버킷이 있는지 확인
   - 없으면 생성 (Public 버킷으로 설정)

3. **Storage 정책 설정**
   - `post-attachments` 버킷 클릭
   - **Policies** 탭 클릭
   - **New Policy** 버튼 클릭

4. **정책 생성**
   - **Policy name**: `Public read access for popup images`
   - **Allowed operation**: `SELECT` 선택
   - **Policy definition** (SQL):
     ```sql
     (bucket_id = 'post-attachments' AND name LIKE 'popups/%')
     ```
   - **Save** 클릭

5. **버킷 공개 설정 확인**
   - Storage → `post-attachments` 버킷
   - 버킷이 **Public**으로 설정되어 있는지 확인
   - Public이 아니면 버킷 설정에서 Public으로 변경

### 방법 2: SQL Editor에서 실행

1. **Supabase 대시보드 → SQL Editor**
2. 다음 SQL 실행:

```sql
-- Storage 정책 생성
DROP POLICY IF EXISTS "Public read access for popup images" ON storage.objects;
CREATE POLICY "Public read access for popup images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'post-attachments' 
    AND name LIKE 'popups/%'
  );
```

## 확인 방법

1. 이미지를 다시 업로드
2. 서버 로그에서 "URL 접근 가능 여부" 확인
3. 브라우저에서 이미지 URL 직접 접근 테스트
4. 정상적으로 이미지가 표시되면 성공!

## 추가 확인 사항

- 버킷 이름이 정확히 `post-attachments`인지 확인
- 파일 경로가 `popups/`로 시작하는지 확인
- Storage 정책이 활성화되어 있는지 확인

