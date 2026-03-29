import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface SaveAsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  defaultName: string;
  title: string;
}

export default function SaveAsModal({ isOpen, onClose, onSave, defaultName, title }: SaveAsModalProps) {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
    }
  }, [isOpen, defaultName]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 isolate">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h3 className="text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Save size={18} className="text-[var(--color-accent)]" />
            {title}
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="p-4">
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2">
            Save As (Name)
          </label>
          <input
            autoFocus
            type="text"
            className="w-full px-3 py-2.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Calculation"
            required
          />
          
          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-bold bg-[var(--color-accent)] text-[#0A0A0A] rounded-lg hover:bg-[var(--color-accent-bright)] transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
