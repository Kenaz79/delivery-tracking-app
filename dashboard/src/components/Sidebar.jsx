import { LayoutGrid, Package, Users, Settings, Truck } from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutGrid, label: 'Overview', active: true },
  { icon: Package, label: 'Deliveries' },
  { icon: Users, label: 'Riders' },
  { icon: Settings, label: 'Settings' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-60 shrink-0 border-r border-border bg-panel px-4 py-6 flex flex-col
          transform transition-transform lg:static lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-gold flex items-center justify-center">
            <Truck size={16} strokeWidth={2.5} className="text-panel" />
          </div>
          <span className="font-display font-semibold text-[15px] tracking-tight">
            Delivery Ops
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors
                ${active ? 'bg-violet-600/15 text-violet-400' : 'text-muted hover:bg-panel2 hover:text-ink'}`}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-3 py-3 rounded-lg bg-panel2 border border-border">
          <p className="text-xs text-muted leading-relaxed">
            Delivery Tracking App — Software Development Opportunity EOI prototype.
          </p>
        </div>
      </aside>
    </>
  );
}
