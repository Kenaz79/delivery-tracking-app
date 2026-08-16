import {
  Star,
  Package,
  Bike,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';

function SettingsRow({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-panel2 transition-colors"
    >
      <Icon size={17} className="text-muted" strokeWidth={2} />
      <span className="flex-1 text-sm text-ink">{label}</span>
      <ChevronRight size={16} className="text-muted" />
    </button>
  );
}

export default function ProfilePage() {
  const rider = {
    name: 'Youssef A.',
    email: 'youssef@deliveryco.com',
    vehicle: 'E-bike · Plate RT-4821',
    rating: 4.9,
    totalDeliveries: 612,
    memberSince: 'March 2024',
  };

  return (
    <div className="flex flex-col gap-5 max-w-md mx-auto">
      {/* Identity card */}
      <div className="rounded-lg border border-border bg-panel p-5 flex flex-col items-center text-center gap-2">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-gold flex items-center justify-center font-display text-lg font-semibold text-panel">
          {rider.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <p className="font-display text-base font-semibold text-ink">{rider.name}</p>
          <p className="text-xs text-muted">{rider.email}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold">
          <Star size={12} className="fill-gold" />
          {rider.rating} rating
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-panel px-4 py-3.5 flex flex-col gap-1">
          <span className="text-xs text-muted flex items-center gap-1.5">
            <Package size={12} />
            Deliveries
          </span>
          <span className="font-display text-xl font-semibold text-ink">{rider.totalDeliveries}</span>
        </div>
        <div className="rounded-lg border border-border bg-panel px-4 py-3.5 flex flex-col gap-1">
          <span className="text-xs text-muted">Member since</span>
          <span className="font-display text-xl font-semibold text-ink">{rider.memberSince}</span>
        </div>
      </div>

      {/* Vehicle */}
      <div className="rounded-lg border border-border bg-panel p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-panel2 flex items-center justify-center shrink-0">
          <Bike size={16} className="text-violet-400" />
        </div>
        <div>
          <p className="text-sm text-ink font-medium">Vehicle</p>
          <p className="text-xs text-muted">{rider.vehicle}</p>
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-lg border border-border bg-panel overflow-hidden divide-y divide-border">
        <SettingsRow icon={CreditCard} label="Payment details" />
        <SettingsRow icon={Bell} label="Notifications" />
        <SettingsRow icon={HelpCircle} label="Help & support" />
      </div>

      <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-rose-400/30 bg-rose-400/5 px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-400/10 transition-colors">
        <LogOut size={16} />
        Log out
      </button>
    </div>
  );
}