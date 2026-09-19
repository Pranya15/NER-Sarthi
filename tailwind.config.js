/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          app: 'var(--bg-app)',
          card: 'var(--bg-card)',
          'card-hover': 'var(--bg-card-hover)',
          'card-subtle': 'var(--bg-card-subtle)',
          panel: 'var(--bg-panel)',
          'panel-subtle': 'var(--bg-panel-subtle)',
          input: 'var(--bg-input)',
          dropdown: 'var(--bg-dropdown)',
          chip: 'var(--bg-chip)',
          border: 'var(--border-default)',
          'border-subtle': 'var(--border-subtle)',
          'border-strong': 'var(--border-strong)',
          'border-accent': 'var(--border-accent)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          dim: 'var(--text-dim)',
          accent: 'var(--text-accent)',
          'accent-bright': 'var(--text-accent-bright)',
        },
        ner: {
          navy: '#0b1329',
          dark: '#0f172a',
          blue: '#1e3a8a',
          accent: '#06b6d4',
          light: '#f8fafc',
          card: 'rgba(255, 255, 255, 0.75)',
          border: 'rgba(255, 255, 255, 0.4)',
        },
        risk: {
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': 'var(--shadow-glass)',
        'glass-hover': 'var(--shadow-glass-hover)',
        'popover': 'var(--shadow-popover)',
        'glow-cyan': 'var(--glow-cyan)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
