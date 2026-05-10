# Supabase — 흔적 · Trace

> CLAUDE.md §5 · §7.4 데이터 모델 + RLS 정책 구현.

## 마이그레이션

| 파일 | 내용 |
|---|---|
| `migrations/0001_initial_schema.sql` | 12개 테이블 + 인덱스 + updated_at 트리거 + 7대 카테고리 시드 |
| `migrations/0002_rls_policies.sql` | 모든 사용자 데이터 테이블 RLS + 보호 뷰 |

## 핵심 RLS 원칙 (§7.4)

1. **본인 데이터는 모두 읽기/쓰기.**
2. **구역 멤버는 가시성 설정에 따른 공유분만 읽기.**
   - `visibility_settings.share_total_only` 디폴트 `true` (총 개수만 공개)
   - 카테고리별 공개는 명시적 동의 필요
3. **구역장도 노트(`note`, `scripture_ref`, `answer_note`)는 절대 못 봄.**
   - 클라이언트에서는 `daily_checks_public` 뷰를 사용 (민감 컬럼 제외)
   - `prayer_journal_shared` 뷰는 `is_shared_to_cell=true`만 노출
4. **`hide_from_leader=true`이면 cell_leader 역할도 차단.**

## 로컬 적용

```bash
# Supabase 프로젝트 링크 후
supabase db push

# 또는 SQL 에디터에서 순서대로 실행
# 1) 0001_initial_schema.sql
# 2) 0002_rls_policies.sql
```

## 검증 체크리스트

- [ ] 다른 사용자 ID로 `select * from daily_checks where user_id = 'OTHER'` 차단되는가?
- [ ] 같은 구역에서 `share_total_only=true`일 때 카테고리별 row가 보여도 OK인가? (총합만 합산)
- [ ] `hide_from_leader=true`일 때 cell_leader 계정으로 데이터 접근 차단되는가?
- [ ] `prayer_journal.answer_note` 컬럼이 어떤 경로로도 외부 사용자에게 노출되지 않는가?
