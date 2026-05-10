export default function MembersPage() {
  return (
    <div>
      <p className="font-accent italic tracking-[0.3em] text-gold text-xs">
        MEMBERS
      </p>
      <h1 className="text-3xl mb-2">구성원</h1>
      <p className="text-sm text-ink-soft">
        구성원 목록·이름·교회 가입일만 표시. 메모·노트는 표시되지 않습니다.
      </p>

      <div className="mt-6 rounded-sm border border-ink/10 bg-paper">
        <div className="p-5 border-b border-ink/10 flex items-center justify-between">
          <span className="font-display">이름</span>
          <span className="font-accent italic text-gold text-[11px] tracking-widest">
            STATUS
          </span>
        </div>
        <p className="p-5 text-sm text-ink-soft">
          데이터 연결 후 자동으로 표시됩니다.
        </p>
      </div>
    </div>
  );
}
