import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { AIChatbot } from './components/chat/AIChatbot';
import { EmergencyAlertBanner } from './components/alerts/EmergencyAlertBanner';

import { DashboardPage } from './pages/DashboardPage';
import { RouteIntelligencePage } from './pages/RouteIntelligencePage';
import { LogisticsPlannerPage } from './pages/LogisticsPlannerPage';
import { OfficersPage } from './pages/OfficersPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ExplorePage } from './pages/ExplorePage';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeTab, theme } = useApp();
  const [showLogin, setShowLogin] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated && activeTab === 'login') {
      setShowLogin(true);
    }
  }, [isAuthenticated, activeTab]);


  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'routes':
        return <RouteIntelligencePage />;
      case 'logistics':
        return <LogisticsPlannerPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'officers':
        return <OfficersPage />;
      case 'explore':
        return <ExplorePage />;
      case 'login':
      case 'subscribe':
        return <LoginPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className={`app-shell min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${
      theme === 'dark'
        ? 'text-slate-100 selection:bg-cyan-500 selection:text-white'
        : 'text-slate-900 selection:bg-cyan-600 selection:text-white'
    }`}>
      {!isAuthenticated ? (
        showLogin ? (
          <div className="relative w-full min-h-screen">
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 left-4 z-50 p-2 bg-slate-200/50 hover:bg-slate-300/80 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
              title="Back to Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <LoginPage />
          </div>
        ) : (
          <LandingPage onLoginClick={() => setShowLogin(true)} />
        )
      ) : (
        <>
          {/* Top Header with Operational Modules Navbar, Language Selector, & Notification Center */}
          <Header />

      {/* Floating Emergency Alert Banner */}
      <EmergencyAlertBanner />

      {/* Main Full-Width Content Container */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-3 sm:py-4 pb-28 lg:pb-8 overflow-x-hidden min-w-0">
        <main className="w-full min-w-0">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Drawer and Fixed Bottom Nav */}
      <MobileNav />

      {/* Footer */}
      <Footer />

          {/* Floating AI Chatbot */}
          <AIChatbot />
        </>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
