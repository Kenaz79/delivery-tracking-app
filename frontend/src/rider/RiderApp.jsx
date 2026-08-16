import { useState } from 'react';
import BottomNav from './pages/BottomNav.jsx';
import HomePage from './pages/HomePage.jsx';
import EarningsPage from './pages/EarningsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const PAGES = {
  home: HomePage,
  earnings: EarningsPage,
  history: HistoryPage,
  profile: ProfilePage,
};

export default function RiderApp() {
  const [activeTab, setActiveTab] = useState('home');
  const ActivePage = PAGES[activeTab];

  return (
    <div className="min-h-screen bg-bg text-ink font-body flex flex-col">
      <main className="flex-1 px-4 py-5 pb-24">
        <ActivePage />
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}