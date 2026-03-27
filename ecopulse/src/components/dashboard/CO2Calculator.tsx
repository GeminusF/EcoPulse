import { useState } from 'react';
import { Navigation, Zap, Droplets, Leaf } from 'lucide-react';

export default function CO2Calculator() {
  const [distance, setDistance] = useState(120);
  const [electricity, setElectricity] = useState(250);
  const [fuel, setFuel] = useState(18);
  const [result, setResult] = useState<number | null>(null);

  const calc = () => {
    const r = distance * 0.21 + electricity * 0.233 + fuel * 2.31;
    setResult(Math.round(r * 10) / 10);
  };

  const inputRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'var(--color-surface-2)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    padding: '12px 16px',
  };

  const inputStyle: React.CSSProperties = {
    textAlign: 'right' as const,
    width: 80,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    fontFamily: 'inherit',
  };

  return (
    <div className="card">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
        CO₂ Calculator
      </h3>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
        Estimate your carbon footprint
      </p>

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={inputRowStyle}>
          <Navigation size={16} color="#22C55E" />
          <span style={{ flex: 1, fontSize: 14, color: 'var(--color-text-primary)' }}>Distance (km)</span>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={inputRowStyle}>
          <Zap size={16} color="#F59E0B" />
          <span style={{ flex: 1, fontSize: 14, color: 'var(--color-text-primary)' }}>Electricity (kWh)</span>
          <input
            type="number"
            value={electricity}
            onChange={(e) => setElectricity(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={inputRowStyle}>
          <Droplets size={16} color="#22C55E" />
          <span style={{ flex: 1, fontSize: 14, color: 'var(--color-text-primary)' }}>Fuel (liters)</span>
          <input
            type="number"
            value={fuel}
            onChange={(e) => setFuel(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>

      <button
        onClick={calc}
        style={{
          width: '100%',
          marginTop: 16,
          background: 'var(--color-accent)',
          border: 'none',
          borderRadius: 8,
          padding: '14px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 15,
          fontWeight: 700,
          color: '#0A0A0A',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-accent-bright)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-accent)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.98)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Leaf size={18} />
        Calculate Emissions
      </button>

      {result !== null && (
        <div
          style={{
            marginTop: 16,
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 8,
            padding: 16,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-accent)' }}>
            Total CO₂: {result} kg
          </p>
        </div>
      )}
    </div>
  );
}
