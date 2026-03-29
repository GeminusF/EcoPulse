import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 100) setVisible(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 animate-bounce opacity-60 pointer-events-none">
      <span className="text-[11px] text-text-muted font-medium">More insights below</span>
      <ChevronDown size={18} className="text-text-muted" />
    </div>
  );
}
