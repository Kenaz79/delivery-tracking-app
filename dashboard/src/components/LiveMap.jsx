// Stylized abstract street grid — not a real map (no API key needed for the prototype).
// Riders are positioned by the x/y percentages on each delivery record and pulse to
// signal live GPS movement, which is the core value proposition of the app.

const STATUS_DOT = {
  pending: 'bg-muted',
  accepted: 'bg-gold',
  in_transit: 'bg-violet-400',
  delivered: 'bg-success',
  cancelled: 'bg-danger',
};

function StreetGrid() {
  return (
    <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
      <rect width="400" height="260" fill="#171429" />
      {[40, 100, 160, 220, 280, 340].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="260" stroke="#2A2447" strokeWidth="1" />
      ))}
      {[30, 80, 130, 180, 230].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#2A2447" strokeWidth="1" />
      ))}
      <line x1="0" y1="0" x2="400" y2="180" stroke="#241F3D" strokeWidth="2" />
      <line x1="400" y1="0" x2="80" y2="260" stroke="#241F3D" strokeWidth="2" />
    </svg>
  );
}

export default function LiveMap({ deliveries }) {
  const active = deliveries.filter((d) => d.status !== 'cancelled');

  return (
    <div className="rounded-xl border border-border bg-panel overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="font-display font-semibold text-sm">Live map</h2>
        <span className="text-xs text-muted">{active.filter((d) => d.status === 'in_transit').length} riders moving</span>
      </div>

      <div className="relative h-72 lg:h-[26rem]">
        <StreetGrid />

        {active.map((d) => (
          <div
            key={d.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
          >
            {d.status === 'in_transit' && (
              <span className={`pulse-ring absolute inset-0 rounded-full ${STATUS_DOT[d.status]} opacity-60`} />
            )}
            <span
              className={`relative block h-3 w-3 rounded-full ring-2 ring-panel ${STATUS_DOT[d.status] || 'bg-muted'}`}
            />
            <div className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-panel2 px-2.5 py-1.5 text-xs opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-10">
              <p className="font-medium">{d.rider || 'Unassigned'}</p>
              <p className="text-muted">{d.destination}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 px-5 py-3 border-t border-border">
        {['pending', 'accepted', 'in_transit', 'delivered'].map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s]}`} />
            <StatusChipLabel status={s} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusChipLabel({ status }) {
  const map = { pending: 'Pending', accepted: 'Accepted', in_transit: 'In transit', delivered: 'Delivered' };
  return <span className="text-xs text-muted">{map[status]}</span>;
}
