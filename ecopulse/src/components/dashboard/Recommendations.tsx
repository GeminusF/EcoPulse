import { useState, useRef } from 'react';
import { Bus, Lightbulb, Leaf, Server, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const itemIds = ['transport', 'energy', 'renewables', 'digital', 'circular'] as const;

function iconFor(id: typeof itemIds[number]) {
  switch (id) {
    case 'transport': return <Bus size={20} color="#22C55E" />;
    case 'energy': return <Lightbulb size={20} color="#F59E0B" />;
    case 'renewables': return <Leaf size={20} color="#22C55E" />;
    case 'digital': return <Server size={20} color="#A855F7" />;
    case 'circular': return <RefreshCw size={20} color="#3B82F6" />;
  }
}

function iconBgFor(id: typeof itemIds[number]) {
  switch (id) {
    case 'transport': return 'rgba(34,197,94,0.15)';
    case 'energy': return 'rgba(245,158,11,0.15)';
    case 'renewables': return 'rgba(34,197,94,0.15)';
    case 'digital': return 'rgba(168,85,247,0.15)';
    case 'circular': return 'rgba(59,130,246,0.15)';
  }
}

export default function Recommendations() {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState<typeof itemIds[number] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="card flex flex-col h-full relative group">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-text-primary">{t('dash.rec.title')}</h3>
          <p className="text-[13px] text-text-muted mt-0.5">{t('dash.rec.subtitle')}</p>
        </div>
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button onClick={() => scroll('left')} className="p-1 rounded bg-surface-2 hover:bg-border text-text-muted border-none cursor-pointer"><ChevronLeft size={16}/></button>
          <button onClick={() => scroll('right')} className="p-1 rounded bg-surface-2 hover:bg-border text-text-muted border-none cursor-pointer"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="mt-5 flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x flex-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {itemIds.map((id) => (
          <div key={id} onClick={() => setActiveModal(id)}
            className="flex-shrink-0 w-[180px] bg-surface-2 border border-border transition-colors hover:border-accent/30 rounded-xl p-4 cursor-pointer snap-start flex flex-col">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ background: iconBgFor(id) }}>
              {iconFor(id)}
            </div>
            <p className="text-[14px] font-bold text-text-primary mb-1 leading-tight">{t(`rec.${id}.title`)}</p>
            <p className="text-[12px] text-text-muted mt-auto line-clamp-2 leading-relaxed">{t(`rec.${id}.subtitle`)}</p>
          </div>
        ))}
      </div>

      {activeModal && (
        <div onClick={() => setActiveModal(null)}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-border rounded-2xl p-6 max-w-[420px] w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: iconBgFor(activeModal) }}>
              {iconFor(activeModal)}
            </div>
            <h4 className="text-xl font-extrabold text-text-primary mb-2">{t(`rec.${activeModal}.title`)}</h4>
            <p className="text-[14px] text-text-muted leading-relaxed whitespace-pre-line">{t(`rec.${activeModal}.detail`)}</p>
            <button type="button" onClick={() => setActiveModal(null)}
              className="mt-6 w-full bg-accent hover:bg-accent-bright border-none rounded-xl py-3 text-[15px] font-bold
                         text-[#0A0A0A] cursor-pointer transition-colors shadow-lg shadow-accent/20">
              {t('common.gotIt')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
