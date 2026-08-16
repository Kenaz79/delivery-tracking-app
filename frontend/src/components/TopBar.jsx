import { Menu, Search } from 'lucide-react';

export default function TopBar({ onMenuClick, mockMode }) {
  return (
    <header className="flex items-center justify-between gap-4 px-4 lg:px-8 py-4 border-b border-border">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-muted hover:bg-panel2"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-panel2 border border-border rounded-lg px-3 py-2 w-full max-w-xs">
          <Search size={15} className="text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search deliveries, riders…"
            className="bg-transparent text-sm placeholder:text-muted outline-none w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {mockMode && (
          <span className="hidden md:inline text-[11px] uppercase tracking-wide text-muted border border-border rounded-full px-2.5 py-1">
            Demo data
          </span>
        )}
        <div className="flex items-center gap-2 bg-panel2 border border-border rounded-full pl-2.5 pr-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-success" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-xs font-medium text-success">Live</span>
        </div>
      </div>
    </header>
  );
}
