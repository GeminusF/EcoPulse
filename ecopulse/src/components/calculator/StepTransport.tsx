import { Car, Plane } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { vehicleTypes } from '../../data/calculatorData';

interface Props {
  commuteKm: number;
  vehicleType: string;
  flightKm: number;
  onChange: (field: string, value: number | string) => void;
}

export default function StepTransport({ commuteKm, vehicleType, flightKm, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-[13px] font-semibold text-text-muted flex items-center gap-2 mb-2">
          <Car size={16} className="text-transport" /> Monthly Driving Distance (km)
        </label>
        <input type="number" value={commuteKm} onChange={(e) => onChange('commuteKm', Number(e.target.value))}
          className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text-primary text-[15px] font-semibold outline-none font-sans" />
      </div>

      <div>
        <label className="text-[13px] font-semibold text-text-muted block mb-2">{t('calc.transport.vehicleType')}</label>
        <div className="grid grid-cols-3 gap-2">
          {vehicleTypes.map((v) => (
            <button key={v.id} type="button" onClick={() => onChange('vehicleType', v.id)}
              className={`py-2.5 px-2 rounded-lg border text-xs font-semibold cursor-pointer font-sans transition-all
                ${vehicleType === v.id
                  ? 'border-accent bg-accent-glow text-accent'
                  : 'border-border bg-surface-2 text-text-muted hover:border-border-active'}`}>
              {t(v.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-semibold text-text-muted flex items-center gap-2 mb-2">
          <Plane size={16} className="text-industry" /> {/* Flight Distance (km/year) */}
          Flight Distance (km/year)
        </label>
        <input type="number" value={flightKm} onChange={(e) => onChange('flightKm', Number(e.target.value))}
          className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text-primary text-[15px] font-semibold outline-none font-sans" />
      </div>
    </div>
  );
}
