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
  Target,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CarbonReduction from '../dashboard/CarbonReduction';

const navDefs = [
  { icon: LayoutDashboard, labelKey: 'nav.dashboard', to: '/dashboard' },
  { icon: Calculator, labelKey: 'nav.calculator', to: '/calculator' },
  { icon: BarChart2, labelKey: 'nav.analytics', to: '/analytics' },
  { icon: Brain, labelKey: 'nav.prediction', to: '/prediction' },
  { icon: Cpu, labelKey: 'nav.simulation', to: '/simulation' },
  { icon: Map, labelKey: 'nav.map', to: '/map' },
  { icon: FileText, labelKey: 'nav.reports', to: '/reports' },
  { icon: Target, labelKey: 'nav.vision', to: '/vision' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const { t } = useTranslation();

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
      carbonReduction: t('sidebar.thisMonth'),
      prediction: t('dash.ai.increase'),
      recommendations: [
        t('rec.transport.title') + ' — ' + t('rec.transport.subtitle'),
        t('rec.energy.title') + ' — ' + t('rec.energy.subtitle'),
        t('rec.renewables.title') + ' — ' + t('rec.renewables.subtitle'),
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
      className={`
        fixed inset-y-0 left-0 w-60 bg-sidebar border-r border-border
        flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center">
          <Leaf size={24} className="text-accent" />
          <span className="text-xl font-bold text-text-primary ml-2">{t('sidebar.brand')}</span>
        </div>
        <button type="button" onClick={onClose} className="lg:hidden p-1 text-text-muted hover:text-text-primary">
          <X size={20} />
        </button>
      </div>

      <nav className="mt-3 flex-1 px-3" data-tour="sidebar">
        <ul className="flex flex-col gap-0.5">
          {navDefs.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-150
                   ${isActive
                     ? 'text-accent font-semibold bg-accent-glow'
                     : 'text-text-muted font-medium hover:text-text-primary hover:bg-surface-2'
                   }`
                }
              >
                <item.icon size={18} />
                {t(item.labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <CarbonReduction />
        <button
          type="button"
          onClick={handleDownload}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-transparent border border-border
                     text-text-secondary rounded-lg px-4 py-2.5 text-[13px] font-medium cursor-pointer
                     transition-colors duration-150 hover:border-accent hover:text-accent"
        >
          <DownloadCloud size={16} />
          {t('sidebar.downloadReport')}
        </button>
      </div>
    </aside>
  );
}
