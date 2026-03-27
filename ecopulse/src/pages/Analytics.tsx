import PageHeader from '../components/shared/PageHeader';
import KeyInsights from '../components/analytics/KeyInsights';
import EnergyMixChart from '../components/analytics/EnergyMixChart';
import CumulativeEmissions from '../components/analytics/CumulativeEmissions';
import HistoricalComparison from '../components/analytics/HistoricalComparison';
import SectorPerformance from '../components/analytics/SectorPerformance';
import RegionalBenchmark from '../components/analytics/RegionalBenchmark';

export default function Analytics() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHeader title="Analytics" subtitle="Deep dive into Azerbaijan's emissions data, trends, and benchmarks" />

      <KeyInsights />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <EnergyMixChart />
        <CumulativeEmissions />
      </div>

      <HistoricalComparison />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <SectorPerformance />
        <RegionalBenchmark />
      </div>
    </div>
  );
}
