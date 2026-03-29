import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface OnboardingCtx {
  showWelcome: boolean;
  tourActive: boolean;
  tourStep: number;
  dismissWelcome: () => void;
  startTour: () => void;
  nextStep: () => void;
  skipTour: () => void;
}

const STORAGE_KEY = 'ecopulse-onboarding';

const OnboardingContext = createContext<OnboardingCtx>({
  showWelcome: false, tourActive: false, tourStep: 0,
  dismissWelcome: () => {}, startTour: () => {}, nextStep: () => {}, skipTour: () => {},
});

export const TOUR_STEPS = [
  { target: '[data-tour="sidebar"]', title: 'Navigation', desc: 'Browse all sections from the sidebar. Each page offers different insights into emissions data.' },
  { target: '[data-tour="search"]', title: 'Quick Search', desc: 'Press Ctrl+K or click here to search pages, regions, and actions instantly.' },
  { target: '[data-tour="notifications"]', title: 'Notifications', desc: 'Stay updated with emission alerts, report availability, and milestones.' },
  { target: '[data-tour="theme"]', title: 'Theme & Settings', desc: 'Customize your experience — switch between dark, light, or auto theme.' },
  { target: '[data-tour="year-selector"]', title: 'Year Selector', desc: 'Navigate through 2023–2030. Data from April 2026 onward is AI-predicted.' },
];

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState(() =>
    localStorage.getItem(STORAGE_KEY) === 'done',
  );
  const [showWelcome, setShowWelcome] = useState(!completed);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const dismissWelcome = useCallback(() => {
    setShowWelcome(false);
    setTourActive(true);
    setTourStep(0);
  }, []);

  const startTour = useCallback(() => {
    setShowWelcome(false);
    setTourActive(true);
    setTourStep(0);
  }, []);

  const nextStep = useCallback(() => {
    if (tourStep >= TOUR_STEPS.length - 1) {
      setTourActive(false);
      localStorage.setItem(STORAGE_KEY, 'done');
      setCompleted(true);
    } else {
      setTourStep((s) => s + 1);
    }
  }, [tourStep]);

  const skipTour = useCallback(() => {
    setTourActive(false);
    setShowWelcome(false);
    localStorage.setItem(STORAGE_KEY, 'done');
    setCompleted(true);
  }, []);

  return (
    <OnboardingContext.Provider value={{ showWelcome, tourActive, tourStep, dismissWelcome, startTour, nextStep, skipTour }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
