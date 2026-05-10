import { StatCard } from "@/components/StatCard";

export default function DashboardPage() {
  return (
    <div>
      <header className="mb-8">
        <p className="font-accent italic tracking-[0.3em] text-gold text-xs">
          DASHBOARD
        </p>
        <h1 className="text-3xl">한 눈에 보는 동행</h1>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="활성 구성원" value="—" sub="이번 주 흔적 1회 이상" />
        <StatCard label="흔적의 날 비율" value="—%" sub="구성원 평균 (4개+ 비율)" />
        <StatCard label="구역 수" value="—" sub="활성 구역만" />
        <StatCard label="공유 기도제목" value="—" sub="이번 주 새로 등록" />
      </div>

      <p className="mt-8 text-sm text-ink-soft leading-7">
        멤버의 메모·노트는 어떤 도구에서도 열람되지 않습니다. <br />
        대시보드의 모든 수치는 가시성 설정을 거친 집계뿐입니다.
      </p>
    </div>
  );
}
