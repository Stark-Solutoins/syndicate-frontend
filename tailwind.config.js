/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#C9A84C',
          green: '#1e8c5a',
          blue: '#2563a8',
          red: '#c0392b',
          purple: '#9b59b6',
        },
        bg: {
          DEFAULT: '#0D0D0D',
          surface: '#111827',
          card: '#1F2937',
          elevated: '#243047',
        },
        text: {
          DEFAULT: '#F9FAFB',
          muted: '#9CA3AF',
          subtle: '#6B7280',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'check-pop': { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.3)' }, '100%': { transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'ring-fill': { from: { strokeDashoffset: '283' }, to: { strokeDashoffset: 'var(--target-offset)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'check-pop': 'check-pop 0.3s ease',
        shimmer: 'shimmer 1.5s infinite linear',
        'ring-fill': 'ring-fill 1s ease-out forwards',
      },
    },
  },
  plugins: [],
}
