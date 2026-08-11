# Architecture

## 1. System overview

Three clients, one backend:

```
Rider app  ─┐
Customer app ─┼──▶ Backend API (REST + WebSocket) ──▶ SAP ByD (external)
Dashboard  ─┘                │
                              ├──▶ Database (Postgres / Firestore)
                              ├──▶ Realtime GPS layer (WebSocket / Firebase RTDB)
                              └──▶ Push notifications (FCM)
```

All three clients only ever talk to the backend — never directly to SAP ByD or to each
other. This keeps the SAP integration and the realtime logic in one place, and means the
frontend teams don't need to know anything about ByD's API.

## 2. Clients

### 2.1 Rider app (mobile)
- Log in, view assigned deliveries
- Accept a delivery → sends acknowledgment to backend
- Share live GPS location while a delivery is active
- Click-to-call button → opens native dialer with the customer's number
- Mark delivery as handed over

### 2.2 Customer app (mobile)
- Track assigned rider on a live map with ETA
- Click-to-call the rider
- "Received" button to confirm delivery
- Fallback: if the customer doesn't have the app, the rider can trigger a "received"
  confirmation from their own device on the customer's behalf

### 2.3 Management dashboard (responsive web)
- Live map of all active riders/deliveries
- Delivery list with status (assigned, in transit, delivered)
- Must render cleanly on a TV (large screen, low interaction), laptop, tablet, and phone
- Recommended: build one responsive layout rather than separate TV/mobile views —
  simplifies both the codebase and the judging demo

## 3. Backend API

A single Node.js service exposing:

- **REST endpoints** — auth, orders/deliveries CRUD, user management
- **WebSocket channel** — rider location pings, delivery status changes, "received" events

Suggested route grouping:

```
backend/src/
├── routes/
│   ├── auth.js
│   ├── deliveries.js
│   └── users.js
├── services/
│   ├── sap-byd-adapter/     ← isolated SAP integration, see 4.
│   ├── realtime.js          ← WebSocket location + status broadcasting
│   └── notifications.js     ← FCM push
├── models/
└── config/
```

## 4. SAP ByD integration

SAP Business ByDesign exposes delivery data via OData/SOAP. Keep this behind a single
adapter module so the rest of the backend never talks to SAP directly:

- `sap-byd-adapter/client.js` — authenticated OData/SOAP client (OAuth2)
- `sap-byd-adapter/mapper.js` — translates between your internal delivery object and
  ByD's delivery-note / destination fields
- `sap-byd-adapter/index.js` — public functions: `pushDeliveryNote()`, `fetchDestination()`

If the ByD contract changes, only this folder should need edits.

## 5. Realtime GPS tracking

- Rider app sends location updates (e.g. every 5–10s while a delivery is active) over
  WebSocket
- Backend broadcasts to the specific customer + dashboard subscribed to that delivery
  (room/channel keyed by delivery ID)
- ETA can be computed client-side (Google Maps Directions API) or server-side and pushed
  down with each location update

## 6. Data model (starting point)

- **User** — id, role (rider/customer/manager), name, phone, university ID (for riders,
  if applicable)
- **Delivery** — id, rider_id, customer_id, status, destination, SAP delivery-note ref,
  created_at, delivered_at
- **LocationPing** — delivery_id, lat, lng, timestamp (can live in the realtime layer
  rather than the main DB if volume is high)

## 7. Hosting

Given the project scale and budget, favor managed/free-tier services over self-managed
infrastructure:

- Firebase (Auth, Firestore, Cloud Functions, FCM, Hosting) for an all-in-one managed
  stack, **or**
- Supabase (Postgres + Auth + Realtime) + Render/Railway for the Node backend +
  Firebase Hosting for the dashboard

Both are free or near-free at pilot scale and satisfy the "secure, scalable cloud
platform" requirement without needing to manage servers.

## 8. Suggested build order (for the prototype)

1. Backend skeleton — auth, delivery CRUD, WebSocket scaffolding
2. Rider + Customer app shell (Flutter) — login, delivery list, map screen
3. Realtime location — wire up WebSocket, get live tracking working end to end
4. Management dashboard — list + map view, responsive layout
5. SAP ByD adapter — stub first with mock data, swap in real API once credentials/sandbox
   access are available
6. Click-to-call, push notifications, polish
