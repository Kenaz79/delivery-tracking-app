export default function StatCard({ label, value, accent = 'text-ink', icon: Icon }) {
  return (
    <div className="rounded-xl border border-border bg-panel px-5 py-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-muted font-medium mb-1.5">{label}</p>
        <p className={`font-display text-3xl font-semibold tabular ${accent}`}>{value}</p>
      </div>
      {Icon && (
        <div className="h-10 w-10 rounded-lg bg-panel2 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-muted" />
        </div>
      )}
    </div>
  );
}
