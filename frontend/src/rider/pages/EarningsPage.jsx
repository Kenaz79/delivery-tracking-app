import { Wallet, TrendingUp } from 'lucide-react';

const DAILY = [
  { day: 'Mon', amount: 38.4 },
  { day: 'Tue', amount: 52.1 },
  { day: 'Wed', amount: 29.8 },
  { day: 'Thu', amount: 61.3 },
  { day: 'Fri', amount: 74.9 },
  { day: 'Sat', amount: 88.2 },
  { day: 'Sun', amount: 45.6 },
];

const maxAmount = Math.max(...DAILY.map((d) => d.amount));

export default function EarningsPage() {
  const weekTotal = DAILY.reduce((sum, d) => sum + d.amount, 0);
  const today = DAILY[DAILY.length - 1].amount;

  return (
    <div className="flex flex-col gap-5 max-w-md mx-auto">
      <div>
        <h1 className="font-display text-xl font-semibold mb-1">Earnings</h1>
        <p className="text-sm text-muted">Your payout summary.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-panel px-4 py-3.5 flex flex-col gap-1">
          <span className="text-xs text-muted flex items-center gap-1.5">
            <Wallet size={12} />
            Today
          </span>
          <span className="font-display text-2xl font-semibold text-ink">€{today.toFixed(2)}</span>
        </div>
        <div className="rounded-lg border border-border bg-panel px-4 py-3.5 flex flex-col gap-1">
          <span className="text-xs text-muted flex items-center gap-1.5">
            <TrendingUp size={12} />
            This week
          </span>
          <span className="font-display text-2xl font-semibold text-gold">€{weekTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-panel p-4 flex flex-col gap-4">
        <h2 className="font-display text-sm font-semibold text-ink">Last 7 days</h2>
        <div className="flex items-end justify-between gap-2 h-32">
          {DAILY.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-full rounded-t-md bg-violet-500/80"
                style={{ height: `${Math.max((d.amount / maxAmount) * 100, 6)}%` }}
              />
              <span className="text-[11px] text-muted">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-panel p-4 flex flex-col gap-3">
        <h2 className="font-display text-sm font-semibold text-ink">Payout details</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Base pay</span>
          <span className="text-ink">€198.40</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Tips</span>
          <span className="text-ink">€92.30</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Bonuses</span>
          <span className="text-ink">€99.60</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between text-sm font-medium">
          <span className="text-ink">Total</span>
          <span className="text-gold">€{weekTotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted mt-1">Next payout: Monday, straight to your linked bank account.</p>
      </div>
    </div>
  );
}