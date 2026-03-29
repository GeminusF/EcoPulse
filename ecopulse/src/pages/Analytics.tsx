import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TabPanel from '../components/shared/TabPanel';
import PageHeader from '../components/shared/PageHeader';
import KeyInsights from '../components/analytics/KeyInsights';
import EnergyMixChart from '../components/analytics/EnergyMixChart';
import CumulativeEmissions from '../components/analytics/CumulativeEmissions';
import HistoricalComparison from '../components/analytics/HistoricalComparison';
import SectorPerformance from '../components/analytics/SectorPerformance';
import RegionalBenchmark from '../components/analytics/RegionalBenchmark';
import CountryComparison from '../components/analytics/CountryComparison';

export default function Analytics() {
  const { t } = useTranslation();
  const [benchmarkMode, setBenchmarkMode] = useState('regional');
  return (
    <div className="p-4 md:p-6 flex flex-col gap-4">
      <PageHeader title={t('analytics.title')} subtitle={t('analytics.subtitle')} />
      <KeyInsights />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EnergyMixChart />
        <CumulativeEmissions />
      </div>
      <HistoricalComparison />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectorPerformance />
        <div className="flex flex-col gap-3">
          <TabPanel
            tabs={[
              { id: 'regional', label: t('analytics.benchmark.regional') },
              { id: 'direct', label: t('analytics.benchmark.direct') }
            ]}
            active={benchmarkMode}
            onChange={setBenchmarkMode}
          />
          {benchmarkMode === 'regional' ? <RegionalBenchmark /> : <CountryComparison />}
        </div>
      </div>
    </div>
  );
}
