/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // or 'media' for system-based
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Core Theme Palette
        kol: {
          bg: '#0d0d0d',
          surface: '#1a1a1a',
          border: '#2a2a2a',
          accent: '#6b00b3',
          accentHover: '#8b00e8',
          text: '#e5e5e5',
          textMuted: '#a1a1a1',
          glow: '#a855f7',
          danger: '#b91c1c',
          success: '#10b981',
          warning: '#f59e0b',
        },

        // Default dark background layers
        dark: {
          100: '#181818',
          200: '#141414',
          300: '#0f0f0f',
          400: '#0a0a0a',
        },
      },

      // 🧩 Shadows
      boxShadow: {
        'glow': '0 0 8px rgba(107, 0, 179, 0.4)',
        'inner-accent': 'inset 0 0 6px rgba(107, 0, 179, 0.3)',
        'soft': '0 0 12px rgba(0, 0, 0, 0.4)',
      },

      // ⚙️ Transitions
      transitionTimingFunction: {
        'kol-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // 🧱 Fonts
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        gothic: ['Cinzel', 'serif'],
      },

      // 🎚 Radii
      borderRadius: {
        kol: '0.75rem',
        xl: '1.25rem',
      },

      // 🌌 Animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseAccent: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(107, 0, 179, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(139, 0, 232, 0.6)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out',
        pulseAccent: 'pulseAccent 2s infinite ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
