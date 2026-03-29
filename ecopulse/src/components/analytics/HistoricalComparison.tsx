import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  LineChart, Line,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import TabPanel from '../shared/TabPanel';
import { sectorHistory, regionEmissions, energyMixTimeSeries, carbonTaxData } from '../../data/analyticsData';

const chartTooltipStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  fontSize: 12,
};

export default function HistoricalComparison() {
  const { t } = useTranslation();
  const [active, setActive] = useState('sector');

  const tabs = useMemo(() => [
    { id: 'sector', label: t('analytics.tab.sector') },
    { id: 'region', label: t('analytics.tab.region') },
    { id: 'energy', label: t('analytics.tab.energy') },
    { id: 'tax', label: t('analytics.tab.tax') },
  ], [t]);

  const regionChartData = useMemo(() =>
    regionEmissions.map(r => ({ ...r, regionLabel: t(r.regionKey) })), [t]);

  return (
    <div className="card">
      <h3 className="text-base font-bold text-text-primary">{t('analytics.historical.title')}</h3>
      <p className="text-[13px] text-text-muted mt-0.5 mb-3">{t('analytics.historical.sub')}</p>
      <TabPanel tabs={tabs} active={active} onChange={setActive} />

      <div className="mt-4">
        {active === 'sector' && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sectorHistory} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="transport" name={t('analytics.sector.transport')} fill="#22D3EE" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="energy" name={t('analytics.sector.energy')} fill="#F59E0B" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="industry" name={t('analytics.sector.industry')} fill="#A855F7" radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {active === 'region' && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={regionChartData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="regionLabel" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="emissions" name={t('analytics.tax.emissionsKg')} fill="#22C55E" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {active === 'energy' && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={energyMixTimeSeries} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => `${v}%`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v, n) => [`${v}%`, t(`fuel.${String(n)}`)]} />
              <Legend wrapperStyle={{ fontSize: 11 }} formatter={(v) => t(`fuel.${String(v)}`)} />
              <Bar dataKey="oil" name="oil" stackId="a" fill="#EF4444" barSize={18} />
              <Bar dataKey="gas" name="gas" stackId="a" fill="#F59E0B" barSize={18} />
              <Bar dataKey="hydro" name="hydro" stackId="a" fill="#3B82F6" barSize={18} />
              <Bar dataKey="solar" name="solar" stackId="a" fill="#FBBF24" barSize={18} />
              <Bar dataKey="wind" name="wind" stackId="a" fill="#22D3EE" radius={[3, 3, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {active === 'tax' && (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={carbonTaxData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `$${v}M`} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="state" name={t('analytics.tax.seriesState')} stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="private" name={t('analytics.tax.seriesPrivate')} stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-1.5 px-2 text-left text-text-muted">{t('analytics.year')}</th>
                    {carbonTaxData.map(d => (
                      <th key={d.year} className="py-1.5 px-1 text-text-muted">{d.year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-1.5 px-2 text-[#22C55E] font-semibold">{t('analytics.tax.state')}</td>
                    {carbonTaxData.map(d => (
                      <td key={d.year} className="py-1.5 px-1 text-center text-text-primary">{d.state}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-[#F59E0B] font-semibold">{t('analytics.tax.private')}</td>
                    {carbonTaxData.map(d => (
                      <td key={d.year} className="py-1.5 px-1 text-center text-text-primary">{d.private}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
