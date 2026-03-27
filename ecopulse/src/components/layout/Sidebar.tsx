import { NavLink } from 'react-router-dom';
import {
  Leaf,
  LayoutDashboard,
  Calculator,
  BarChart2,
  Brain,
  Cpu,
  Map,
  FileText,
  DownloadCloud,
} from 'lucide-react';
import CarbonReduction from '../dashboard/CarbonReduction';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Calculator, label: 'Calculator', to: '/calculator' },
  { icon: BarChart2, label: 'Analytics', to: '/analytics' },
  { icon: Brain, label: 'Prediction', to: '/prediction' },
  { icon: Cpu, label: 'Simulation', to: '/simulation' },
  { icon: Map, label: 'Map', to: '/map' },
  { icon: FileText, label: 'Reports', to: '/reports' },
];

export default function Sidebar() {
  const handleDownload = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      year: 2025,
      stats: {
        totalEmissions: '24,350 kg',
        transport: '8,200 kg (33.7%)',
        energy: '12,500 kg (51.3%)',
        industry: '3,650 kg (15.0%)',
      },
      carbonReduction: '-12% this month',
      prediction: 'Projected 15% increase by 2030 (28,000 kg)',
      recommendations: [
        'Use Public Transport — reduce car usage in cities',
        'Save Energy — switch to LED and efficient appliances',
        'Switch to Renewables — invest in clean energy sources',
      ],
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecopulse-report-${new Date().getFullYear()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 240,
        height: '100vh',
        background: 'var(--color-sidebar)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Leaf size={24} color="#22C55E" />
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'white',
              marginLeft: 8,
            }}
          >
            EcoPulse
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ marginTop: 12, flex: 1, padding: '0 12px' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 8,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                  background: isActive ? 'var(--color-accent-glow)' : 'transparent',
                  transition: 'all 0.15s ease',
                })}
                className="sidebar-link"
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div style={{ padding: 16 }}>
        <CarbonReduction />
        <button
          onClick={handleDownload}
          style={{
            width: '100%',
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'transparent',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
            borderRadius: 8,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-accent)';
            e.currentTarget.style.color = 'var(--color-accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          <DownloadCloud size={16} />
          Download Report
        </button>
      </div>
    </aside>
  );
}
