# Delivery Tracking Mobile App

Concept submission for the Software Development Opportunity: Delivery Tracking Mobile App
(Expression of Interest — Open to University Student Developers, Cloud-Based Solution, Concept & Prototype Competition).

## Overview

A cloud-based delivery tracking system with three user interfaces:

- **Rider app** — mobile, accepts deliveries, shares live GPS location, click-to-call customers
- **Customer app** — mobile, tracks rider in real time, confirms receipt with a "Received" button
- **Management dashboard** — responsive web app viewable on TV, laptop, tablet, and mobile

It integrates with **SAP Business ByDesign (ByD)** to capture delivery notes and destination
details, and hosts entirely on a secure, scalable cloud platform.

See [`docs/architecture.md`](docs/architecture.md) for the full system design.

## Repo structure

```
delivery-tracking-app/
├── docs/                    Architecture, API spec, SAP ByD integration notes
├── mobile/                  Flutter app (Rider + Customer, role-based)
├── dashboard/                React web app (Management dashboard)
├── backend/                 Node.js API (REST + WebSocket, SAP ByD adapter)
├── infra/                   Deployment configs
└── .github/workflows/       CI
```

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Mobile (Rider + Customer) | Flutter | Single codebase, both platforms, strong maps/GPS support |
| Dashboard | React + Tailwind | Fast to build responsive layouts for TV/laptop/tablet/mobile |
| Backend | Node.js + Express | REST + WebSocket in one lightweight service |
| Realtime | Socket.io / Firebase Realtime DB | Live rider location + status updates |
| Database | PostgreSQL (Supabase) or Firestore | Free tier covers a pilot; managed auth included |
| Push notifications | Firebase Cloud Messaging | Cross-platform, free |
| SAP ByD integration | OData/SOAP adapter service | Isolated module — see `backend/src/services/sap-byd-adapter` |
| Hosting | Firebase Hosting / Render / Railway | Free or low-cost tiers suit a student budget |

## Evaluation criteria this design targets

- Technical feasibility and architecture — 40%
- UI/UX quality of the prototype — 30%
- Innovation and value addition — 20%
- Realism of the delivery timeline — 10%

## Getting started

Each subfolder (`mobile/`, `dashboard/`, `backend/`) will get its own README with setup
instructions as the code is built out. This repo currently contains the concept note and
architecture documentation plus a starter folder structure.

## Status

🚧 Concept & prototype stage — submission for EOI.
