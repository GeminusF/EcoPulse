import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

export default function SearchDropdown() {
  const { query, setQuery, results, isOpen, close } = useSearch();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, close]);

  const handleSelect = (route: string) => {
    navigate(route);
    close();
  };

  if (!isOpen) return null;

  // Group results by type
  const grouped = results.reduce((acc, item) => {
    (acc[item.type] = acc[item.type] || []).push(item);
    return acc;
  }, {} as Record<string, typeof results>);

  const typeLabels: Record<string, string> = {
    page: 'Pages', region: 'Regions', action: 'Quick Actions', infrastructure: 'Infrastructure',
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] bg-[rgba(0,0,0,0.4)]" onClick={close}>
      <div ref={panelRef} className="w-[520px] max-w-[90vw] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={18} className="text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, regions, actions…"
            className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted font-sans"
            onKeyDown={(e) => {
              if (e.key === 'Escape') close();
              if (e.key === 'Enter' && results.length > 0) handleSelect(results[0].route);
            }}
          />
          <div className="flex items-center gap-1">
            <kbd className="text-[10px] text-text-muted px-1.5 py-0.5 bg-surface-2 rounded border border-border font-mono">ESC</kbd>
            <button onClick={close} className="p-1 rounded-md hover:bg-surface-2 transition-colors border-none bg-transparent cursor-pointer">
              <X size={14} className="text-text-muted" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto py-2">
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <div className="px-4 py-1.5">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{typeLabels[type] || type}</span>
              </div>
              {items.map((item, i) => (
                <button
                  key={`${item.label}-${i}`}
                  onClick={() => handleSelect(item.route)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-surface-2 transition-colors border-none bg-transparent cursor-pointer font-sans"
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[13px] text-text-primary">{item.label}</span>
                  <span className="text-[10px] text-text-muted ml-auto opacity-60">{item.route}</span>
                </button>
              ))}
            </div>
          ))}
          {results.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-text-muted">No results found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
