// Talks to the backend's /api/deliveries and /api/users/riders endpoints.
// Falls back to mock data when VITE_API_URL isn't set, so the dashboard is fully
// demoable without a live backend — same pattern as the backend's SAP ByD adapter.

const API_URL = import.meta.env.VITE_API_URL;
const USE_MOCK = !API_URL;

const MOCK_RIDERS = [
  { id: 'r1', name: 'Amina K.', status: 'active', deliveries_today: 6 },
  { id: 'r2', name: 'Joseph M.', status: 'active', deliveries_today: 4 },
  { id: 'r3', name: 'Grace N.', status: 'idle', deliveries_today: 8 },
];

const MOCK_DELIVERIES = [
  { id: 'd1', customer: 'Fatuma S.', rider: 'Amina K.', status: 'in_transit', destination: 'Ntinda, Kampala', eta: '8 min', x: 62, y: 38 },
  { id: 'd2', customer: 'Peter O.', rider: 'Joseph M.', status: 'in_transit', destination: 'Bugolobi, Kampala', eta: '14 min', x: 30, y: 58 },
  { id: 'd3', customer: 'Ruth A.', rider: null, status: 'pending', destination: 'Kololo, Kampala', eta: '—', x: 48, y: 22 },
  { id: 'd4', customer: 'David K.', rider: 'Grace N.', status: 'delivered', destination: 'Nakawa, Kampala', eta: 'Delivered', x: 74, y: 66 },
  { id: 'd5', customer: 'Sarah L.', rider: 'Amina K.', status: 'accepted', destination: 'Muyenga, Kampala', eta: '21 min', x: 18, y: 30 },
];

async function apiFetch(path) {
  const token = localStorage.getItem('token'); // set after wiring in real login
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function fetchDeliveries() {
  if (USE_MOCK) return new Promise((resolve) => setTimeout(() => resolve(MOCK_DELIVERIES), 300));
  return apiFetch('/api/deliveries');
}

export async function fetchRiders() {
  if (USE_MOCK) return new Promise((resolve) => setTimeout(() => resolve(MOCK_RIDERS), 300));
  return apiFetch('/api/users/riders');
}

export const isMockMode = USE_MOCK;
