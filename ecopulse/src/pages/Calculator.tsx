import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import TabPanel from '../components/shared/TabPanel';
import StepTransport from '../components/calculator/StepTransport';
import StepEnergy from '../components/calculator/StepEnergy';
import StepLifestyle from '../components/calculator/StepLifestyle';
import StepResults from '../components/calculator/StepResults';
import BusinessCalculator from '../components/calculator/BusinessCalculator';
import { vehicleTypes, heatingTypes, dietTypes } from '../data/calculatorData';

const steps = ['Transport', 'Home Energy', 'Lifestyle', 'Results'];

export default function Calculator() {
  const [mode, setMode] = useState('personal');
  const [step, setStep] = useState(0);

  const [commuteKm, setCommuteKm] = useState(25);
  const [vehicleType, setVehicleType] = useState('car_petrol');
  const [flightsPerYear, setFlightsPerYear] = useState(2);
  const [electricityKwh, setElectricityKwh] = useState(250);
  const [heatingType, setHeatingType] = useState('gas');
  const [homeSizeSqm, setHomeSizeSqm] = useState(80);
  const [diet, setDiet] = useState('medium_meat');
  const [shoppingScore, setShoppingScore] = useState(5);
  const [recyclingPct, setRecyclingPct] = useState(30);

  const handleChange = (field: string, value: number | string) => {
    const setters: Record<string, (v: never) => void> = {
      commuteKm: setCommuteKm as never, vehicleType: setVehicleType as never,
      flightsPerYear: setFlightsPerYear as never, electricityKwh: setElectricityKwh as never,
      heatingType: setHeatingType as never, homeSizeSqm: setHomeSizeSqm as never,
      diet: setDiet as never, shoppingScore: setShoppingScore as never,
      recyclingPct: setRecyclingPct as never,
    };
    setters[field]?.(value as never);
  };

  const calcTotal = () => {
    const vFactor = vehicleTypes.find(v => v.id === vehicleType)?.factor ?? 0.21;
    const transport = commuteKm * 365 * vFactor + flightsPerYear * 255;
    const hFactor = heatingTypes.find(h => h.id === heatingType)?.factor ?? 2.0;
    const energy = electricityKwh * 12 * 0.233 + homeSizeSqm * hFactor * 12 * 0.05;
    const dKg = dietTypes.find(d => d.id === diet)?.kgPerYear ?? 2500;
    const lifestyle = dKg + shoppingScore * 120 + (100 - recyclingPct) * 5;
    return {
      total: Math.round(transport + energy + lifestyle),
      breakdown: { transport: Math.round(transport), energy: Math.round(energy), lifestyle: Math.round(lifestyle) },
    };
  };

  const { total, breakdown } = calcTotal();

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Calculator" subtitle="Estimate your personal or organizational carbon footprint" />

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <TabPanel
          tabs={[{ id: 'personal', label: 'Personal' }, { id: 'business', label: 'Business' }]}
          active={mode}
          onChange={(id) => { setMode(id); setStep(0); }}
        />

        <div className="card" style={{ marginTop: 20, padding: 24 }}>
          {mode === 'personal' ? (
            <>
              {/* Step indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                {steps.map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700,
                        background: i <= step ? 'var(--color-accent)' : 'var(--color-surface-2)',
                        color: i <= step ? '#0A0A0A' : 'var(--color-text-muted)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: i === step ? 600 : 400, color: i === step ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                      {s}
                    </span>
                    {i < steps.length - 1 && (
                      <div style={{ width: 24, height: 1, background: 'var(--color-border)' }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step content */}
              {step === 0 && <StepTransport commuteKm={commuteKm} vehicleType={vehicleType} flightsPerYear={flightsPerYear} onChange={handleChange} />}
              {step === 1 && <StepEnergy electricityKwh={electricityKwh} heatingType={heatingType} homeSizeSqm={homeSizeSqm} onChange={handleChange} />}
              {step === 2 && <StepLifestyle diet={diet} shoppingScore={shoppingScore} recyclingPct={recyclingPct} onChange={handleChange} />}
              {step === 3 && <StepResults total={total} breakdown={breakdown} />}

              {/* Navigation buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                    borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent',
                    color: step === 0 ? 'var(--color-border)' : 'var(--color-text-primary)',
                    cursor: step === 0 ? 'default' : 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                  }}
                >
                  <ChevronLeft size={16} /> Back
                </button>
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                      borderRadius: 8, border: 'none', background: 'var(--color-accent)',
                      color: '#0A0A0A', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                    }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(0)}
                    style={{
                      padding: '10px 20px', borderRadius: 8, border: '1px solid var(--color-accent)',
                      background: 'transparent', color: 'var(--color-accent)', cursor: 'pointer',
                      fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                    }}
                  >
                    Start Over
                  </button>
                )}
              </div>
            </>
          ) : (
            <BusinessCalculator />
          )}
        </div>
      </div>
    </div>
  );
}
