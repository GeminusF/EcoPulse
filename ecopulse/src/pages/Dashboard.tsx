import { useState } from 'react';
import { Leaf, Car, Zap, Building2, Calendar, ChevronDown } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import EmissionsBySector from '../components/dashboard/EmissionsBySector';
import EmissionHotspots from '../components/dashboard/EmissionHotspots';
import CO2Calculator from '../components/dashboard/CO2Calculator';
import AIEmissionPrediction from '../components/dashboard/AIEmissionPrediction';
import Recommendations from '../components/dashboard/Recommendations';
import {
  yearlyStats,
  totalSparkline,
  transportSparkline,
  energySparkline,
  industrySparkline,
} from '../data/mockData';

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const stats = yearlyStats[selectedYear];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Row 1: Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800 }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            Monitor and analyze CO₂ emissions in Azerbaijan
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              padding: '10px 16px',
              color: 'var(--color-text-primary)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <Calendar size={16} color="var(--color-text-muted)" />
            {selectedYear}
            <ChevronDown size={16} color="var(--color-text-muted)" />
          </button>
          {yearDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 4,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                overflow: 'hidden',
                zIndex: 10,
              }}
            >
              {Object.keys(yearlyStats).map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    setSelectedYear(y);
                    setYearDropdownOpen(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 20px',
                    background:
                      y === selectedYear ? 'var(--color-accent-glow)' : 'transparent',
                    color: y === selectedYear ? 'var(--color-accent)' : 'var(--color-text-primary)',
                    fontSize: 14,
                    cursor: 'pointer',
                    border: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: 4 stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard
          label="Total CO₂ Emissions"
          value={`${stats.total.toLocaleString()} kg`}
          changeText={`${stats.totalChange} from last month`}
          changePositive={true}
          sparklineData={totalSparkline}
          iconBg="rgba(34,197,94,0.15)"
          iconColor="#22C55E"
          lineColor="#22C55E"
          icon={<Leaf size={20} />}
          animationDelay={0}
        />
        <StatCard
          label="Transport"
          value={`${stats.transport.toLocaleString()} kg`}
          changeText={`${stats.transportPct} of total`}
          changePositive={true}
          sparklineData={transportSparkline}
          iconBg="rgba(34,211,238,0.15)"
          iconColor="#22D3EE"
          lineColor="#22D3EE"
          icon={<Car size={20} />}
          animationDelay={100}
        />
        <StatCard
          label="Energy"
          value={`${stats.energy.toLocaleString()} kg`}
          changeText={`↑ ${stats.energyPct} of total`}
          changePositive={false}
          sparklineData={energySparkline}
          iconBg="rgba(245,158,11,0.15)"
          iconColor="#F59E0B"
          lineColor="#F59E0B"
          icon={<Zap size={20} />}
          animationDelay={200}
        />
        <StatCard
          label="Industry"
          value={`${stats.industry.toLocaleString()} kg`}
          changeText={`${stats.industryPct} of total`}
          changePositive={true}
          sparklineData={industrySparkline}
          iconBg="rgba(168,85,247,0.15)"
          iconColor="#A855F7"
          lineColor="#A855F7"
          icon={<Building2 size={20} />}
          animationDelay={300}
        />
      </div>

      {/* Row 3: Donut chart + Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, minHeight: 340 }}>
        <EmissionsBySector />
        <EmissionHotspots />
      </div>

      {/* Row 4: Calculator + AI Prediction + Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <CO2Calculator />
        <AIEmissionPrediction />
        <Recommendations />
      </div>
    </div>
  );
}
