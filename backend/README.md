# Backend API

Node.js + Express + Socket.io backend for the Delivery Tracking app. Handles auth,
delivery CRUD, realtime location/status broadcasting, and the SAP ByD integration.

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Set up Postgres.** Easiest path for a student project: create a free
   [Supabase](https://supabase.com) project and copy its connection string. Or run
   Postgres locally.

3. **Create the database schema**
   ```
   psql "$DATABASE_URL" -f schema.sql
   ```

4. **Configure environment variables**
   ```
   cp .env.example .env
   ```
   Fill in `DATABASE_URL` and generate a random `JWT_SECRET`. Leave `SAP_BYD_BASE_URL`
   blank for now — the SAP adapter automatically falls back to a mock that returns fake
   reference IDs, so the rest of the app works without live SAP credentials.

5. **Run it**
   ```
   npm run dev
   ```
   Server starts on `http://localhost:4000`. Check `GET /health` to confirm it's up.

## API

All endpoints except `/health`, `/api/auth/register`, and `/api/auth/login` require
`Authorization: Bearer <token>` (returned from register/login).

### Auth
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | `role, name, email, phone, password, universityId` | `universityId` required for riders |
| POST | `/api/auth/login` | `email, password` | |

### Deliveries
| Method | Path | Role | Notes |
|---|---|---|---|
| POST | `/api/deliveries` | customer, manager | Creates a delivery, pushes to SAP ByD in the background |
| GET | `/api/deliveries` | any | Manager sees all; rider/customer see their own |
| GET | `/api/deliveries/:id` | any | |
| POST | `/api/deliveries/:id/accept` | rider | Assigns the rider, notifies the customer |
| POST | `/api/deliveries/:id/status` | any | Body: `{ status }`, one of `in_transit`, `delivered`, `cancelled` |

### Users
| Method | Path | Role | Notes |
|---|---|---|---|
| GET | `/api/users/me` | any | |
| GET | `/api/users/riders` | manager | For the dashboard's rider list |

## Realtime (Socket.io)

Clients connect and:
- emit `delivery:subscribe` with a delivery ID to join that delivery's room
- rider app emits `rider:location` with `{ deliveryId, lat, lng, timestamp }`
- all subscribers receive `rider:location` broadcasts and `delivery:status` updates

## SAP ByD adapter

`src/services/sap-byd-adapter/index.js` isolates all SAP-specific logic. While
`SAP_BYD_BASE_URL` is unset it runs in mock mode — safe for local dev and demos. Once
you have sandbox credentials, fill in the `.env` values and implement the real OData
client in that file; nothing else in the codebase needs to change.

## What's stubbed vs real

- **Real**: auth (bcrypt + JWT), delivery CRUD, realtime location/status broadcasting,
  role-based access control
- **Mocked**: SAP ByD calls (returns fake reference IDs), push notifications (logs to
  console instead of sending via FCM)

Swapping the mocks for the real integrations is scoped to `sap-byd-adapter/index.js` and
`services/notifications.js` respectively — both isolated so the rest of the app doesn't
need to change.
