import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import { southCaucasus, otsCountries, cisCountries } from '../../data/comparisonData';

const allCountries = [...southCaucasus, ...otsCountries, ...cisCountries].filter(
  (v, i, a) => a.findIndex(t => t.countryKey === v.countryKey) === i
);

export default function CountryComparison() {
  const { t } = useTranslation();
  const [country1, setCountry1] = useState('country.azerbaijan');
  const [country2, setCountry2] = useState('country.turkey');

  const c1Data = allCountries.find(c => c.countryKey === country1);
  const c2Data = allCountries.find(c => c.countryKey === country2);

  if (!c1Data || !c2Data) return null;

  const comparisonData = [
    { metric: t('radar.perCapita'), [t(country1)]: c1Data.perCapita, [t(country2)]: c2Data.perCapita },
    { metric: t('radar.renewable'), [t(country1)]: c1Data.renewablePct, [t(country2)]: c2Data.renewablePct },
    { metric: t('radar.industrial'), [t(country1)]: c1Data.industrialShare, [t(country2)]: c2Data.industrialShare },
    { metric: t('radar.transport'), [t(country1)]: c1Data.transportShare, [t(country2)]: c2Data.transportShare },
  ];

  return (
    <div className="card">
      <h3 className="text-base font-bold text-text-primary mb-3">Country Comparison</h3>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={country1}
          onChange={(e) => setCountry1(e.target.value)}
          className="flex-1 bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
        >
          {allCountries.map(c => (
            <option key={c.countryKey} value={c.countryKey}>{t(c.countryKey)}</option>
          ))}
        </select>
        <div className="hidden sm:flex items-center justify-center font-bold text-text-muted">VS</div>
        <select
          value={country2}
          onChange={(e) => setCountry2(e.target.value)}
          className="flex-1 bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
        >
          {allCountries.map(c => (
            <option key={c.countryKey} value={c.countryKey}>{t(c.countryKey)}</option>
          ))}
        </select>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey={t(country1)} fill="#22C55E" radius={[4, 4, 0, 0]} barSize={30} />
            <Bar dataKey={t(country2)} fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
