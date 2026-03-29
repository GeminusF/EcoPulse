import { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/shared/PageHeader';
import TabPanel from '../components/shared/TabPanel';
import StepTransport from '../components/calculator/StepTransport';
import StepEnergy from '../components/calculator/StepEnergy';
import StepLifestyle from '../components/calculator/StepLifestyle';
import StepResults from '../components/calculator/StepResults';
import BusinessCalculator from '../components/calculator/BusinessCalculator';
import SaveAsModal from '../components/shared/SaveAsModal';
import { vehicleTypes, heatingTypes, gridElectricFactor, spendingFactor, wasteFactor, waterFactor, clothingFactor, digitalFactor, flightFactors, foodFactors } from '../data/calculatorData';

export default function Calculator() {
  const { t } = useTranslation();
  const [mode, setMode] = useState('personal');
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState<{total: number, breakdown: any, mode: 'Personal' | 'Business'} | null>(null);

  useEffect(() => {
    try {
      setHistory(JSON.parse(localStorage.getItem('ecopulse-calc-history') || '[]'));
    } catch { setHistory([]); }
  }, [mode]);

  const [commuteKm, setCommuteKm] = useState(800);
  const [vehicleType, setVehicleType] = useState('car_petrol');
  const [flightKm, setFlightKm] = useState(1500);

  const [electricityKwh, setElectricityKwh] = useState(250);
  const [heatingType, setHeatingType] = useState('gas');
  const [heatingGasM3, setHeatingGasM3] = useState(50);

  const [beefKg, setBeefKg] = useState(2);
  const [chickenKg, setChickenKg] = useState(5);
  const [vegKg, setVegKg] = useState(20);
  const [shoppingSpend, setShoppingSpend] = useState(200);
  const [recyclingPct, setRecyclingPct] = useState(30);
  const [waterM3, setWaterM3] = useState(5);
  const [clothingItems, setClothingItems] = useState(2);
  const [digitalHours, setDigitalHours] = useState(4);

  const stepLabels = useMemo(() => [
    t('calc.step.transport'),
    t('calc.step.energy'),
    t('calc.step.lifestyle'),
    t('calc.step.results'),
  ], [t]);

  const handleChange = (field: string, value: number | string) => {
    const setters: Record<string, (v: never) => void> = {
      commuteKm: setCommuteKm as never, vehicleType: setVehicleType as never,
      flightKm: setFlightKm as never, electricityKwh: setElectricityKwh as never,
      heatingType: setHeatingType as never, heatingGasM3: setHeatingGasM3 as never,
      beefKg: setBeefKg as never, chickenKg: setChickenKg as never, vegKg: setVegKg as never,
      shoppingSpend: setShoppingSpend as never, recyclingPct: setRecyclingPct as never,
      waterM3: setWaterM3 as never, clothingItems: setClothingItems as never, digitalHours: setDigitalHours as never,
    };
    setters[field]?.(value as never);
  };

  const calcTotal = () => {
    // 1. Transport = (Commute * Vehicle EF) + (Flights * Flight EF)
    const vFactor = vehicleTypes.find(v => v.id === vehicleType)?.factor ?? 0.21;
    const transportMonthly = (commuteKm * vFactor) + (flightKm * flightFactors.shortHaul / 12);
    
    // 2. Energy = (Electricity * Grid EF) + (Heating Gas * Gas EF)
    const hFactor = heatingTypes.find(h => h.id === heatingType)?.factor ?? 2.0;
    const energyMonthly = (electricityKwh * gridElectricFactor) + (heatingGasM3 * hFactor);
    
    // 3. Lifestyle = Food + Shopping + Clothes + Water + Digital - Recycling savings
    const foodMonthly = (beefKg * foodFactors.beef) + (chickenKg * foodFactors.chicken) + (vegKg * foodFactors.vegetables);
    const goodsMonthly = (shoppingSpend * spendingFactor) + (clothingItems * clothingFactor);
    const utilitiesMonthly = (waterM3 * waterFactor) + (digitalHours * 30 * digitalFactor); // digitalHours per day * 30
    
    // Base waste is approx 30kg/month, reduced by recycling
    const wasteEmissions = 30 * wasteFactor * (1 - recyclingPct / 100);
    
    const lifestyleMonthly = foodMonthly + goodsMonthly + utilitiesMonthly + wasteEmissions;

    // Annualize (since legacy results expects annual numbers)
    const transport = Math.round(transportMonthly * 12);
    const energy = Math.round(energyMonthly * 12);
    const lifestyle = Math.round(lifestyleMonthly * 12);

    return {
      total: transport + energy + lifestyle,
      breakdown: { transport, energy, lifestyle },
    };
  };

  const { total, breakdown } = calcTotal();

  const handleSaveResult = (name: string) => {
    if (!pendingSaveData) return;
    const { total, breakdown, mode: calcMode } = pendingSaveData;
    const newHistory = [{ id: Date.now(), name, total, breakdown, date: new Date().toISOString(), calcMode }, ...history];
    localStorage.setItem('ecopulse-calc-history', JSON.stringify(newHistory));
    setHistory(newHistory);
    setSaved(true);
    setPendingSaveData(null);
  };

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t('calc.title')} subtitle={t('calc.subtitle')} />

      <div className="max-w-[600px] mx-auto">
        <TabPanel
          tabs={[
            { id: 'personal', label: t('calc.mode.personal') },
            { id: 'business', label: t('calc.mode.business') },
            { id: 'history', label: 'History' }
          ]}
          active={mode}
          onChange={(id) => { setMode(id); setStep(0); setSaved(false); }}
        />

        <div className="card mt-5 p-5 md:p-6">
          {mode === 'history' ? (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-text-primary mb-2">Calculation History</h3>
              {history.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-8">No saved calculations yet.</p>
              ) : (
                history.map((h: any) => (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${h.calcMode === 'Business' ? 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]' : 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]'}`}>
                          {h.calcMode || 'Personal'}
                        </span>
                        <span className="text-[13px] font-bold text-text-primary">{h.name || 'Unnamed Calculation'}</span>
                      </div>
                      <p className="text-sm font-bold text-accent">{h.total.toLocaleString()} kg CO₂</p>
                      <p className="text-[11px] text-text-muted">{new Date(h.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3 text-[11px] text-text-muted">
                      <span>🚗 {h.breakdown.transport}</span>
                      <span>⚡ {h.breakdown.energy}</span>
                      {h.breakdown.lifestyle !== undefined && <span>🌱 {h.breakdown.lifestyle}</span>}
                      {h.breakdown.operations !== undefined && <span>⚙️ {h.breakdown.operations}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : mode === 'personal' ? (
            <>
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                {stepLabels.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                      ${i <= step ? 'bg-accent text-[#0A0A0A]' : 'bg-surface-2 text-text-muted'}`}>
                      {i + 1}
                    </div>
                    <span className={`text-xs ${i === step ? 'font-semibold text-text-primary' : 'font-normal text-text-muted'}`}>
                      {s}
                    </span>
                    {i < stepLabels.length - 1 && <div className="w-6 h-px bg-border" />}
                  </div>
                ))}
              </div>

              {step === 0 && <StepTransport commuteKm={commuteKm} vehicleType={vehicleType} flightKm={flightKm} onChange={handleChange} />}
              {step === 1 && <StepEnergy electricityKwh={electricityKwh} heatingType={heatingType} heatingGasM3={heatingGasM3} onChange={handleChange} />}
              {step === 2 && <StepLifestyle 
                beefKg={beefKg} chickenKg={chickenKg} vegKg={vegKg}
                shoppingSpend={shoppingSpend} recyclingPct={recyclingPct} waterM3={waterM3} 
                clothingItems={clothingItems} digitalHours={digitalHours}
                onChange={handleChange} 
              />}
              {step === 3 && <StepResults total={total} breakdown={breakdown} />}

              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-border bg-transparent
                    text-[13px] font-semibold font-sans transition-colors
                    ${step === 0 ? 'text-border cursor-default' : 'text-text-primary cursor-pointer hover:border-accent'}`}>
                  <ChevronLeft size={16} /> {t('calc.back')}
                </button>
                {step < 3 ? (
                  <button type="button" onClick={() => setStep(step + 1)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg border-none bg-accent text-[#0A0A0A]
                               text-[13px] font-semibold font-sans cursor-pointer hover:bg-accent-bright transition-colors">
                    {t('calc.next')} <ChevronRight size={16} />
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPendingSaveData({ total, breakdown, mode: 'Personal' });
                        setSaveModalOpen(true);
                      }}
                      disabled={saved}
                      className="px-5 py-2.5 rounded-lg border border-transparent bg-surface-2 text-text-primary
                                 text-[13px] font-semibold font-sans cursor-pointer hover:bg-border transition-colors disabled:opacity-50"
                    >
                      {saved ? 'Saved ✓' : 'Save Result'}
                    </button>
                    <button type="button" onClick={() => { setStep(0); setSaved(false); }}
                      className="px-5 py-2.5 rounded-lg border border-accent bg-transparent text-accent
                                 text-[13px] font-semibold font-sans cursor-pointer hover:bg-accent-glow transition-colors">
                      {t('calc.startOver')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <BusinessCalculator 
              onSave={(calcTotal, calcBreakdown) => {
                setPendingSaveData({ total: calcTotal, breakdown: calcBreakdown, mode: 'Business' });
                setSaveModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      <SaveAsModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveResult}
        title="Save Calculation"
        defaultName={pendingSaveData?.mode === 'Business' ? 'HQ Business Audit' : 'My Personal Footprint'}
      />
    </div>
  );
}
