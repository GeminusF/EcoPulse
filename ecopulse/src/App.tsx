import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { SearchProvider } from './context/SearchContext';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import SearchDropdown from './components/layout/SearchDropdown';
import WelcomeModal from './components/shared/WelcomeModal';
import OnboardingTooltip from './components/shared/OnboardingTooltip';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Analytics from './pages/Analytics';
import Prediction from './pages/Prediction';
import Simulation from './pages/Simulation';
import MapPage from './pages/Map';
import Reports from './pages/Reports';
import VisionLayout from './pages/vision/VisionLayout';
import VisionOverview from './pages/vision/VisionOverview';
import VisionGapAnalysis from './pages/vision/VisionGapAnalysis';
import VisionRoadmap from './pages/vision/VisionRoadmap';
import VisionMegaProjects from './pages/vision/VisionMegaProjects';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { Outlet } from 'react-router-dom';

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { showWelcome, dismissWelcome, skipTour } = useOnboarding();

  useKeyboardShortcuts();

  return (
    <>
      {showWelcome && <WelcomeModal onDismiss={dismissWelcome} onSkip={skipTour} />}
      <OnboardingTooltip />
      <SearchDropdown />

      <div className="flex min-h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-auto" role="main">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/vision" element={<VisionLayout />}>
          <Route index element={<VisionOverview />} />
          <Route path="gap_analysis" element={<VisionGapAnalysis />} />
          <Route path="roadmap" element={<VisionRoadmap />} />
          <Route path="mega_projects" element={<VisionMegaProjects />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <ToastProvider>
        <NotificationProvider>
          <BrowserRouter>
            <SearchProvider>
              <OnboardingProvider>
                <AppRoutes />
              </OnboardingProvider>
            </SearchProvider>
          </BrowserRouter>
        </NotificationProvider>
      </ToastProvider>
    </SettingsProvider>
  );
}
