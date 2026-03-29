import { Zap, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { heatingTypes } from '../../data/calculatorData';

interface Props {
  electricityKwh: number;
  heatingType: string;
  heatingGasM3: number;
  onChange: (field: string, value: number | string) => void;
}

export default function StepEnergy({ electricityKwh, heatingType, heatingGasM3, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-[13px] font-semibold text-text-muted flex items-center gap-2 mb-2">
          <Zap size={16} className="text-energy" /> {t('calc.energy.monthlyElec')}
        </label>
        <input type="number" value={electricityKwh} onChange={(e) => onChange('electricityKwh', Number(e.target.value))}
          className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text-primary text-[15px] font-semibold outline-none font-sans" />
      </div>

      <div>
        <label className="text-[13px] font-semibold text-text-muted block mb-2">{t('calc.energy.heatingType')}</label>
        <div className="grid grid-cols-2 gap-2">
          {heatingTypes.map((h) => (
            <button key={h.id} type="button" onClick={() => onChange('heatingType', h.id)}
              className={`py-2.5 px-3 rounded-lg border text-[13px] font-semibold cursor-pointer font-sans transition-all
                ${heatingType === h.id
                  ? 'border-accent bg-accent-glow text-accent'
                  : 'border-border bg-surface-2 text-text-muted hover:border-border-active'}`}>
              {t(h.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-semibold text-text-muted flex items-center gap-2 mb-2">
          <Home size={16} className="text-accent" /> Monthly Heating Volume (m³ / liters equivalent)
        </label>
        <input type="number" value={heatingGasM3} onChange={(e) => onChange('heatingGasM3', Number(e.target.value))}
          className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text-primary text-[15px] font-semibold outline-none font-sans" />
      </div>
    </div>
  );
}
