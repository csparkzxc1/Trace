type Props = {
  label: string;
  value: string;
  sub?: string;
};

export function StatCard({ label, value, sub }: Props) {
  return (
    <div className="rounded-sm border border-ink/10 bg-paper p-5">
      <p className="font-accent italic tracking-[0.2em] text-gold text-[11px]">
        {label}
      </p>
      <p className="font-accent text-burgundy text-3xl mt-2">{value}</p>
      {sub ? <p className="text-xs text-ink-soft mt-2">{sub}</p> : null}
    </div>
  );
}
