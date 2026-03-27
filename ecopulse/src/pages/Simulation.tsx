import { useState, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import PolicyPacks from '../components/simulation/PolicyPacks';
import LeverPanel from '../components/simulation/LeverPanel';
import SimulationResults from '../components/simulation/SimulationResults';
import { baselineLevers, policyPacks, runSimulation } from '../data/simulationData';
import type { LeverValues, SimulationResult } from '../data/simulationData';

export default function Simulation() {
  const [levers, setLevers] = useState<LeverValues>({ ...baselineLevers });
  const [activePack, setActivePack] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  const handlePackSelect = useCallback((packLevers: LeverValues) => {
    setLevers({ ...packLevers });
    const pack = policyPacks.find(p => JSON.stringify(p.levers) === JSON.stringify(packLevers));
    setActivePack(pack?.id ?? null);
    setResult(null);
  }, []);

  const handleLeverChange = useCallback((key: keyof LeverValues, value: number) => {
    setLevers(prev => ({ ...prev, [key]: value }));
    setActivePack(null);
    setResult(null);
  }, []);

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setResult(runSimulation(levers));
      setSimulating(false);
    }, 1200);
  };

  const handleReset = () => {
    setLevers({ ...baselineLevers });
    setActivePack(null);
    setResult(null);
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHeader
        title="Simulation"
        subtitle="Model the impact of policy scenarios on Azerbaijan's CO₂ emissions"
        action={
          <button
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent',
              color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              fontFamily: 'inherit',
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        }
      />

      {/* Policy presets */}
      <PolicyPacks onSelect={handlePackSelect} activePack={activePack} />

      {/* Levers + Simulate button */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        <LeverPanel levers={levers} onChange={handleLeverChange} />
      </div>

      {/* Simulate button */}
      <button
        onClick={handleSimulate}
        disabled={simulating}
        style={{
          width: '100%', padding: '16px 0', borderRadius: 10, border: 'none',
          background: simulating ? 'var(--color-accent-dim)' : 'var(--color-accent)',
          color: '#0A0A0A', fontSize: 16, fontWeight: 800, cursor: simulating ? 'wait' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'inherit', transition: 'all 0.2s',
        }}
      >
        <Play size={20} fill="#0A0A0A" />
        {simulating ? 'Running Simulation...' : 'Simulate'}
      </button>

      {/* Skeleton loading state */}
      {simulating && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card" style={{ height: 80, background: 'var(--color-surface-2)', animation: 'pulse-glow 1.5s ease infinite', opacity: 0.3 }} />
          ))}
        </div>
      )}

      {/* Results */}
      {result && !simulating && <SimulationResults result={result} />}
    </div>
  );
}
