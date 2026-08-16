# Management Dashboard

React + Vite + Tailwind. The "Management" interface from the brief — a live view of all
riders and deliveries, built to work on a TV, laptop, tablet, and phone.

## Setup

```
npm install
npm run dev
```

Opens on `http://localhost:5173`. It runs against built-in **demo data** out of the box —
no backend required to preview it.

## Connecting to the real backend

```
cp .env.example .env
```

Set `VITE_API_URL` to your running backend (e.g. `http://localhost:4000`). The dashboard
automatically switches from demo data to live `fetch` calls — see `src/api/deliveries.js`,
which mirrors the same mock/real-adapter pattern used in the backend's SAP ByD module.

You'll also need to store a JWT in `localStorage.setItem('token', ...)` after wiring up a
real login screen — the API layer already reads it from there.

## Structure

```
src/
├── api/deliveries.js       Data layer — demo data or live API, toggled by VITE_API_URL
├── components/
│   ├── Sidebar.jsx         Nav, collapses to a drawer on mobile
│   ├── TopBar.jsx          Search + the "Live" pulse indicator
│   ├── StatCard.jsx        Top metrics row
│   ├── LiveMap.jsx         Stylized live map with pulsing rider markers
│   ├── DeliveryQueue.jsx   Scrollable delivery list with status + click-to-call
│   ├── RidersPanel.jsx     Rider roster with online/idle state
│   └── StatusChip.jsx      Shared status-to-color mapping
└── App.jsx                 Layout + data fetching
```

## Design notes

- **Palette**: near-black violet background (`#121022`) with two accents — violet
  (`#8B5CF6`) and gold (`#F5B92E`) — picked up from the original EOI flyer's purple/gold
  branding, so the dashboard reads as part of the same product.
- **Type**: Sora for headings and stat figures, Inter for body/UI text, JetBrains Mono
  for delivery IDs — numbers get tabular figures throughout so the stat row doesn't jitter.
- **The live map is deliberately not a real map.** Wiring up Google Maps/Mapbox needs an
  API key and real GPS data, neither of which exist yet in the prototype. The stylized
  street-grid + pulsing markers communicates "live GPS tracking" as the product's core
  idea without requiring that dependency — swap in a real map component once the rider
  app is sending live coordinates.
- Built responsive down to a 390px mobile viewport: sidebar collapses to a drawer, stat
  grid drops to 2 columns, map/queue stack vertically.

## Known gaps (for the prototype stage)

- No real map/GPS — see above
- No login screen yet (dashboard assumes a manager token already exists)
- Click-to-call button doesn't yet trigger a call — hook it up to the rider's phone number
  once the API returns it
