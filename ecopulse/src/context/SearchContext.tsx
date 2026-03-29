import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import Fuse from 'fuse.js';

export interface SearchItem {
  type: 'page' | 'region' | 'infrastructure' | 'action';
  label: string;
  route: string;
  icon?: string;
}

const allItems: SearchItem[] = [
  // Pages
  { type: 'page', label: 'Dashboard', route: '/', icon: '📊' },
  { type: 'page', label: 'Calculator', route: '/calculator', icon: '🧮' },
  { type: 'page', label: 'Analytics', route: '/analytics', icon: '📈' },
  { type: 'page', label: 'AI Prediction', route: '/prediction', icon: '🤖' },
  { type: 'page', label: 'Simulation', route: '/simulation', icon: '🔬' },
  { type: 'page', label: 'Interactive Map', route: '/map', icon: '🗺️' },
  { type: 'page', label: 'Reports', route: '/reports', icon: '📄' },
  { type: 'page', label: 'Vision 2030', route: '/vision', icon: '🎯' },
  { type: 'page', label: 'AI Gap Analysis', route: '/vision/gap_analysis', icon: '📊' },
  { type: 'page', label: 'Vision Roadmap', route: '/vision/roadmap', icon: '🛣️' },
  { type: 'page', label: 'Mega Projects', route: '/vision/mega_projects', icon: '🏗️' },
  // Regions
  { type: 'region', label: 'Baku', route: '/map', icon: '📍' },
  { type: 'region', label: 'Sumqayit', route: '/map', icon: '📍' },
  { type: 'region', label: 'Ganja', route: '/map', icon: '📍' },
  { type: 'region', label: 'Mingachevir', route: '/map', icon: '📍' },
  { type: 'region', label: 'Shirvan', route: '/map', icon: '📍' },
  { type: 'region', label: 'Nakhchivan', route: '/map', icon: '📍' },
  { type: 'region', label: 'Karabakh', route: '/map', icon: '📍' },
  { type: 'region', label: 'Absheron', route: '/analytics', icon: '📍' },
  { type: 'region', label: 'Karabakh Smart Villages', route: '/vision/mega_projects', icon: '🏘️' },
  // Actions
  { type: 'action', label: 'Carbon Footprint Calculator', route: '/calculator', icon: '🌱' },
  { type: 'action', label: 'Run Simulation', route: '/simulation', icon: '▶️' },
  { type: 'action', label: 'Download Report', route: '/reports', icon: '📥' },
  { type: 'action', label: 'View Predictions 2030', route: '/prediction', icon: '🔮' },
  { type: 'action', label: 'Energy Mix Forecast', route: '/analytics', icon: '⚡' },
  { type: 'action', label: 'Compare Countries', route: '/analytics', icon: '🌍' },
  // Infrastructure
  { type: 'infrastructure', label: 'Sangachal Terminal', route: '/map', icon: '🏭' },
  { type: 'infrastructure', label: 'Heydar Aliyev Refinery', route: '/map', icon: '⚙️' },
  { type: 'infrastructure', label: 'Azerbaijan Thermal Power', route: '/map', icon: '🔥' },
  { type: 'infrastructure', label: 'Mingachevir Hydro Plant', route: '/map', icon: '💧' },
  { type: 'infrastructure', label: 'Black Sea Energy Cable', route: '/vision/mega_projects', icon: '🔌' },
  { type: 'infrastructure', label: 'Caspian Offshore Wind', route: '/vision/mega_projects', icon: '💨' },
];

interface SearchCtx {
  query: string;
  setQuery: (q: string) => void;
  results: SearchItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const SearchContext = createContext<SearchCtx>({
  query: '', setQuery: () => {}, results: [], isOpen: false, open: () => {}, close: () => {},
});

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const fuse = useMemo(() => new Fuse(allItems, {
    keys: ['label'],
    threshold: 0.35,
    includeScore: true,
  }), []);

  const results = useMemo(() => {
    if (!query.trim()) return allItems.filter(item => item.type === 'page');
    return fuse.search(query).map((r) => r.item).slice(0, 10);
  }, [query, fuse]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => { setIsOpen(false); setQuery(''); }, []);

  return (
    <SearchContext.Provider value={{ query, setQuery, results, isOpen, open, close }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);
