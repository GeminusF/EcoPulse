import { useEffect, useState, useCallback } from 'react';
import { TOUR_STEPS, useOnboarding } from '../../context/OnboardingContext';

export default function OnboardingTooltip() {
  const { tourActive, tourStep, nextStep, skipTour } = useOnboarding();
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (!tourActive) return;
    const step = TOUR_STEPS[tourStep];
    if (!step) return;
    const el = document.querySelector(step.target);
    if (!el) {
      setPos(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    setPos({ top: rect.bottom + 12, left: Math.max(16, rect.left), width: rect.width });
  }, [tourActive, tourStep]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [updatePosition]);

  if (!tourActive || !pos) return null;
  const step = TOUR_STEPS[tourStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[55] bg-[rgba(0,0,0,0.3)]" onClick={skipTour} />

      {/* Tooltip */}
      <div
        className="fixed z-[56] w-[280px] bg-surface border border-border rounded-xl shadow-2xl p-4 animate-fade-in"
        style={{ top: pos.top, left: Math.min(pos.left, window.innerWidth - 296) }}
      >
        {/* Arrow */}
        <div className="absolute -top-2 left-6 w-4 h-4 bg-surface border-l border-t border-border rotate-45" />

        <div className="relative">
          <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">
            Step {tourStep + 1} of {TOUR_STEPS.length}
          </p>
          <h4 className="text-sm font-bold text-text-primary mb-1">{step.title}</h4>
          <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
            <button onClick={skipTour} className="text-xs text-text-muted hover:text-text-primary transition-colors border-none bg-transparent cursor-pointer font-sans">
              Skip tour
            </button>
            <button
              onClick={nextStep}
              className="text-xs font-semibold text-white bg-accent px-3 py-1.5 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity font-sans"
            >
              {tourStep === TOUR_STEPS.length - 1 ? 'Done!' : 'Next →'}
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1 justify-center mt-2">
            {TOUR_STEPS.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === tourStep ? 'bg-accent' : 'bg-surface-2'}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
