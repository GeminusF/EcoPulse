import { sectorPerformance } from '../../data/analyticsData';

export default function SectorPerformance() {
  return (
    <div className="card">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>Sector Performance</h3>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2, marginBottom: 16 }}>Progress toward emission targets</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sectorPerformance.map((s) => {
          const barWidth = Math.min(100, (s.current / s.target) * 100);
          return (
            <div key={s.sector} style={{ padding: 12, background: 'var(--color-surface-2)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.sector}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.trend}</span>
                  <span style={{
                    fontSize: 16, fontWeight: 800, color: s.gradeColor,
                    background: `${s.gradeColor}22`, padding: '2px 10px', borderRadius: 6,
                  }}>
                    {s.grade}
                  </span>
                </div>
              </div>
              <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 3, transition: 'width 0.6s ease',
                  width: `${barWidth}%`,
                  background: barWidth > 100 ? '#EF4444' : s.gradeColor,
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                <span>Current: {s.current.toLocaleString()} kg</span>
                <span>Target: {s.target.toLocaleString()} kg</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
