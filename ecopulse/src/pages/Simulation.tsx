import { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/shared/PageHeader';
import TabPanel from '../components/shared/TabPanel';
import PolicyPacks from '../components/simulation/PolicyPacks';
import LeverPanel from '../components/simulation/LeverPanel';
import SimulationResults from '../components/simulation/SimulationResults';
import SaveAsModal from '../components/shared/SaveAsModal';
import { baselineLevers, policyPacks, runSimulation } from '../data/simulationData';
import type { LeverValues, SimulationResult } from '../data/simulationData';

export default function Simulation() {
  const { t } = useTranslation();
  const [levers, setLevers] = useState<LeverValues>({ ...baselineLevers });
  const [activePack, setActivePack] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [mode, setMode] = useState('run');
  const [history, setHistory] = useState<any[]>([]);

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState<SimulationResult | null>(null);
  const [activeSimulationSaved, setActiveSimulationSaved] = useState(false);

  useEffect(() => {
    try {
      setHistory(JSON.parse(localStorage.getItem('ecopulse-sim-history') || '[]'));
    } catch { setHistory([]); }
  }, [mode]);

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
    setActiveSimulationSaved(false);
  }, []);

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setResult(runSimulation(levers));
      setSimulating(false);
      setActiveSimulationSaved(false);
    }, 1200);
  };

  const handleReset = () => {
    setLevers({ ...baselineLevers });
    setActivePack(null);
    setResult(null);
  };

  return (
    <div className="p-4 md:p-6 flex flex-col gap-4">
      <PageHeader
        title={t('sim.title')}
        subtitle={t('sim.subtitle')}
        action={
          <button type="button" onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-transparent
                       text-text-muted text-[13px] font-medium font-sans cursor-pointer hover:border-accent hover:text-accent transition-colors">
            <RotateCcw size={14} /> {t('sim.reset')}
          </button>
        }
      />

      <TabPanel
        tabs={[
          { id: 'run', label: 'Run Simulation' },
          { id: 'history', label: 'History & Compare' }
        ]}
        active={mode}
        onChange={setMode}
      />

      {mode === 'history' ? (
        <div className="card mt-2">
          <h3 className="font-bold text-text-primary mb-3">Simulation History</h3>
          {history.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">No saved simulations yet. Run and save a simulation to see it here.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((h: any) => {
                const delta = h.result.totalAfter - h.result.totalBefore;
                const pct = Math.abs(Math.round((delta / h.result.totalBefore) * 100));
                return (
                  <div key={h.id} className="p-4 rounded-lg border border-border bg-surface-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                      <p className="font-bold text-text-primary mb-1">{h.name || 'Saved Simulation'}</p>
                      <p className="text-[11px] text-text-muted">{new Date(h.date).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-[10px] text-text-muted">Reduction</p>
                        <p className={`font-bold ${delta < 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                          {delta < 0 ? '↓' : '↑'} {pct}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-text-muted">Cost</p>
                        <p className="font-bold text-[#F59E0B]">${h.result.costBillion}B</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          <PolicyPacks onSelect={handlePackSelect} activePack={activePack} />

          <LeverPanel levers={levers} onChange={handleLeverChange} />

      <button type="button" onClick={handleSimulate} disabled={simulating}
        className={`w-full py-4 rounded-[10px] border-none text-base font-extrabold text-[#0A0A0A]
                    flex items-center justify-center gap-2.5 font-sans transition-all duration-200
                    ${simulating ? 'bg-accent-dim cursor-wait' : 'bg-accent cursor-pointer hover:bg-accent-bright'}`}>
        <Play size={20} fill="#0A0A0A" />
        {simulating ? t('sim.running') : t('sim.run')}
      </button>

      {simulating && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-20 bg-surface-2 animate-pulse opacity-30" />
          ))}
        </div>
      )}

          {result && !simulating && (
            <SimulationResults result={result} isSaved={activeSimulationSaved} onSave={() => {
              setPendingSaveData(result);
              setSaveModalOpen(true);
            }} />
          )}
        </>
      )}

      <SaveAsModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save Simulation"
        defaultName="My Custom Scenario"
        onSave={(name) => {
          if (!pendingSaveData) return;
          const newHistory = [{ id: Date.now(), name, result: pendingSaveData, date: new Date().toISOString() }, ...history];
          localStorage.setItem('ecopulse-sim-history', JSON.stringify(newHistory));
          setHistory(newHistory);
          setActiveSimulationSaved(true);
          setPendingSaveData(null);
        }}
      />
    </div>
  );
}
