import { useState } from 'react';
import { Building2, Users, Car, Zap, Save, Plane, Trash2, ShoppingCart, Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { businessSectors, gridElectricFactor, flightFactors, wasteFactor, spendingFactor } from '../../data/calculatorData';

const inputCls = "w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text-primary text-[15px] font-semibold outline-none font-sans focus:border-accent transition-colors";

interface Props {
  onSave?: (total: number, breakdown: any) => void;
}

export default function BusinessCalculator({ onSave }: Props) {
  const { t } = useTranslation();
  
  // Core Inputs
  const [sector, setSector] = useState('office');
  const [employees, setEmployees] = useState(50);
  const [officeArea, setOfficeArea] = useState(200);
  
  // New Inputs
  const [electricityKwh, setElectricityKwh] = useState(1500);
  const [heatingGasM3, setHeatingGasM3] = useState(300);
  const [fleetVehicles, setFleetVehicles] = useState(5);
  const [flightKm, setFlightKm] = useState(5000);
  const [wasteKg, setWasteKg] = useState(100);
  const [procurementSpend, setProcurementSpend] = useState(5000);

  const [result, setResult] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);

  const calculate = () => {
    const sectorData = businessSectors.find(s => s.id === sector);
    if (!sectorData) return;
    
    // Monthly calculations
    const baseMonthly = employees * (sectorData.factorPerEmployee / 12); // Extrapolate base employee footprint
    const electricityMonthly = electricityKwh * gridElectricFactor;
    const heatingMonthly = heatingGasM3 * 2.0; // Gas EF
    const fleetMonthly = (fleetVehicles * 2000 * 0.21) / 12; // Assuming 2000km/yr per vehicle
    const flightsMonthly = (flightKm * flightFactors.shortHaul) / 12;
    const wasteMonthly = wasteKg * wasteFactor;
    const procurementMonthly = procurementSpend * spendingFactor;
    const officeMonthly = (officeArea * 0.15); // Baseline office footprint per sqm

    const transportMonthly = fleetMonthly + flightsMonthly;
    const energyMonthly = electricityMonthly + heatingMonthly + officeMonthly;
    const operationsMonthly = baseMonthly + wasteMonthly + procurementMonthly;

    // Annualize for the final display
    const annualTotal = Math.round((transportMonthly + energyMonthly + operationsMonthly) * 12);
    
    setBreakdown({
      transport: Math.round(transportMonthly * 12),
      energy: Math.round(energyMonthly * 12),
      operations: Math.round(operationsMonthly * 12)
    });
    
    setResult(annualTotal);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Facility & Staff */}
      <div>
        <label className="text-[14px] font-bold text-text-primary block mb-3 border-b border-border pb-1">Facility & Staff Profile</label>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-semibold text-text-muted flex items-center gap-2 mb-2">
              <Building2 size={16} className="text-industry" /> {t('calc.business.sector')}
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {businessSectors.map((s) => (
                <button key={s.id} type="button" onClick={() => setSector(s.id)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold cursor-pointer font-sans transition-all
                    ${sector === s.id
                      ? 'border-accent bg-accent-glow text-accent'
                      : 'border-border bg-surface-2 text-text-muted hover:border-border-active'}`}>
                  {t(s.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-semibold text-text-muted flex items-center gap-2 mb-2">
                <Users size={16} className="text-accent" /> {t('calc.business.employees')}
              </label>
              <input type="number" value={employees} onChange={(e) => setEmployees(Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-text-muted flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-accent" /> {t('calc.business.officeArea')}
              </label>
              <input type="number" value={officeArea} onChange={(e) => setOfficeArea(Number(e.target.value))} className={inputCls} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Energy & Utility */}
      <div>
        <label className="text-[14px] font-bold text-text-primary block mb-3 border-b border-border pb-1">Monthly Energy & Utility</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-semibold text-text-muted flex items-center gap-2 mb-2">
              <Zap size={16} className="text-energy" /> Electricity (kWh)
            </label>
            <input type="number" value={electricityKwh} onChange={(e) => setElectricityKwh(Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-text-muted flex items-center gap-2 mb-2">
              <Flame size={16} className="text-orange-500" /> Heating Gas (m³)
            </label>
            <input type="number" value={heatingGasM3} onChange={(e) => setHeatingGasM3(Number(e.target.value))} className={inputCls} />
          </div>
        </div>
      </div>

      {/* 3. Transport */}
      <div>
        <label className="text-[14px] font-bold text-text-primary block mb-3 border-b border-border pb-1">Transportation & Travel</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-semibold text-text-muted flex items-center gap-2 mb-2">
              <Car size={16} className="text-transport" /> {t('calc.business.fleet')}
            </label>
            <input type="number" value={fleetVehicles} onChange={(e) => setFleetVehicles(Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-text-muted flex items-center gap-2 mb-2">
              <Plane size={16} className="text-transport" /> Business Flights (km/yr)
            </label>
            <input type="number" value={flightKm} onChange={(e) => setFlightKm(Number(e.target.value))} className={inputCls} />
          </div>
        </div>
      </div>

      {/* 4. Operations */}
      <div>
        <label className="text-[14px] font-bold text-text-primary block mb-3 border-b border-border pb-1">Operations & Supply Chain</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-semibold text-text-muted flex items-center gap-2 mb-2">
              <Trash2 size={16} className="text-gray-400" /> Monthly Waste (kg)
            </label>
            <input type="number" value={wasteKg} onChange={(e) => setWasteKg(Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-text-muted flex items-center gap-2 mb-2">
              <ShoppingCart size={16} className="text-accent" /> Procurement Spend ($)
            </label>
            <input type="number" value={procurementSpend} onChange={(e) => setProcurementSpend(Number(e.target.value))} className={inputCls} />
          </div>
        </div>
      </div>

      <button type="button" onClick={calculate}
        className="w-full bg-accent border-none rounded-lg py-3.5 text-[15px] font-bold text-[#0A0A0A]
                   cursor-pointer font-sans hover:bg-accent-bright transition-colors mt-2">
        {t('calc.business.calculate')}
      </button>

      {result !== null && breakdown !== null && (
        <div className="bg-accent-glow border border-accent/30 rounded-lg p-5 text-center flex flex-col items-center">
          <p className="text-sm text-text-muted mb-1">{t('calc.business.annual')}</p>
          <p className="text-4xl font-extrabold text-accent">{result.toLocaleString()} {t('common.kg')}</p>
          <p className="text-[13px] text-text-muted mt-2">{t('calc.business.perEmployee', { n: Math.round(result / employees).toLocaleString() })}</p>
          
          <div className="grid grid-cols-3 gap-2 w-full mt-4 bg-surface-2 p-3 rounded-lg border border-border">
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Transport</p>
              <p className="text-sm font-bold text-text-primary">{breakdown.transport.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Energy</p>
              <p className="text-sm font-bold text-text-primary">{breakdown.energy.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Ops</p>
              <p className="text-sm font-bold text-text-primary">{breakdown.operations.toLocaleString()}</p>
            </div>
          </div>

          {onSave && (
            <button
              onClick={() => onSave(result, breakdown)}
              className="mt-5 flex items-center gap-2 px-6 py-2.5 rounded-lg border border-accent bg-transparent text-accent font-semibold text-[13px] hover:bg-accent-glow transition-colors cursor-pointer"
            >
              <Save size={16} /> Save Business Audit
            </button>
          )}
        </div>
      )}
    </div>
  );
}
