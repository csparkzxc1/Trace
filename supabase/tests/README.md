# Supabase 통합 테스트 — 가시성 RLS

> §7.4 · §13 보안 정책 검증. 멤버 노트가 어떤 경로로도 외부에 유출되지 않음을 단주(端柱)하게 확인.

## 시나리오 (0001_visibility_rls.sql)

| # | 시나리오 | 기대 |
|---|---|---|
| 1 | 본인은 자기 daily_checks 모두 읽기 | 2 rows |
| 2a | 같은 구역 멤버 (share_total_only=true) 카운트 가능 | 2 rows |
| 2b | daily_checks_public 뷰로도 카운트 가능 | 2 rows |
| 3 | daily_checks_public 뷰에 note·scripture_ref 컬럼 부재 | 0 columns |
| 4 | 다른 구역에서 daily_checks 차단 | 0 rows |
| 4b | 다른 구역에서 daily_checks_public 뷰 차단 | 0 rows |
| 5a | 0004 후 같은 구역 리더가 daily_checks 본 테이블 차단 | 0 rows |
| 5b | daily_checks_public 뷰에 note 컬럼 부재로 직접 SELECT 거부 | undefined_column |
| 6 | hide_from_leader=true 시 cell_leader 차단 | 0 rows |
| 7 | 다른 구역에 격려 INSERT 차단 | exception |
| 7b | 같은 구역에 격려 INSERT 성공 | 1 row |
| 8 | 타인 user_id로 prayer_journal INSERT 차단 | exception |
| 8b | prayer_journal_shared는 is_shared_to_cell=true만 노출 | 1 row |
| 9 | 타인 visibility_settings UPDATE 차단 | 0 affected |
| 10 | 다른 구역에서 prayer_journal_shared 차단 | 0 rows |

## 실행

```bash
# 1) 로컬 Supabase 시작 (Docker 필요)
supabase start

# 2) 마이그레이션 적용 (db reset은 모든 데이터 삭제 주의)
supabase db reset

# 3) 통합 테스트 실행
psql "$(supabase status --output json | jq -r '.DB_URL')" \
  -f supabase/tests/0001_visibility_rls.sql
```

마지막 줄이 `=== 모든 가시성 RLS 시나리오 통과 ===` 이면 성공.
모든 변경은 트랜잭션 ROLLBACK 으로 되돌려진다.

## 시나리오 5 후속 — 0004 마이그레이션으로 적용 완료

`migrations/0004_column_grants.sql` 에서:
- `daily_checks` / `prayer_journal` 본 테이블의 같은 구역 SELECT 정책 제거
- `daily_checks_public` · `prayer_journal_shared` 뷰를 SECURITY DEFINER 로 운용,
  뷰 안에 가시성 로직 내장
- anon 역할의 본 테이블 SELECT 권한 명시 차단

→ 같은 구역 사용자는 뷰로만 접근, 노트·구절 컬럼은 물리적으로 노출되지 않음.

## CI 통합

GitHub Actions 예시:

```yaml
- name: Supabase RLS test
  run: |
    supabase start
    supabase db reset
    psql "$DB_URL" -f supabase/tests/0001_visibility_rls.sql
```
