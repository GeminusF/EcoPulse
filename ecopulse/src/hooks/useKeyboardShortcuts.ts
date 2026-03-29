import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const ROUTES = ['/', '/calculator', '/analytics', '/prediction', '/simulation', '/map', '/reports'];

export default function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { open: openSearch } = useSearch();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Ctrl+K / Cmd+K → Open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
        return;
      }

      // Ctrl+D → Toggle theme (handled by SettingsContext already integrated in UserMenu)
      // ESC → Handled by individual modals

      if (isInput) return;

      // Number keys 1-7 → Navigate to pages
      const num = parseInt(e.key);
      if (num >= 1 && num <= 7 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        navigate(ROUTES[num - 1]);
        return;
      }

      // ? → Show shortcuts help (would need a global state, skip for now)
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [navigate, openSearch]);
}
