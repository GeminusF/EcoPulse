/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        sidebar: 'var(--color-sidebar)',
        border: 'var(--color-border)',
        'border-active': 'var(--color-border-active)',
        accent: 'var(--color-accent)',
        'accent-bright': 'var(--color-accent-bright)',
        'accent-dim': 'var(--color-accent-dim)',
        'accent-glow': 'var(--color-accent-glow)',
        'text-primary': 'var(--color-text-primary)',
        'text-muted': 'var(--color-text-muted)',
        'text-secondary': 'var(--color-text-secondary)',
        transport: 'var(--color-transport)',
        energy: 'var(--color-energy)',
        industry: 'var(--color-industry)',
        positive: 'var(--color-positive)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      }
    },
  },
  plugins: [],
}
