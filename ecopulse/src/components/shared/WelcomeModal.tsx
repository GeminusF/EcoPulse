import { Leaf, ArrowRight, X } from 'lucide-react';

interface Props { onDismiss: () => void; onSkip: () => void; }

export default function WelcomeModal({ onDismiss, onSkip }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,0,0,0.6)] animate-fade-in">
      <div className="w-[480px] max-w-[90vw] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-[#22C55E] to-[#059669] px-8 py-10 text-center">
          <button onClick={onSkip} className="absolute top-4 right-4 p-1.5 rounded-lg bg-[rgba(255,255,255,0.2)] border-none cursor-pointer hover:bg-[rgba(255,255,255,0.3)] transition-colors">
            <X size={16} color="white" />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.2)] flex items-center justify-center mx-auto mb-4">
            <Leaf size={32} color="white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1">Welcome to EcoPulse</h1>
          <p className="text-sm text-white opacity-80">Azerbaijan CO₂ Emissions Monitoring Platform</p>
        </div>

        {/* Features */}
        <div className="px-8 py-6">
          <div className="flex flex-col gap-3">
            {[
              { emoji: '📊', title: 'Real-time Dashboard', desc: 'Monitor emissions across all sectors and regions' },
              { emoji: '🤖', title: 'AI Predictions', desc: 'LSTM-powered forecasts from 2023 to 2030' },
              { emoji: '🔬', title: 'Policy Simulation', desc: 'Test carbon reduction scenarios and compare outcomes' },
              { emoji: '🗺️', title: 'Interactive Map', desc: 'Explore hotspots and infrastructure across Azerbaijan' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-lg shrink-0 mt-0.5">{f.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{f.title}</p>
                  <p className="text-xs text-text-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 pb-6 flex gap-3">
          <button onClick={onSkip} className="flex-1 py-2.5 rounded-xl border border-border bg-transparent text-text-muted text-sm font-semibold cursor-pointer hover:bg-surface-2 transition-colors font-sans">
            Skip
          </button>
          <button onClick={onDismiss} className="flex-1 py-2.5 rounded-xl border-none bg-accent text-white text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-sans">
            Take a Tour <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
