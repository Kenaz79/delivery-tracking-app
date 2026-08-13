export default function RidersPanel({ riders }) {
  return (
    <div className="rounded-xl border border-border bg-panel overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="font-display font-semibold text-sm">Riders</h2>
        <span className="text-xs text-muted">
          {riders.filter((r) => r.status === 'active').length} active
        </span>
      </div>
      <div className="divide-y divide-border">
        {riders.map((r) => (
          <div key={r.id} className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  r.status === 'active' ? 'bg-success' : 'bg-muted'
                }`}
              />
              <p className="text-sm font-medium">{r.name}</p>
            </div>
            <p className="text-xs text-muted tabular">{r.deliveries_today} today</p>
          </div>
        ))}
      </div>
    </div>
  );
}
