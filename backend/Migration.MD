# Reorg: one app, three portals

## 1. Install the router
```
npm install react-router-dom
```

## 2. New structure
```
src/
  App.jsx                         <- root, routes /management, /rider, /customer
  portals/
    management/
      ManagementApp.jsx           <- was your old App.jsx
      components/                 <- MOVE your existing components here:
        Sidebar.jsx                  components/Sidebar.jsx      -> here
        TopBar.jsx                   components/TopBar.jsx       -> here
        StatCard.jsx                 components/StatCard.jsx     -> here
        LiveMap.jsx                  components/LiveMap.jsx      -> here
        DeliveryQueue.jsx            components/DeliveryQueue.jsx-> here
        RidersPanel.jsx              components/RidersPanel.jsx  -> here
      pages/
        OverviewPage.jsx           <- new, extracted from old App.jsx
        RidersPage.jsx              <- MOVE your existing pages/RidersPage.jsx here
        DeliveriesPage.jsx          <- already here (built earlier)
        SettingsPage.jsx            <- already here (built earlier)
      api/
        deliveries.js                <- MOVE your existing api/deliveries.js here
    rider/
      RiderApp.jsx                 <- placeholder, build out next
      components/                  <- empty, for rider-specific UI later
      pages/                       <- empty, for rider-specific pages later
    customer/
      CustomerApp.jsx              <- placeholder, build out next
      components/
      pages/
  shared/
    ui/                            <- put any cross-portal primitives here later
                                       (e.g. a Button, Badge, Card if you want
                                       Rider/Customer to reuse Management's look)
    api/                           <- put a shared fetch/client wrapper here later
                                       if Rider/Customer hit the same backend
```

## 3. What to do
1. Copy your real `components/*.jsx` files into `src/portals/management/components/`.
2. Copy your real `pages/RidersPage.jsx` into `src/portals/management/pages/`.
3. Copy your real `api/deliveries.js` into `src/portals/management/api/`.
4. Delete the old top-level `App.jsx`, `components/`, `pages/`, `api/` once confirmed working.
5. Point your entry file (`main.jsx`) at the new root `src/App.jsx`.

## 4. Why this shape
- Each portal (`management`, `rider`, `customer`) is self-contained: its own layout, its own pages,
  its own local nav — nothing shared unless you deliberately lift it into `shared/`.
- The root `App.jsx` only decides *which portal* to show, based on the URL
  (`/management/...`, `/rider/...`, `/customer/...`).
- Management's internal navigation (Overview/Deliveries/Riders/Settings) is unchanged —
  still local `activePage` state driving your existing `Sidebar`, just now living one level
  deeper in the folder tree.
- If Rider or Customer ever need real routes of their own (e.g. `/rider/jobs/:id`), add
  `react-router-dom` `<Routes>` inside their own `*App.jsx` — the root router already
  forwards anything under `/rider/*` to `RiderApp`.

## 5. Not done yet (on purpose)
- No auth/role-gating between portals — right now anyone can visit any URL. Worth adding
  before this goes further than a prototype.
- Rider and Customer are empty shells — say the word when you're ready to build either one out.