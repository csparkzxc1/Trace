import { StatCard } from "@/components/StatCard";
import { fetchDashboardStats } from "@/lib/queries";

const TEST_CHURCH_ID = process.env.NEXT_PUBLIC_DEMO_CHURCH_ID ?? "";

export default async function DashboardPage() {
  let stats: Awaited<ReturnType<typeof fetchDashboardStats>> | null = null;
  let err: string | null = null;
  if (TEST_CHURCH_ID) {
    try {
      stats = await fetchDashboardStats(TEST_CHURCH_ID);
    } catch (e) {
      err = e instanceof Error ? e.message : "데이터 조회 실패";
    }
  }

  const fmt = (n: number) => n.toLocaleString();
  const pct = (r: number) => `${Math.round(r * 100)}%`;

  return (
    <div>
      <header className="mb-8">
        <p className="font-accent italic tracking-[0.3em] text-gold text-xs">
          DASHBOARD
        </p>
        <h1 className="text-3xl">한 눈에 보는 동행</h1>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="활성 구성원"
          value={stats ? fmt(stats.activeMembers) : "—"}
          sub="이번 주 흔적 1회 이상"
        />
        <StatCard
          label="흔적의 날 비율"
          value={stats ? pct(stats.traceDayRate) : "—"}
          sub="구성원 평균 (4개+ 비율)"
        />
        <StatCard
          label="구역 수"
          value={stats ? fmt(stats.cellCount) : "—"}
          sub="활성 구역만"
        />
        <StatCard
          label="공유 기도제목"
          value={stats ? fmt(stats.sharedPrayers) : "—"}
          sub="이번 주 새로 등록"
        />
      </div>

      {err ? (
        <p className="mt-6 text-burgundy text-sm">⚠ {err}</p>
      ) : !TEST_CHURCH_ID ? (
        <p className="mt-6 text-ink-soft text-sm">
          NEXT_PUBLIC_DEMO_CHURCH_ID 환경변수를 설정하면 실제 데이터가 표시됩니다.
        </p>
      ) : null}

      <p className="mt-8 text-sm text-ink-soft leading-7">
        멤버의 메모·노트는 어떤 도구에서도 열람되지 않습니다. <br />
        대시보드의 모든 수치는 가시성 설정을 거친 집계뿐입니다.
      </p>
    </div>
  );
}
