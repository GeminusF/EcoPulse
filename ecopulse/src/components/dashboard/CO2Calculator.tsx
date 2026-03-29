import { useState } from 'react';
import { Leaf, Car, Zap, Users, Plane, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { gridElectricFactor, flightFactors, spendingFactor } from '../../data/calculatorData';

const inputCls = "text-right w-24 bg-transparent border-none outline-none text-[15px] font-semibold text-text-primary font-sans";

export default function CO2Calculator() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'personal' | 'business'>('personal');
  const [result, setResult] = useState<number | null>(null);

  // Personal States
  const [distance, setDistance] = useState(800);
  const [electricity, setElectricity] = useState(250);
  const [spending, setSpending] = useState(400);

  // Business States
  const [employees, setEmployees] = useState(25);
  const [fleetDist, setFleetDist] = useState(3000);
  const [flights, setFlights] = useState(5000);

  const calc = () => {
    let r = 0;
    if (mode === 'personal') {
      r = (distance * 0.21) + (electricity * gridElectricFactor) + (spending * spendingFactor);
    } else {
      const baseMonthly = employees * (2.4 / 12);
      const fleetMonthly = (fleetDist * 0.21);
      const flightsMonthly = (flights * flightFactors.shortHaul) / 12;
      r = baseMonthly + fleetMonthly + flightsMonthly;
    }
    // Annualize the simple score for the dashboard
    setResult(Math.round(r * 12));
  };

  const pRows = [
    { icon: <Car size={16} className="text-transport" />, label: '🚗 Driving (km/mo)', value: distance, set: setDistance },
    { icon: <Zap size={16} className="text-energy" />, label: '⚡ Home Power (kWh)', value: electricity, set: setElectricity },
    { icon: <ShoppingBag size={16} className="text-accent" />, label: '🛍️ Leisure Spend ($)', value: spending, set: setSpending },
  ] as const;

  const bRows = [
    { icon: <Users size={16} className="text-accent" />, label: '👥 Team Size', value: employees, set: setEmployees },
    { icon: <Car size={16} className="text-transport" />, label: '🚚 Fleet (km/mo)', value: fleetDist, set: setFleetDist },
    { icon: <Plane size={16} className="text-industry" />, label: '✈️ Flights (km/yr)', value: flights, set: setFlights },
  ] as const;

  const activeRows = mode === 'personal' ? pRows : bRows;

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-0.5">
        <h3 className="text-base font-bold text-text-primary">{t('dash.co2.title')}</h3>
        <div className="bg-surface-2 p-1 rounded-lg flex text-[11px] font-bold">
          <button onClick={() => { setMode('personal'); setResult(null); }}
            className={`px-2.5 py-1 rounded-md cursor-pointer border-none transition-colors ${mode === 'personal' ? 'bg-accent text-[#0A0A0A]' : 'bg-transparent text-text-muted hover:text-text-primary'}`}>
            Personal
          </button>
          <button onClick={() => { setMode('business'); setResult(null); }}
            className={`px-2.5 py-1 rounded-md cursor-pointer border-none transition-colors ${mode === 'business' ? 'bg-[#3B82F6] text-white' : 'bg-transparent text-text-muted hover:text-text-primary'}`}>
            Business
          </button>
        </div>
      </div>
      <p className="text-[13px] text-text-muted">{t('dash.co2.subtitle')}</p>

      <div className="mt-5 flex flex-col gap-3 flex-1">
        {activeRows.map((row) => (
          <div key={row.label} className="flex items-center gap-3 bg-surface-2 border border-border transition-colors hover:border-accent/30 rounded-lg px-4 py-3">
            <span className="flex-1 text-[13.5px] font-medium text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">{row.label}</span>
            <input type="number" value={row.value === 0 ? '' : row.value} onChange={(e) => row.set(Number(e.target.value))}
              placeholder="0" className={inputCls} />
          </div>
        ))}
      </div>

      <button type="button" onClick={calc}
        className="w-full mt-5 bg-accent hover:bg-accent-bright active:scale-[0.98] border-none rounded-lg
                   py-3.5 flex items-center justify-center gap-2 text-[15px] font-bold text-[#0A0A0A]
                   cursor-pointer transition-all duration-150">
        <Leaf size={18} />
        {t('dash.co2.calculate')}
      </button>

      {result !== null && (
        <div className="mt-4 bg-accent-glow border border-accent/20 rounded-lg p-4 text-center animate-in fade-in slide-in-from-bottom-2">
          <p className="text-[11px] text-text-muted font-bold uppercase tracking-wider mb-1">
            {mode === 'personal' ? 'Annual Footprint' : 'Annual Corporate Baseline'}
          </p>
          <p className="text-2xl font-extrabold text-accent">{result.toLocaleString()} {t('common.kg')} </p>
        </div>
      )}
    </div>
  );
}
