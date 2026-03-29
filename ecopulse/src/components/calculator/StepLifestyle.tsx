
import { ShoppingBag, Droplets, Laptop, Shirt, Recycle } from 'lucide-react';

interface Props {
  beefKg: number;
  chickenKg: number;
  vegKg: number;
  shoppingSpend: number;
  recyclingPct: number;
  waterM3: number;
  clothingItems: number;
  digitalHours: number;
  onChange: (field: string, value: number | string) => void;
}

export default function StepLifestyle({
  beefKg, chickenKg, vegKg, shoppingSpend, recyclingPct, waterM3, clothingItems, digitalHours, onChange
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      
      {/* Food Consumption */}
      <div>
        <label className="text-[13px] font-bold text-text-primary block mb-3 border-b border-border pb-1">Food Consumption (kg / month)</label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-text-muted mb-1 block">Beef / Red Meat</label>
            <input type="number" min={0} value={beefKg} onChange={(e) => onChange('beefKg', Number(e.target.value))}
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text-primary font-semibold outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-text-muted mb-1 block">Chicken / White</label>
            <input type="number" min={0} value={chickenKg} onChange={(e) => onChange('chickenKg', Number(e.target.value))}
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text-primary font-semibold outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-text-muted mb-1 block">Vegetables</label>
            <input type="number" min={0} value={vegKg} onChange={(e) => onChange('vegKg', Number(e.target.value))}
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text-primary font-semibold outline-none focus:border-accent" />
          </div>
        </div>
      </div>

      {/* Shopping & Utilities */}
      <label className="text-[13px] font-bold text-text-primary block mb-1 mt-2 border-b border-border pb-1">Shopping & Leisure</label>

      <div>
        <label className="text-[13px] font-semibold text-text-muted flex items-center gap-2 mb-2">
          <ShoppingBag size={16} className="text-secondary" /> Monthly Discretionary Spend ($)
        </label>
        <input type="number" value={shoppingSpend} onChange={(e) => onChange('shoppingSpend', Number(e.target.value))}
          className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text-primary text-[15px] font-semibold outline-none font-sans" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[13px] font-semibold text-text-muted flex items-center gap-2 mb-2">
            <Shirt size={16} className="text-accent" /> New Clothes (items/mo)
          </label>
          <input type="number" value={clothingItems} onChange={(e) => onChange('clothingItems', Number(e.target.value))}
            className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text-primary text-[15px] font-semibold outline-none font-sans" />
        </div>
        <div>
          <label className="text-[13px] font-semibold text-text-muted flex items-center gap-2 mb-2">
            <Laptop size={16} className="text-[#3B82F6]" /> Streaming (hrs/day)
          </label>
          <input type="number" value={digitalHours} onChange={(e) => onChange('digitalHours', Number(e.target.value))}
            className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text-primary text-[15px] font-semibold outline-none font-sans" />
        </div>
      </div>

      {/* Resource Usage */}
      <label className="text-[13px] font-bold text-text-primary block mb-1 mt-2 border-b border-border pb-1">Resource & Waste</label>

      <div>
        <label className="text-[13px] font-semibold text-text-muted flex items-center gap-2 mb-2">
          <Droplets size={16} className="text-[#0EA5E9]" /> Monthly Water Usage (m³)
        </label>
        <input type="number" value={waterM3} onChange={(e) => onChange('waterM3', Number(e.target.value))}
          className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text-primary text-[15px] font-semibold outline-none font-sans" />
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <label className="text-[13px] font-semibold text-text-muted flex items-center gap-2">
            <Recycle size={16} className="text-accent" /> Household Waste Recycled (%)
          </label>
          <span className="text-[13px] font-bold text-accent">{recyclingPct}%</span>
        </div>
        <input type="range" min={0} max={100} step={5} value={recyclingPct}
          onChange={(e) => onChange('recyclingPct', Number(e.target.value))}
          className="w-full cursor-pointer accent-accent" />
      </div>

    </div>
  );
}
