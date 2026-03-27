import { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, BarChart, Bar,
} from 'recharts';
import { Brain, TrendingUp } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import InfoAccordion from '../components/shared/InfoAccordion';
import SliderInput from '../components/shared/SliderInput';
import {
  forecastFanData, sectorForecasts, backtestData,
  sectorConfidence, modelMetadata,
} from '../data/predictionData';

export default function Prediction() {
  const [gdpGrowth, setGdpGrowth] = useState(3.5);
  const [oilPrice, setOilPrice] = useState(75);
  const [popGrowth, setPopGrowth] = useState(0.8);

  const adjustmentFactor = 1 + (gdpGrowth - 3.5) * 0.04 + (oilPrice - 75) * 0.001 + (popGrowth - 0.8) * 0.05;
  const adjustedFan = forecastFanData.map(d => ({
    ...d,
    adjusted: Math.round(d.baseline * adjustmentFactor),
  }));

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHeader
        title="AI Prediction"
        subtitle="Machine learning forecasts for Azerbaijan's emissions trajectory"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--color-accent-glow)', borderRadius: 8 }}>
            <Brain size={16} color="var(--color-accent)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent)' }}>LSTM Model v2.1</span>
          </div>
        }
      />

      {/* Fan chart + What-if sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>Forecast with Confidence Bands</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>50%, 75%, and 95% confidence intervals</p>
          <div style={{ marginTop: 12 }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={adjustedFan} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="band95" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.05} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="high95" stroke="none" fill="#22C55E" fillOpacity={0.06} />
                <Area type="monotone" dataKey="low95" stroke="none" fill="var(--color-bg)" fillOpacity={1} />
                <Area type="monotone" dataKey="high75" stroke="none" fill="#22C55E" fillOpacity={0.1} />
                <Area type="monotone" dataKey="low75" stroke="none" fill="var(--color-bg)" fillOpacity={1} />
                <Area type="monotone" dataKey="high50" stroke="none" fill="#22C55E" fillOpacity={0.15} />
                <Area type="monotone" dataKey="low50" stroke="none" fill="var(--color-bg)" fillOpacity={1} />
                <Line type="monotone" dataKey="baseline" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 3, fill: '#22C55E' }} name="Baseline" />
                <Line type="monotone" dataKey="withPolicy" stroke="#3B82F6" strokeWidth={2} strokeDasharray="6 3" dot={false} name="With Policy" />
                <Line type="monotone" dataKey="adjusted" stroke="#F59E0B" strokeWidth={2} dot={false} name="What-If" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* What-if sliders */}
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 16 }}>What-If Assumptions</h3>
          <SliderInput label="GDP Growth Rate" value={gdpGrowth} min={0} max={8} step={0.5} unit="%" baseline={3.5} onChange={setGdpGrowth} />
          <SliderInput label="Oil Price ($/barrel)" value={oilPrice} min={30} max={150} step={5} unit="" baseline={75} onChange={setOilPrice} />
          <SliderInput label="Population Growth" value={popGrowth} min={0} max={2} step={0.1} unit="%" baseline={0.8} onChange={setPopGrowth} />
          <div style={{ marginTop: 16, padding: 12, background: 'var(--color-surface-2)', borderRadius: 8, fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            <TrendingUp size={14} color="var(--color-accent)" style={{ marginBottom: 4 }} />
            <span> Adjustment factor: <strong style={{ color: 'var(--color-text-primary)' }}>{adjustmentFactor.toFixed(3)}x</strong></span>
          </div>

          {/* Confidence scores */}
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Model Confidence</p>
            {sectorConfidence.map(s => (
              <div key={s.sector} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{s.sector}</span>
                  <span style={{ fontWeight: 700, color: s.color }}>{s.confidence}%</span>
                </div>
                <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${s.confidence}%`, background: s.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sector forecasts + Backtest */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>Per-Sector Forecast</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Projected emissions by sector (2020–2030)</p>
          <div style={{ marginTop: 12 }}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={sectorForecasts} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="transport" name="Transport" stroke="#22D3EE" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="energy" name="Energy" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="industry" name="Industry" stroke="#A855F7" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>Model Backtest</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Predicted vs actual (2018–2025)</p>
          <div style={{ marginTop: 12 }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={backtestData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="actual" name="Actual" fill="#22C55E" radius={[3, 3, 0, 0]} barSize={12} />
                <Bar dataKey="predicted" name="Predicted" fill="#4B5563" radius={[3, 3, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
              <div style={{ padding: '4px 10px', background: 'var(--color-surface-2)', borderRadius: 6, fontSize: 11 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>MAPE: </span>
                <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{modelMetadata.accuracy.mape}%</span>
              </div>
              <div style={{ padding: '4px 10px', background: 'var(--color-surface-2)', borderRadius: 6, fontSize: 11 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>RMSE: </span>
                <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{modelMetadata.accuracy.rmse}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12 }}>Methodology</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <InfoAccordion title="Model Architecture" defaultOpen>
            <p><strong>{modelMetadata.type}</strong></p>
            <p style={{ marginTop: 8 }}>Training period: {modelMetadata.trainingPeriod}</p>
            <p>Data sources: {modelMetadata.dataSources}</p>
          </InfoAccordion>
          <InfoAccordion title="Input Features">
            <ul style={{ paddingLeft: 16 }}>
              {modelMetadata.features.map(f => <li key={f} style={{ marginBottom: 4 }}>{f}</li>)}
            </ul>
          </InfoAccordion>
          <InfoAccordion title="Limitations & Assumptions">
            <ul style={{ paddingLeft: 16 }}>
              {modelMetadata.limitations.map(l => <li key={l} style={{ marginBottom: 4 }}>{l}</li>)}
            </ul>
          </InfoAccordion>
        </div>
      </div>
    </div>
  );
}
