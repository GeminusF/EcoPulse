import { X } from 'lucide-react';

interface Props { open: boolean; onClose: () => void; }

const shortcuts = [
  { keys: ['Ctrl', 'K'], desc: 'Open search' },
  { keys: ['1-7'], desc: 'Navigate to pages' },
  { keys: ['Esc'], desc: 'Close modals' },
];

export default function ShortcutsHelp({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]" onClick={onClose}>
      <div className="w-[380px] max-w-[90vw] bg-surface border border-border rounded-2xl shadow-2xl p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-primary">⌨️ Keyboard Shortcuts</h3>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-surface-2 transition-colors border-none bg-transparent cursor-pointer">
            <X size={16} className="text-text-muted" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {shortcuts.map((s) => (
            <div key={s.desc} className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{s.desc}</span>
              <div className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd key={k} className="text-xs text-text-primary px-2 py-1 bg-surface-2 rounded-md border border-border font-mono">{k}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
