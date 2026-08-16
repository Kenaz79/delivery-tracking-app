import { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  MapPin,
  Clock,
  Package,
  ChevronRight,
  CircleDot,
  CheckCircle2,
  AlertTriangle,
  Truck,
} from 'lucide-react';

const STATUS_META = {
  pending: { label: 'Pending', text: 'text-amber-400', bg: 'bg-amber-400/10', icon: CircleDot },
  accepted: { label: 'Accepted', text: 'text-violet-400', bg: 'bg-violet-400/10', icon: CircleDot },
  in_transit: { label: 'In transit', text: 'text-violet-400', bg: 'bg-violet-400/10', icon: Truck },
  delivered: { label: 'Delivered', text: 'text-success', bg: 'bg-success/10', icon: CheckCircle2 },
  delayed: { label: 'Delayed', text: 'text-rose-400', bg: 'bg-rose-400/10', icon: AlertTriangle },
};

const FALLBACK_META = { label: 'Unknown', text: 'text-muted', bg: 'bg-panel2', icon: CircleDot };

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'in_transit', label: 'In transit' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'delayed', label: 'Delayed' },
];

function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? FALLBACK_META;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.text}`}>
      <Icon size={12} strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

export default function DeliveriesPage({ deliveries = [] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const counts = useMemo(() => {
    return deliveries.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] ?? 0) + 1;
      return acc;
    }, {});
  }, [deliveries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deliveries.filter((d) => {
      const matchesFilter = filter === 'all' || d.status === filter;
      const matchesQuery =
        !q ||
        [d.id, d.customer, d.address, d.rider]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    });
  }, [deliveries, query, filter]);

  const selected = deliveries.find((d) => d.id === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold mb-1">Deliveries</h1>
          <p className="text-sm text-muted">Track every order from pickup to doorstep.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500 transition-colors self-start sm:self-auto">
          <Plus size={16} strokeWidth={2.5} />
          New delivery
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-panel px-4 py-3.5 flex flex-col gap-1">
          <span className="text-xs text-muted">Pending</span>
          <span className="font-display text-2xl font-semibold text-amber-400">{counts.pending ?? 0}</span>
        </div>
        <div className="rounded-lg border border-border bg-panel px-4 py-3.5 flex flex-col gap-1">
          <span className="text-xs text-muted">In transit</span>
          <span className="font-display text-2xl font-semibold text-violet-400">{counts.in_transit ?? 0}</span>
        </div>
        <div className="rounded-lg border border-border bg-panel px-4 py-3.5 flex flex-col gap-1">
          <span className="text-xs text-muted">Delivered</span>
          <span className="font-display text-2xl font-semibold text-success">{counts.delivered ?? 0}</span>
        </div>
        <div className="rounded-lg border border-border bg-panel px-4 py-3.5 flex flex-col gap-1">
          <span className="text-xs text-muted">Delayed</span>
          <span className="font-display text-2xl font-semibold text-rose-400">{counts.delayed ?? 0}</span>
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-panel2 border border-border p-1 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors
                ${filter === f.key ? 'bg-panel text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order, customer, rider…"
            className="w-full rounded-lg border border-border bg-panel py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
        </div>
      </div>

      {/* Content: list + detail panel */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
        <div className="rounded-lg border border-border bg-panel overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <Package size={28} className="text-muted" />
              <p className="text-sm text-muted">No deliveries match your filters.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => setSelectedId(d.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-panel2
                      ${selectedId === d.id ? 'bg-panel2' : ''}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-ink">{d.id}</span>
                        <StatusBadge status={d.status} />
                      </div>
                      <p className="text-sm text-muted truncate mt-0.5">
                        {[d.customer, d.address].filter(Boolean).join(' · ') || 'No details available'}
                      </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end text-xs text-muted shrink-0">
                      {d.eta && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {d.eta}
                        </span>
                      )}
                      {d.rider && <span>{d.rider}</span>}
                    </div>
                    <ChevronRight size={16} className="text-muted shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail panel */}
        <div className="rounded-lg border border-border bg-panel p-4">
          {!selected ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <MapPin size={22} className="text-muted" />
              <p className="text-sm text-muted">Select a delivery to see details.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-semibold text-ink">{selected.id}</span>
                  <StatusBadge status={selected.status} />
                </div>
                {selected.placedAt && <p className="text-xs text-muted mt-1">Placed at {selected.placedAt}</p>}
              </div>

              <div className="flex flex-col gap-3 text-sm">
                {selected.customer && (
                  <div>
                    <p className="text-xs text-muted mb-0.5">Customer</p>
                    <p className="text-ink font-medium">{selected.customer}</p>
                  </div>
                )}
                {selected.address && (
                  <div>
                    <p className="text-xs text-muted mb-0.5">Address</p>
                    <p className="text-ink">{selected.address}</p>
                  </div>
                )}
                {selected.rider && (
                  <div>
                    <p className="text-xs text-muted mb-0.5">Rider</p>
                    <p className="text-ink">{selected.rider}</p>
                  </div>
                )}
                <div className="flex gap-4">
                  {selected.distance && (
                    <div>
                      <p className="text-xs text-muted mb-0.5">Distance</p>
                      <p className="text-ink">{selected.distance}</p>
                    </div>
                  )}
                  {selected.eta && (
                    <div>
                      <p className="text-xs text-muted mb-0.5">ETA</p>
                      <p className="text-ink">{selected.eta}</p>
                    </div>
                  )}
                </div>
              </div>

              <button className="mt-1 w-full rounded-lg border border-border bg-panel2 px-3 py-2 text-sm font-medium text-ink hover:bg-panel transition-colors">
                Reassign rider
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}