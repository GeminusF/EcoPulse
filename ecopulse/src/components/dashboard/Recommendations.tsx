import { useState } from 'react';
import { Bus, Lightbulb, Leaf, ChevronRight } from 'lucide-react';

interface RecommendationItem {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  detail: string;
}

const items: RecommendationItem[] = [
  {
    id: 'transport',
    icon: <Bus size={18} color="#22C55E" />,
    iconBg: 'rgba(34,197,94,0.15)',
    title: 'Use Public Transport',
    subtitle: 'Reduce individual car usage in cities',
    detail:
      "Switching to public transport can reduce your carbon footprint by up to 45%. Azerbaijan's expanding metro and bus network in Baku offers efficient alternatives to private vehicles.",
  },
  {
    id: 'energy',
    icon: <Lightbulb size={18} color="#F59E0B" />,
    iconBg: 'rgba(245,158,11,0.15)',
    title: 'Save Energy',
    subtitle: 'Switch to LED and efficient appliances',
    detail:
      'LED bulbs use 75% less energy than incandescent bulbs. Energy-efficient appliances with A+++ ratings can cut household energy consumption by 30–40%.',
  },
  {
    id: 'renewables',
    icon: <Leaf size={18} color="#22C55E" />,
    iconBg: 'rgba(34,197,94,0.15)',
    title: 'Switch to Renewables',
    subtitle: 'Invest in clean energy sources',
    detail:
      'Azerbaijan has significant solar and wind potential. Rooftop solar installations can offset 60–80% of household energy needs and reduce grid CO₂ dependency.',
  },
];

export default function Recommendations() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const activeItem = items.find((i) => i.id === activeModal);

  return (
    <div className="card">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
        Recommendations
      </h3>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
        Actionable tips to reduce emissions
      </p>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveModal(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-surface-2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: item.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {item.title}
              </p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {item.subtitle}
              </p>
            </div>
            <ChevronRight size={16} color="var(--color-text-muted)" />
          </div>
        ))}
      </div>

      {/* Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 16,
              padding: 24,
              maxWidth: 400,
              width: '90%',
            }}
          >
            <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {activeItem.title}
            </h4>
            <p
              style={{
                fontSize: 14,
                color: 'var(--color-text-secondary)',
                marginTop: 12,
                lineHeight: 1.6,
              }}
            >
              {activeItem.detail}
            </p>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                marginTop: 16,
                width: '100%',
                background: 'var(--color-accent)',
                border: 'none',
                borderRadius: 8,
                padding: '10px 0',
                fontSize: 14,
                fontWeight: 600,
                color: '#0A0A0A',
                cursor: 'pointer',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
