import { Search, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function TopBar() {
  const { theme, toggle } = useTheme();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: 64,
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
      }}
    >
      {/* Left spacer */}
      <div style={{ flex: 1 }} />

      {/* Center search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 9999,
          width: 480,
          maxWidth: '100%',
          padding: '10px 16px',
          gap: 10,
        }}
      >
        <Search size={16} color="var(--color-text-muted)" />
        <input
          type="text"
          placeholder="Search data, reports..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: 14,
            color: 'var(--color-text-primary)',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Right actions */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Bell size={20} color="var(--color-text-muted)" />
        </button>
        <button
          onClick={toggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {theme === 'dark' ? (
            <Moon size={20} color="var(--color-text-muted)" />
          ) : (
            <Sun size={20} color="var(--color-text-muted)" />
          )}
        </button>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: 'white',
          }}
        >
          AZ
        </div>
      </div>
    </header>
  );
}
