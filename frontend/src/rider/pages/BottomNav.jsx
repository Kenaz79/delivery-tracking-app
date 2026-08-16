import { Home, Wallet, History, User } from 'lucide-react';

const TABS = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'earnings', label: 'Earnings', icon: Wallet },
  { key: 'history', label: 'History', icon: History },
  { key: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-panel px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around max-w-md mx-auto">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex flex-col items-center justify-center gap-1 py-2.5 px-4 flex-1"
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-violet-400' : 'text-muted'}
              />
              <span className={`text-[11px] font-medium ${isActive ? 'text-violet-400' : 'text-muted'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}