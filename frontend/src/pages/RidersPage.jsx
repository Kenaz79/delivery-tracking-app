import { useMemo, useState } from 'react';
import {
  Search,
  Star,
  Phone,
  MapPin,
  Bike,
  Car,
  Zap,
  X,
  ChevronRight,
  Package,
  Clock,
} from 'lucide-react';

const VEHICLE_META = {
  bike: { icon: Bike, label: 'Bike' },
  scooter: { icon: Zap, label: 'Scooter' },
  car: { icon: Car, label: 'Car' },
};

const STATUS_META = {
  active: { label: 'On delivery', dot: 'bg-emerald-400', text: 'text-emerald-400' },
  idle: { label: 'Available', dot: 'bg-violet-400', text: 'text-violet-400' },
  offline: { label: 'Offline', dot: 'bg-muted', text: 'text-muted' },
};

// Fallback sample data — used only if no `riders` prop is passed in
// (e.g. while wiring up the API), so the page still renders something.
const SAMPLE_RIDERS = [
  {
    id: 'r1',
    name: 'Amara Osei',
    phone: '+31 6 1234 5678',
    zone: 'Amsterdam Centrum',
    vehicle: 'scooter',
    status: 'active',
    rating: 4.9,
    deliveries: 812,
    activeOrder: '#DL-2291',
    joined: 'Mar 2023',
  },
  {
    id: 'r2',
    name: 'Liam de Vries',
    phone: '+31 6 2345 6789',
    zone: 'Amsterdam Zuid',
    vehicle: 'bike',
    status: 'active',
    rating: 4.7,
    deliveries: 534,
    activeOrder: '#DL-2288',
    joined: 'Jan 2024',
  },
  {
    id: 'r3',
    name: 'Sofia Marín',
    phone: '+31 6 3456 7890',
    zone: 'Amsterdam West',
    vehicle: 'car',
    status: 'idle',
    rating: 4.8,
    deliveries: 1204,
    activeOrder: null,
    joined: 'Aug 2022',
  },
];

// Real rider objects from the API may not use these exact field names.
// This normalizes common alternates so the page degrades gracefully —
// adjust the right-hand accessors here if your API shape differs.
function normalizeRider(r) {
  return {
    id: r.id ?? r._id ?? r.riderId,
    name: r.name ?? r.fullName ?? 'Unknown rider',
    phone: r.phone ?? r.phoneNumber ?? '—',
    zone: r.zone ?? r.area ?? r.region ?? '—',
    vehicle: r.vehicle ?? r.vehicleType ?? 'bike',
    status: r.status ?? 'offline',
    rating: r.rating ?? r.avgRating ?? null,
    deliveries: r.deliveries ?? r.deliveryCount ?? r.completedDeliveries ?? 0,
    activeOrder: r.activeOrder ?? r.currentOrderId ?? null,
    joined: r.joined ?? r.joinedAt ?? r.createdAt ?? '—',
  };
}

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function RidersPage({ riders }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const RIDERS = useMemo(() => {
    if (riders && riders.length > 0) return riders.map(normalizeRider);
    return SAMPLE_RIDERS;
  }, [riders]);

  const filtered = useMemo(() => {
    return RIDERS.filter((r) => {
      const matchesQuery =
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.zone.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [RIDERS, query, statusFilter]);

  const stats = useMemo(() => {
    const active = RIDERS.filter((r) => r.status === 'active').length;
    const idle = RIDERS.filter((r) => r.status === 'idle').length;
    const ratedRiders = RIDERS.filter((r) => typeof r.rating === 'number');
    const avgRating = ratedRiders.length
      ? (ratedRiders.reduce((sum, r) => sum + r.rating, 0) / ratedRiders.length).toFixed(1)
      : '—';
    return { total: RIDERS.length, active, idle, avgRating };
  }, [RIDERS]);

  const selected = RIDERS.find((r) => r.id === selectedId) || null;

  return (
    <div className="flex min-h-full">
      <div className="flex-1 px-6 py-8 lg:px-10 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Riders
            </h1>
            <p className="text-sm text-muted mt-1">
              {stats.total} riders across your delivery network
            </p>
          </div>
          <button className="shrink-0 rounded-lg bg-violet-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-violet-500 transition-colors">
            Add rider
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total riders" value={stats.total} />
          <StatCard label="On delivery" value={stats.active} accent="emerald" />
          <StatCard label="Available" value={stats.idle} accent="violet" />
          <StatCard label="Avg rating" value={stats.avgRating} icon={Star} />
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search riders or zones"
              className="w-full rounded-lg bg-panel2 border border-border pl-9 pr-3 py-2.5 text-sm placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div className="flex gap-1.5 bg-panel2 border border-border rounded-lg p-1">
            {['all', 'active', 'idle', 'offline'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-violet-600 text-white'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {s === 'idle' ? 'Available' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Rider list */}
        <div className="rounded-xl border border-border bg-panel overflow-hidden">
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted">
              No riders match your search.
            </div>
          )}
          {filtered.map((rider, i) => {
            const VIcon = VEHICLE_META[rider.vehicle].icon;
            const status = STATUS_META[rider.status];
            return (
              <button
                key={rider.id}
                onClick={() => setSelectedId(rider.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-panel2 transition-colors
                  ${i !== filtered.length - 1 ? 'border-b border-border' : ''}
                  ${selectedId === rider.id ? 'bg-panel2' : ''}`}
              >
                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-gold flex items-center justify-center text-[13px] font-semibold text-panel">
                  {initials(rider.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{rider.name}</p>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    <span className={`text-xs ${status.text}`}>{status.label}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {rider.zone}
                    </span>
                    <span className="flex items-center gap-1">
                      <VIcon size={12} /> {VEHICLE_META[rider.vehicle].label}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-sm text-muted">
                  <Star size={13} className="text-gold fill-gold" />
                  {rider.rating ?? '—'}
                </div>

                <div className="hidden sm:block text-sm text-muted w-20 text-right">
                  {rider.deliveries} trips
                </div>

                <ChevronRight size={16} className="text-muted shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSelectedId(null)}
          />
          <aside className="fixed lg:static z-40 inset-y-0 right-0 w-80 shrink-0 border-l border-border bg-panel px-5 py-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-gold flex items-center justify-center text-sm font-semibold text-panel">
                  {initials(selected.name)}
                </div>
                <div>
                  <p className="font-display font-semibold text-[15px]">
                    {selected.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_META[selected.status].dot}`}
                    />
                    <span className={`text-xs ${STATUS_META[selected.status].text}`}>
                      {STATUS_META[selected.status].label}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-muted hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {selected.activeOrder && (
              <div className="mb-5 rounded-lg bg-panel2 border border-border px-3 py-2.5">
                <p className="text-xs text-muted mb-0.5">Current delivery</p>
                <p className="text-sm font-medium">{selected.activeOrder}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              <DetailStat icon={Star} label="Rating" value={selected.rating} />
              <DetailStat icon={Package} label="Deliveries" value={selected.deliveries} />
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow icon={Phone} label="Phone" value={selected.phone} />
              <DetailRow icon={MapPin} label="Zone" value={selected.zone} />
              <DetailRow
                icon={VEHICLE_META[selected.vehicle].icon}
                label="Vehicle"
                value={VEHICLE_META[selected.vehicle].label}
              />
              <DetailRow icon={Clock} label="Rider since" value={selected.joined} />
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 rounded-lg bg-violet-600 text-white text-sm font-medium py-2.5 hover:bg-violet-500 transition-colors">
                Message
              </button>
              <button className="flex-1 rounded-lg bg-panel2 border border-border text-sm font-medium py-2.5 hover:bg-panel transition-colors">
                View history
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }) {
  const accentText =
    accent === 'emerald'
      ? 'text-emerald-400'
      : accent === 'violet'
      ? 'text-violet-400'
      : 'text-ink';
  return (
    <div className="rounded-lg bg-panel border border-border px-4 py-3">
      <p className="text-xs text-muted mb-1">{label}</p>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-gold fill-gold" />}
        <p className={`text-lg font-semibold ${accentText}`}>{value}</p>
      </div>
    </div>
  );
}

function DetailStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-panel2 border border-border px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-muted mb-1">
        <Icon size={13} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted">
        <Icon size={14} />
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}