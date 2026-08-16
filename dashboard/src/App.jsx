import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ManagementApp from './management/ManagementApp.jsx';
import RiderApp from './rider/RiderApp.jsx';
import CustomerApp from './customer/CustomerApp.jsx';

// Each portal owns its own layout, nav, and pages under its route prefix.
// e.g. /management/deliveries, /rider/active-job, /customer/track/:orderId
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/management/*" element={<ManagementApp />} />
        <Route path="/rider/*" element={<RiderApp />} />
        <Route path="/customer/*" element={<CustomerApp />} />
        <Route path="*" element={<Navigate to="/management" replace />} />
      </Routes>
    </BrowserRouter>
  );
}