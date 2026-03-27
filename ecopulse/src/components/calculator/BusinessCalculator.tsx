import { useState } from 'react';
import { Building2, Users, Car, Zap } from 'lucide-react';
import { businessSectors } from '../../data/calculatorData';

export default function BusinessCalculator() {
  const [sector, setSector] = useState('office');
  const [employees, setEmployees] = useState(50);
  const [fleetVehicles, setFleetVehicles] = useState(5);
  const [officeArea, setOfficeArea] = useState(200);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const sectorData = businessSectors.find(s => s.id === sector);
    if (!sectorData) return;
    const base = employees * sectorData.factorPerEmployee;
    const fleet = fleetVehicles * 4800 * 0.21;
    const office = officeArea * 0.15 * 12;
    setResult(Math.round(base + fleet + office));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', background: 'var(--color-surface-2)',
    border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text-primary)',
    fontSize: 15, fontWeight: 600, outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Building2 size={16} color="#A855F7" /> Industry Sector
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {businessSectors.map((s) => (
            <button
              key={s.id}
              onClick={() => setSector(s.id)}
              style={{
                padding: '10px 12px', borderRadius: 8, border: '1px solid',
                borderColor: sector === s.id ? 'var(--color-accent)' : 'var(--color-border)',
                background: sector === s.id ? 'var(--color-accent-glow)' : 'var(--color-surface-2)',
                color: sector === s.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Users size={16} color="#22C55E" /> Number of Employees
        </label>
        <input type="number" value={employees} onChange={(e) => setEmployees(Number(e.target.value))} style={inputStyle} />
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Car size={16} color="#22D3EE" /> Fleet Vehicles
        </label>
        <input type="number" value={fleetVehicles} onChange={(e) => setFleetVehicles(Number(e.target.value))} style={inputStyle} />
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Zap size={16} color="#F59E0B" /> Office Space (m²)
        </label>
        <input type="number" value={officeArea} onChange={(e) => setOfficeArea(Number(e.target.value))} style={inputStyle} />
      </div>

      <button
        onClick={calculate}
        style={{
          width: '100%', background: 'var(--color-accent)', border: 'none', borderRadius: 8,
          padding: '14px 0', fontSize: 15, fontWeight: 700, color: '#0A0A0A', cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Calculate Business Footprint
      </button>

      {result !== null && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 4 }}>Annual Organizational Footprint</p>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-accent)' }}>{result.toLocaleString()} kg</p>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 8 }}>
            ≈ {Math.round(result / employees).toLocaleString()} kg per employee
          </p>
        </div>
      )}
    </div>
  );
}
