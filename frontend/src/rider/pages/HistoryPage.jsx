import { CheckCircle2, Star, MapPin } from 'lucide-react';

const HISTORY = [
  { id: 'JB-3388', date: 'Today, 10:12', dropoff: 'Lijnbaan 3', payout: '€6.80', distance: '0.8 km', rating: 5 },
  { id: 'JB-3387', date: 'Today, 09:40', dropoff: 'Mathenesserlaan 200', payout: '€8.10', distance: '5.1 km', rating: 5 },
  { id: 'JB-3386', date: 'Yesterday, 19:22', dropoff: 'Zwart Janstraat 9', payout: '€5.90', distance: '2.9 km', rating: 4 },
  { id: 'JB-3385', date: 'Yesterday, 18:05', dropoff: 'Nieuwe Binnenweg 112', payout: '€7.40', distance: '4.2 km', rating: 5 },
  { id: 'JB-3384', date: 'Yesterday, 12:47', dropoff: 'Kruisplein 8', payout: '€5.20', distance: '3.6 km', rating: 5 },
];

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-5 max-w-md mx-auto">
      <div>
        <h1 className="font-display text-xl font-semibold mb-1">History</h1>
        <p className="text-sm text-muted">Your completed deliveries.</p>
      </div>

      <ul className="flex flex-col gap-3">
        {HISTORY.map((job) => (
          <li key={job.id} className="rounded-lg border border-border bg-panel p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                <CheckCircle2 size={14} className="text-success" />
                {job.id}
              </span>
              <span className="font-display text-sm font-semibold text-gold">{job.payout}</span>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <MapPin size={12} />
              {job.dropoff}
            </p>
            <div className="flex items-center justify-between text-xs text-muted">
              <span>{job.date} · {job.distance}</span>
              <span className="inline-flex items-center gap-1">
                <Star size={12} className="text-gold fill-gold" />
                {job.rating}.0
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}