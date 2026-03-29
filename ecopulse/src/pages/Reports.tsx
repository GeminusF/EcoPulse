import { useState, useMemo, useEffect } from 'react';
import {
  Calendar, PieChart, Map, TrendingUp, Shield,
  Download, FileText, Clock, Plus,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/shared/PageHeader';
import TabPanel from '../components/shared/TabPanel';
import { reportTemplates, reportHistory } from '../data/reportsData';

const templateIcons: Record<string, typeof Calendar> = {
  calendar: Calendar, piechart: PieChart, map: Map, trending: TrendingUp, shield: Shield,
};

const inputCls = "w-full px-3.5 py-2.5 bg-surface-2 border border-border rounded-lg text-text-primary text-[13px] outline-none font-sans";

export default function Reports() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('templates');
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-12-31');
  const [format, setFormat] = useState('PDF');
  const [generated, setGenerated] = useState(false);
  const [localHistory, setLocalHistory] = useState<any[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['all']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  useEffect(() => {
    setLocalHistory(reportHistory);
  }, []);

  const tabs = useMemo(() => [
    { id: 'templates', label: t('reports.tab.templates') },
    { id: 'builder', label: t('reports.tab.builder') },
    { id: 'history', label: t('reports.tab.history') },
  ], [t]);

  const sectorFilters = useMemo(() => [
    { id: 'all', label: t('common.all') },
    { id: 'transport', label: t('sector.transport') },
    { id: 'energy', label: t('sector.energy') },
    { id: 'industry', label: t('sector.industry') }
  ], [t]);

  const toggleSector = (id: string) => {
    if (id === 'all') {
      setSelectedSectors(['all']);
    } else {
      setSelectedSectors(prev => {
        const next = prev.filter(s => s !== 'all');
        if (next.includes(id)) {
          const res = next.filter(s => s !== id);
          return res.length === 0 ? ['all'] : res;
        }
        return [...next, id];
      });
    }
  };

  const executeCustomGeneration = async () => {
    const name = `Custom_Report_${dateFrom}_to_${dateTo}`;
    
    if (format === 'PDF') {
      const { exportPdf } = await import('../utils/exportPdf');
      const mainEl = document.querySelector('main');
      if (mainEl) await exportPdf(mainEl as HTMLElement, name);
    } else if (format === 'CSV') {
      const { exportCsv } = await import('../utils/exportCsv');
      const headers = ['Date Range', 'Metric', 'Value', 'Sectors'];
      const rows = [
        [`${dateFrom} - ${dateTo}`, 'Total Emissions (kt)', '35200', selectedSectors.join(', ')],
        [`${dateFrom} - ${dateTo}`, 'Renewable Share (%)', '20', selectedSectors.join(', ')],
      ];
      exportCsv(name, headers, rows);
    } else {
      const { exportJson } = await import('../utils/exportCsv');
      const data = { 
        report: name, 
        generatedAt: new Date().toISOString(),
        parameters: { dateFrom, dateTo, sectors: selectedSectors, format },
        metrics: { total: 35200, renewable: 20 }
      };
      exportJson(name, data);
    }
  };

  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerationStep(0);
    setGenerated(false);

    // Simulated multi-step progress
    const steps = 4;
    let current = 0;
    
    const interval = setInterval(() => {
      current++;
      setGenerationStep(current);
      
      if (current >= steps) {
        clearInterval(interval);
        
        // Execute the actual export
        executeCustomGeneration();
        
        // Save to History
        const newReport = {
          id: `gen-${Date.now()}`,
          nameKey: 'reports.builder.custom', // Fallback or new key
          generatedAt: new Date().toISOString(),
          format,
          size: format === 'PDF' ? '1.2 MB' : '15 KB',
        };
        setLocalHistory(prev => [newReport, ...prev]);
        
        setIsGenerating(false);
        setGenerated(true);
        setTimeout(() => setGenerated(false), 5000);
      }
    }, 600); // 600ms per step
  };

  const handleDownload = async (nameKey: string, fmt: string, fileUrl?: string) => {
    const name = t(nameKey) || 'EcoPulse_Report';
    
    if (fileUrl) {
      // Direct mock file download
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileUrl.split('/').pop() || name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (fmt === 'PDF') {
      const { exportPdf } = await import('../utils/exportPdf');
      const mainEl = document.querySelector('main');
      if (mainEl) await exportPdf(mainEl as HTMLElement, name);
    } else if (fmt === 'CSV') {
      const { exportCsv } = await import('../utils/exportCsv');
      const headers = ['Date', 'Metric', 'Value'];
      const rows = [
        [new Date().toLocaleDateString(), 'Total Emissions (kt)', '35200'],
        [new Date().toLocaleDateString(), 'Renewable Share (%)', '20'],
        [new Date().toLocaleDateString(), 'Transport Share (%)', '34'],
        [new Date().toLocaleDateString(), 'Industrial Share (%)', '30'],
      ];
      exportCsv(name, headers, rows);
    } else {
      const { exportJson } = await import('../utils/exportCsv');
      const data = { 
        report: name, 
        generatedAt: new Date().toISOString(),
        metrics: { total: 35200, renewable: 20 }
      };
      exportJson(name, data);
    }
  };

  return (
    <div className="p-4 md:p-6 flex flex-col gap-4">
      <PageHeader title={t('reports.title')} subtitle={t('reports.subtitle')} />
      <TabPanel tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reportTemplates.map((tpl) => {
            const Icon = templateIcons[tpl.icon] ?? FileText;
            return (
              <div key={tpl.id} className="card p-5 cursor-pointer" onClick={() => handleDownload(tpl.nameKey, tpl.format, tpl.fileUrl)}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-accent-glow flex items-center justify-center">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">{t(tpl.categoryKey)}</span>
                </div>
                <h4 className="text-sm font-bold text-text-primary">{t(tpl.nameKey)}</h4>
                <p className="text-xs text-text-muted mt-1 leading-snug">{t(tpl.descriptionKey)}</p>
                <div className="flex items-center gap-1 mt-3 text-accent text-xs font-semibold">
                  <Download size={12} /> {tpl.format} • {t('reports.download')}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="card p-5 md:p-6 max-w-[600px]">
          <h3 className="text-base font-bold text-text-primary mb-4">{t('reports.builder.title')}</h3>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1.5">{t('reports.builder.from')}</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1.5">{t('reports.builder.to')}</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1.5">{t('reports.builder.sectors')}</label>
              <div className="flex gap-2 flex-wrap">
                {sectorFilters.map((s) => {
                  const isActive = selectedSectors.includes(s.id);
                  return (
                    <button key={s.id} type="button" onClick={() => toggleSector(s.id)}
                      className={`px-3.5 py-1.5 rounded-md border text-xs font-semibold cursor-pointer font-sans transition-colors
                        ${isActive ? 'bg-accent-glow text-accent border-accent' : 'bg-surface-2 text-text-muted border-border hover:border-border-active'}`}>
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1.5">{t('reports.builder.format')}</label>
              <div className="flex gap-2">
                {['PDF', 'CSV', 'JSON'].map((f) => (
                  <button key={f} type="button" onClick={() => setFormat(f)}
                    className={`px-3.5 py-1.5 rounded-md border text-xs font-semibold cursor-pointer font-sans transition-colors
                      ${format === f ? 'border-accent bg-accent-glow text-accent' : 'border-border bg-surface-2 text-text-muted hover:border-border-active'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" onClick={handleGenerate} disabled={isGenerating}
              className={`w-full py-3.5 rounded-lg border-none text-sm font-bold cursor-pointer flex items-center justify-center gap-2 font-sans transition-all
                          ${isGenerating ? 'bg-surface-2 text-text-muted' : 'bg-accent text-[#0A0A0A] hover:bg-accent-bright'}`}>
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-text-muted border-t-accent rounded-full animate-spin" />
                  {generationStep === 0 && t('reports.progress.starting', 'Initializing engine...')}
                  {generationStep === 1 && t('reports.progress.gathering', 'Compiling data for selected period...')}
                  {generationStep === 2 && t('reports.progress.processing', 'Applying analytic filters...')}
                  {generationStep === 3 && t('reports.progress.formatting', `Generating ${format} document...`)}
                </>
              ) : (
                <>
                  <Plus size={16} /> {t('reports.builder.generate')}
                </>
              )}
            </button>

            {generated && (
              <div className="p-3 bg-accent-glow border border-accent/30 rounded-lg text-center text-accent text-[13px] font-semibold animate-in fade-in slide-in-from-top-2">
                {t('reports.builder.success')}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">{t('reports.table.report')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">{t('reports.table.date')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">{t('reports.table.format')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">{t('reports.table.size')}</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted"></th>
              </tr>
            </thead>
            <tbody>
              {localHistory.map((r) => (
                <tr key={r.id} className="border-b border-border">
                  <td className="px-4 py-3 text-[13px] font-semibold text-text-primary">{t(r.nameKey)}</td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    <div className="flex items-center gap-1">
                      <Clock size={12} /> {new Date(r.generatedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded
                      ${r.format === 'PDF' ? 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]'
                        : r.format === 'CSV' ? 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]'
                        : 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]'}`}>
                      {r.format}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">{r.size}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => handleDownload(r.nameKey, r.format)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-transparent
                                 text-text-muted text-[11px] cursor-pointer font-sans hover:border-accent hover:text-accent transition-colors">
                      <Download size={12} /> {t('reports.download')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
