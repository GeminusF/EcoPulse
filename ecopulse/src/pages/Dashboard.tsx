import { useState, useEffect } from 'react';
import { Leaf, Car, Zap, Building2, Calendar, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatCard from '../components/dashboard/StatCard';
import EmissionsBySector from '../components/dashboard/EmissionsBySector';
import EmissionHotspots from '../components/dashboard/EmissionHotspots';
import CO2Calculator from '../components/dashboard/CO2Calculator';
import AIEmissionPrediction from '../components/dashboard/AIEmissionPrediction';
import Recommendations from '../components/dashboard/Recommendations';
import PredictedBadge from '../components/shared/PredictedBadge';
import DataTimestamp from '../components/shared/DataTimestamp';
import PageSkeleton from '../components/shared/PageSkeleton';
import ScrollHint from '../components/shared/ScrollHint';
import {
  yearlyStats,
  totalSparkline,
  transportSparkline,
  energySparkline,
  industrySparkline,
} from '../data/mockData';
import { YEARS } from '../utils/predictionEngine';

export default function Dashboard() {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState('2025');
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const stats = yearlyStats[selectedYear];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 375);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="p-4 md:p-6"><PageSkeleton /></div>;

  return (
    <div className="p-4 md:p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-[32px] font-extrabold text-text-primary">{t('dashboard.title')}</h1>
            <PredictedBadge type={stats?.predicted} />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-text-muted text-sm">{t('dashboard.subtitle')}</p>
            <DataTimestamp />
          </div>
        </div>
        <div className="relative" data-tour="year-selector">
          <button
            type="button"
            onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
            className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2.5
                       text-text-primary text-sm font-semibold cursor-pointer font-sans"
            aria-label="Select year"
          >
            <Calendar size={16} className="text-text-muted" />
            {selectedYear}
            <ChevronDown size={16} className="text-text-muted" />
          </button>
          {yearDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-surface border border-border rounded-lg overflow-hidden z-10 min-w-[160px]">
              {YEARS.map((y) => {
                const yr = String(y);
                const stat = yearlyStats[yr];
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => { setSelectedYear(yr); setYearDropdownOpen(false); }}
                    className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm cursor-pointer border-none font-sans
                      ${yr === selectedYear ? 'bg-accent-glow text-accent' : 'bg-transparent text-text-primary hover:bg-surface-2'}`}
                  >
                    <span>{yr}</span>
                    {stat?.predicted && stat.predicted !== 'actual' && (
                      <span className="text-[9px] text-[#A855F7] font-bold">🤖</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label={t('dashboard.stat.total')} value={`${stats.total.toLocaleString()} ${t('common.kg')}`}
              changeText={t('common.fromLastMonth', { change: stats.totalChange })} changePositive={true}
              sparklineData={totalSparkline} iconBg="rgba(34,197,94,0.15)" iconColor="#22C55E"
              lineColor="#22C55E" icon={<Leaf size={20} />} animationDelay={0} />
            <StatCard label={t('dashboard.stat.transport')} value={`${stats.transport.toLocaleString()} ${t('common.kg')}`}
              changeText={t('common.pctOfTotal', { pct: stats.transportPct })} changePositive={true}
              sparklineData={transportSparkline} iconBg="rgba(34,211,238,0.15)" iconColor="#22D3EE"
              lineColor="#22D3EE" icon={<Car size={20} />} animationDelay={100} />
            <StatCard label={t('dashboard.stat.energy')} value={`${stats.energy.toLocaleString()} ${t('common.kg')}`}
              changeText={t('common.energyOfTotal', { pct: stats.energyPct })} changePositive={false}
              sparklineData={energySparkline} iconBg="rgba(245,158,11,0.15)" iconColor="#F59E0B"
              lineColor="#F59E0B" icon={<Zap size={20} />} animationDelay={200} />
            <StatCard label={t('dashboard.stat.industry')} value={`${stats.industry.toLocaleString()} ${t('common.kg')}`}
              changeText={t('common.pctOfTotal', { pct: stats.industryPct })} changePositive={true}
              sparklineData={industrySparkline} iconBg="rgba(168,85,247,0.15)" iconColor="#A855F7"
              lineColor="#A855F7" icon={<Building2 size={20} />} animationDelay={300} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[340px]">
            <EmissionsBySector />
            <EmissionHotspots />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CO2Calculator />
            <AIEmissionPrediction />
            <Recommendations />
          </div>
        </>
      )}

      <ScrollHint />
    </div>
  );
}
