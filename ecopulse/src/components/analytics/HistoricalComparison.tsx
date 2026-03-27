import { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  LineChart, Line,
} from 'recharts';
import TabPanel from '../shared/TabPanel';
import { sectorHistory, regionEmissions, energyMixTimeSeries, carbonTaxData } from '../../data/analyticsData';

const tabs = [
  { id: 'sector', label: 'By Sector' },
  { id: 'region', label: 'By Region' },
  { id: 'energy', label: 'Energy Mix' },
  { id: 'tax', label: 'CO₂ Tax' },
];

export default function HistoricalComparison() {
  const [active, setActive] = useState('sector');

  return (
    <div className="card">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>Historical Comparison</h3>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2, marginBottom: 12 }}>
        Multi-dimensional emissions breakdown over time
      </p>
      <TabPanel tabs={tabs} active={active} onChange={setActive} />

      <div style={{ marginTop: 16 }}>
        {active === 'sector' && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sectorHistory} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="transport" name="Transport" fill="#22D3EE" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="energy" name="Energy" fill="#F59E0B" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="industry" name="Industry" fill="#A855F7" radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {active === 'region' && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={regionEmissions} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="region" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="emissions" name="Emissions (kg)" fill="#22C55E" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {active === 'energy' && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={energyMixTimeSeries} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="oil" stackId="a" fill="#EF4444" barSize={18} />
              <Bar dataKey="gas" stackId="a" fill="#F59E0B" barSize={18} />
              <Bar dataKey="hydro" stackId="a" fill="#3B82F6" barSize={18} />
              <Bar dataKey="solar" stackId="a" fill="#FBBF24" barSize={18} />
              <Bar dataKey="wind" stackId="a" fill="#22D3EE" radius={[3, 3, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {active === 'tax' && (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={carbonTaxData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}M`} />
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="state" name="State Sector" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="private" name="Private Sector" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 8, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--color-text-muted)' }}>Year</th>
                    {carbonTaxData.map(d => <th key={d.year} style={{ padding: '6px 4px', color: 'var(--color-text-muted)' }}>{d.year}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '6px 8px', color: '#22C55E', fontWeight: 600 }}>State ($M)</td>
                    {carbonTaxData.map(d => <td key={d.year} style={{ padding: '6px 4px', textAlign: 'center', color: 'var(--color-text-primary)' }}>{d.state}</td>)}
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 8px', color: '#F59E0B', fontWeight: 600 }}>Private ($M)</td>
                    {carbonTaxData.map(d => <td key={d.year} style={{ padding: '6px 4px', textAlign: 'center', color: 'var(--color-text-primary)' }}>{d.private}</td>)}
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
