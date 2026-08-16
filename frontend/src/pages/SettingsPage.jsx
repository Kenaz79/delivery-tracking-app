import { useState } from 'react';
import {
  User,
  Bell,
  MapPin,
  Database,
  Check,
} from 'lucide-react';

function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <div className="rounded-lg border border-border bg-panel p-5 flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-panel2 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-violet-400" strokeWidth={2} />
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold text-ink">{title}</h2>
          {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-border bg-panel2 px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-violet-500/40"
    />
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 text-left"
    >
      <div>
        <p className="text-sm text-ink font-medium">{label}</p>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors
          ${checked ? 'bg-violet-600' : 'bg-panel2 border border-border'}`}
      >
        <span
          className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}`}
          style={{ height: 18, width: 18 }}
        />
      </span>
    </button>
  );
}

export default function SettingsPage({ mockMode = false }) {
  const [profile, setProfile] = useState({
    name: 'Ops Admin',
    email: 'ops@deliveryco.com',
    phone: '+31 6 1234 5678',
  });

  const [notifications, setNotifications] = useState({
    newDelivery: true,
    delayedDelivery: true,
    riderOffline: false,
    dailySummary: true,
  });

  const [preferences, setPreferences] = useState({
    autoAssign: true,
    defaultRadiusKm: 5,
    maxActivePerRider: 3,
  });

  const [savedAt, setSavedAt] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-[900px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold mb-1">Settings</h1>
          <p className="text-sm text-muted">Manage your account, notifications, and delivery defaults.</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {savedAt && (
            <span className="inline-flex items-center gap-1.5 text-xs text-success">
              <Check size={14} strokeWidth={2.5} />
              Saved at {savedAt}
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Profile */}
      <SectionCard icon={User} title="Profile" description="Your account details for this workspace.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full name">
            <TextInput
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <TextInput
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </Field>
          <Field label="Phone" hint="Used for urgent delivery alerts.">
            <TextInput
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </Field>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard icon={Bell} title="Notifications" description="Choose what you want to hear about, and when.">
        <Toggle
          label="New delivery placed"
          description="Get notified as soon as a customer places an order."
          checked={notifications.newDelivery}
          onChange={(v) => setNotifications({ ...notifications, newDelivery: v })}
        />
        <div className="h-px bg-border" />
        <Toggle
          label="Delivery delayed"
          description="Alert when a delivery passes its expected ETA."
          checked={notifications.delayedDelivery}
          onChange={(v) => setNotifications({ ...notifications, delayedDelivery: v })}
        />
        <div className="h-px bg-border" />
        <Toggle
          label="Rider goes offline mid-delivery"
          description="Alert if an assigned rider's status drops unexpectedly."
          checked={notifications.riderOffline}
          onChange={(v) => setNotifications({ ...notifications, riderOffline: v })}
        />
        <div className="h-px bg-border" />
        <Toggle
          label="Daily summary email"
          description="A recap of deliveries, delays, and rider activity each evening."
          checked={notifications.dailySummary}
          onChange={(v) => setNotifications({ ...notifications, dailySummary: v })}
        />
      </SectionCard>

      {/* Delivery preferences */}
      <SectionCard icon={MapPin} title="Delivery preferences" description="Defaults applied to new deliveries.">
        <Toggle
          label="Auto-assign riders"
          description="Automatically match new deliveries to the nearest available rider."
          checked={preferences.autoAssign}
          onChange={(v) => setPreferences({ ...preferences, autoAssign: v })}
        />
        <div className="h-px bg-border" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Default delivery radius" hint="Deliveries beyond this range need manual assignment.">
            <div className="flex items-center gap-2">
              <TextInput
                type="number"
                min="1"
                max="50"
                value={preferences.defaultRadiusKm}
                onChange={(e) => setPreferences({ ...preferences, defaultRadiusKm: e.target.value })}
              />
              <span className="text-sm text-muted shrink-0">km</span>
            </div>
          </Field>
          <Field label="Max active deliveries per rider">
            <TextInput
              type="number"
              min="1"
              max="10"
              value={preferences.maxActivePerRider}
              onChange={(e) => setPreferences({ ...preferences, maxActivePerRider: e.target.value })}
            />
          </Field>
        </div>
      </SectionCard>

      {/* Data */}
      <SectionCard icon={Database} title="Data" description="How this workspace is connected to live data.">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-ink font-medium">Mock mode</p>
            <p className="text-xs text-muted mt-0.5">
              {mockMode
                ? 'Using sample data instead of live deliveries and riders.'
                : 'Connected to live delivery and rider data.'}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
              ${mockMode ? 'bg-amber-400/10 text-amber-400' : 'bg-success/10 text-success'}`}
          >
            {mockMode ? 'Mock data' : 'Live'}
          </span>
        </div>
      </SectionCard>
    </form>
  );
}