import StatusChip from './StatusChip.jsx';
import { Phone } from 'lucide-react';

export default function DeliveryQueue({ deliveries }) {
  return (
    <div className="rounded-xl border border-border bg-panel overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="font-display font-semibold text-sm">Delivery queue</h2>
        <span className="text-xs text-muted">{deliveries.length} total</span>
      </div>

      <div className="overflow-y-auto max-h-72 lg:max-h-[26rem] divide-y divide-border">
        {deliveries.length === 0 && (
          <p className="px-5 py-8 text-sm text-muted text-center">No deliveries yet.</p>
        )}
        {deliveries.map((d) => (
          <div key={d.id} className="px-5 py-3.5 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium truncate">{d.customer}</p>
                <span className="text-[11px] text-muted font-mono shrink-0">#{d.id}</span>
              </div>
              <p className="text-xs text-muted truncate">{d.destination}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <StatusChip status={d.status} />
                {d.rider && <span className="text-xs text-muted">· {d.rider}</span>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-xs text-muted tabular">{d.eta}</span>
              {d.rider && (
                <button
                  className="p-1.5 rounded-md border border-border text-muted hover:text-violet-400 hover:border-violet-400 transition-colors"
                  aria-label={`Call rider for delivery ${d.id}`}
                >
                  <Phone size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
