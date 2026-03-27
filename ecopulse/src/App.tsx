import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Analytics from './pages/Analytics';
import Prediction from './pages/Prediction';
import Simulation from './pages/Simulation';
import MapPage from './pages/Map';
import Reports from './pages/Reports';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
          <Sidebar />
          <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <TopBar />
            <main style={{ flex: 1, overflow: 'auto' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
