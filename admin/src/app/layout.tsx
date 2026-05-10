import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "흔적 · Trace · Admin",
  description: "교회 단위 영성훈련 운영 대시보드",
};

const NAV = [
  { href: "/dashboard", ko: "대시보드", en: "Dashboard" },
  { href: "/members", ko: "구성원", en: "Members" },
  { href: "/cells", ko: "구역", en: "Cells" },
  { href: "/trainings", ko: "훈련 항목", en: "Trainings" },
  { href: "/content", ko: "콘텐츠", en: "Content" },
  { href: "/analytics", ko: "통계", en: "Analytics" },
  { href: "/settings", ko: "설정", en: "Settings" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen flex">
          <aside className="w-60 border-r border-ink/10 bg-paper px-6 py-8">
            <Link href="/dashboard" className="flex flex-col">
              <span className="font-display text-2xl text-ink">흔적</span>
              <span className="font-accent italic text-gold tracking-[0.3em] text-xs mt-1">
                TRACE
              </span>
              <span className="font-body text-xs text-ink-soft mt-2">Admin</span>
            </Link>

            <nav className="mt-10 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-3 py-2 rounded-sm text-sm hover:bg-cream-deep"
                >
                  <span className="font-display">{n.ko}</span>
                  <span className="font-accent italic text-gold tracking-widest text-[10px] ml-2">
                    {n.en}
                  </span>
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1 px-10 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
