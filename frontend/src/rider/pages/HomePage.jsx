import { useState } from 'react';
import {
  Power,
  MapPin,
  Navigation,
  Phone,
  Package,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const SAMPLE_JOBS = [
  {
    id: 'JB-3391',
    customer: 'Marta Jensen',
    pickup: 'Bakkerij Van Dijk, Coolsingel 42',
    dropoff: 'Witte de Withstraat 15',
    distance: '2.4 km',
    payout: '€6.20',
    items: 3,
  },
  {
    id: 'JB-3390',
    customer: 'Bram de Vries',
    pickup: 'Sushi Bar Rotterdam, Meent 88',
    dropoff: 'Kruisplein 8',
    distance: '1.8 km',
    payout: '€5.40',
    items: 1,
  },
  {
    id: 'JB-3389',
    customer: 'Sanne Bakker',
    pickup: 'Green Bowl, Nieuwe Binnenweg 60',
    dropoff: 'Lijnbaan 3',
    distance: '3.1 km',
    payout: '€7.10',
    items: 2,
  },
];

const JOB_STEPS = ['accepted', 'picked_up', 'delivered'];

const STEP_LABEL = {
  accepted: 'Head to pickup',
  picked_up: 'Deliver to customer',
  delivered: 'Delivered',
};

const NEXT_ACTION_LABEL = {
  accepted: 'Mark picked up',
  picked_up: 'Mark delivered',
};

function ActiveJobCard({ job, onAdvance, onComplete }) {
  const stepIndex = JOB_STEPS.indexOf(job.stage);

  return (
    <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-violet-400">Active job</span>
        <span className="text-xs text-muted">{job.id}</span>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {JOB_STEPS.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div
              className={`h-2 w-2 rounded-full shrink-0 ${
                i <= stepIndex ? 'bg-violet-400' : 'bg-panel2 border border-border'
              }`}
            />
            {i < JOB_STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 ${i < stepIndex ? 'bg-violet-400' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-ink font-medium">
        <Package size={16} className="text-violet-400" />
        {STEP_LABEL[job.stage]}
      </div>

      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex items-start gap-2">
          <MapPin size={15} className="text-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted">Pickup</p>
            <p className="text-ink">{job.pickup}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={15} className="text-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted">Dropoff</p>
            <p className="text-ink">{job.dropoff}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-panel2 px-3 py-2.5 text-sm font-medium text-ink hover:bg-panel transition-colors">
          <Navigation size={15} />
          Navigate
        </button>
        <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-panel2 px-3 py-2.5 text-sm font-medium text-ink hover:bg-panel transition-colors">
          <Phone size={15} />
        </button>
      </div>

      {job.stage === 'delivered' ? (
        <button
          onClick={onComplete}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-success px-4 py-2.5 text-sm font-medium text-white"
        >
          <CheckCircle2 size={16} strokeWidth={2.5} />
          Complete &amp; go online
        </button>
      ) : (
        <button
          onClick={onAdvance}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
        >
          {NEXT_ACTION_LABEL[job.stage]}
        </button>
      )}
    </div>
  );
}

function JobRow({ job, onAccept }) {
  return (
    <div className="rounded-lg border border-border bg-panel p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{job.id}</span>
        <span className="font-display text-sm font-semibold text-gold">{job.payout}</span>
      </div>
      <div className="flex flex-col gap-1.5 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <MapPin size={12} />
          {job.pickup}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={12} />
          {job.dropoff}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{job.distance} · {job.items} item{job.items > 1 ? 's' : ''}</span>
        <button
          onClick={() => onAccept(job)}
          className="rounded-lg bg-violet-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-violet-500 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeJob, setActiveJob] = useState(null);
  const [availableJobs, setAvailableJobs] = useState(SAMPLE_JOBS);

  const handleAccept = (job) => {
    setActiveJob({ ...job, stage: 'accepted' });
    setAvailableJobs((prev) => prev.filter((j) => j.id !== job.id));
  };

  const handleAdvance = () => {
    setActiveJob((prev) => {
      const idx = JOB_STEPS.indexOf(prev.stage);
      return { ...prev, stage: JOB_STEPS[idx + 1] };
    });
  };

  const handleComplete = () => {
    setActiveJob(null);
  };

  return (
    <div className="flex flex-col gap-5 max-w-md mx-auto">
      {/* Status header */}
      <div className="rounded-lg border border-border bg-panel p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center ${
              isOnline ? 'bg-success/10' : 'bg-panel2'
            }`}
          >
            <Power size={18} strokeWidth={2.5} className={isOnline ? 'text-success' : 'text-muted'} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{isOnline ? "You're online" : "You're offline"}</p>
            <p className="text-xs text-muted">{isOnline ? 'Receiving job requests' : 'Go online to start earning'}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOnline((v) => !v)}
          disabled={!!activeJob}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-50
            ${isOnline ? 'bg-success' : 'bg-panel2 border border-border'}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
              ${isOnline ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>

      {activeJob && (
        <ActiveJobCard job={activeJob} onAdvance={handleAdvance} onComplete={handleComplete} />
      )}

      {isOnline && !activeJob && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-ink">Available jobs</h2>
            <span className="flex items-center gap-1 text-xs text-muted">
              <Clock size={12} />
              Live
            </span>
          </div>
          {availableJobs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-10 flex flex-col items-center gap-2">
              <Package size={22} className="text-muted" />
              <p className="text-sm text-muted">No jobs nearby right now.</p>
            </div>
          ) : (
            availableJobs.map((job) => <JobRow key={job.id} job={job} onAccept={handleAccept} />)
          )}
        </div>
      )}

      {!isOnline && !activeJob && (
        <div className="rounded-lg border border-dashed border-border py-12 flex flex-col items-center gap-2 text-center">
          <Power size={22} className="text-muted" />
          <p className="text-sm text-muted">Go online to see available jobs.</p>
        </div>
      )}
    </div>
  );
}