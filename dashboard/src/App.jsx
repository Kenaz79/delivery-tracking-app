import { useEffect, useState } from 'react';
import { Package, Users, Clock, CheckCircle2 } from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import StatCard from './components/StatCard.jsx';
import LiveMap from './components/LiveMap.jsx';
import DeliveryQueue from './components/DeliveryQueue.jsx';
import RidersPanel from './components/RidersPanel.jsx';
import { fetchDeliveries, fetchRiders, isMockMode } from './api/deliveries.js';

export default function App() {
  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    Promise.all([fetchDeliveries(), fetchRiders()])
      .then(([d, r]) => {
        setDeliveries(d);
        setRiders(r);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeCount = deliveries.filter((d) => d.status === 'in_transit' || d.status === 'accepted').length;
  const deliveredToday = deliveries.filter((d) => d.status === 'delivered').length;
  const ridersOnline = riders.filter((r) => r.status === 'active').length;

  return (
    <div className="flex h-screen bg-bg text-ink font-body">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} mockMode={isMockMode} />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          {loading ? (
            <p className="text-sm text-muted">Loading deliveries…</p>
          ) : (
            <div className="flex flex-col gap-6 max-w-[1400px]">
              <div>
                <h1 className="font-display text-xl font-semibold mb-1">Overview</h1>
                <p className="text-sm text-muted">Live status across all riders and deliveries.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Active deliveries" value={activeCount} icon={Package} accent="text-violet-400" />
                <StatCard label="Riders online" value={ridersOnline} icon={Users} accent="text-gold" />
                <StatCard label="Avg. ETA" value="12 min" icon={Clock} />
                <StatCard label="Delivered today" value={deliveredToday} icon={CheckCircle2} accent="text-success" />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
                <LiveMap deliveries={deliveries} />
                <DeliveryQueue deliveries={deliveries} />
              </div>

              <RidersPanel riders={riders} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
