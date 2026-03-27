import { useState } from 'react';
import {
  Calendar, PieChart, Map, TrendingUp, Shield,
  Download, FileText, Clock, Plus,
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import TabPanel from '../components/shared/TabPanel';
import { reportTemplates, reportHistory } from '../data/reportsData';

const templateIcons: Record<string, typeof Calendar> = {
  calendar: Calendar, piechart: PieChart, map: Map, trending: TrendingUp, shield: Shield,
};

const tabs = [
  { id: 'templates', label: 'Report Templates' },
  { id: 'builder', label: 'Custom Builder' },
  { id: 'history', label: 'History' },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('templates');
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-12-31');
  const [format, setFormat] = useState('PDF');
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerated(true);
    setTimeout(() => setGenerated(false), 3000);
  };

  const handleDownload = (name: string, fmt: string) => {
    const data = { report: name, generatedAt: new Date().toISOString(), format: fmt, data: 'mock report content' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
    borderRadius: 8, color: 'var(--color-text-primary)', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHeader title="Reports" subtitle="Generate, export, and manage emission reports" />
      <TabPanel tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {reportTemplates.map((t) => {
            const Icon = templateIcons[t.icon] ?? FileText;
            return (
              <div key={t.id} className="card" style={{ padding: 20, cursor: 'pointer' }}
                onClick={() => handleDownload(t.name, 'JSON')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color="var(--color-accent)" />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.category}</span>
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{t.name}</h4>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.4 }}>{t.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, color: 'var(--color-accent)', fontSize: 12, fontWeight: 600 }}>
                  <Download size={12} /> Download
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="card" style={{ padding: 24, maxWidth: 600 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 16 }}>Build Custom Report</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>From</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>To</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Sectors</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Transport', 'Energy', 'Industry', 'All'].map((s) => (
                  <button key={s} style={{
                    padding: '6px 14px', borderRadius: 6, border: '1px solid var(--color-border)',
                    background: s === 'All' ? 'var(--color-accent-glow)' : 'var(--color-surface-2)',
                    color: s === 'All' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Format</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['PDF', 'CSV', 'JSON'].map((f) => (
                  <button key={f} onClick={() => setFormat(f)} style={{
                    padding: '6px 14px', borderRadius: 6, border: '1px solid',
                    borderColor: format === f ? 'var(--color-accent)' : 'var(--color-border)',
                    background: format === f ? 'var(--color-accent-glow)' : 'var(--color-surface-2)',
                    color: format === f ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleGenerate} style={{
              width: '100%', padding: '14px 0', borderRadius: 8, border: 'none',
              background: 'var(--color-accent)', color: '#0A0A0A', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'inherit',
            }}>
              <Plus size={16} /> Generate Report
            </button>
            {generated && (
              <div style={{ padding: 12, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, textAlign: 'center', color: 'var(--color-accent)', fontSize: 13, fontWeight: 600 }}>
                Report generated successfully! Downloading...
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Report</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Format</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Size</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}></th>
              </tr>
            </thead>
            <tbody>
              {reportHistory.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {new Date(r.generatedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                      background: r.format === 'PDF' ? 'rgba(239,68,68,0.15)' : r.format === 'CSV' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)',
                      color: r.format === 'PDF' ? '#EF4444' : r.format === 'CSV' ? '#22C55E' : '#3B82F6',
                    }}>
                      {r.format}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-muted)' }}>{r.size}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDownload(r.name, r.format)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                        borderRadius: 6, border: '1px solid var(--color-border)', background: 'transparent',
                        color: 'var(--color-text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      <Download size={12} /> Download
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
