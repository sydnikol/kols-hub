/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🖤 Core Gothic Theme Palette - Deep tones only
        kol: {
          bg: '#0d0d0d',          // Pure black
          surface: '#1a1a1a',     // Deep charcoal
          border: '#2a2a2a',      // Dark gray
          accent: '#6b00b3',      // Deep purple
          accentHover: '#8b00e8', // Rich purple
          text: '#e5e5e5',        // Light gray
          textMuted: '#a1a1a1',   // Medium gray
          glow: '#7c3aed',        // Deep violet glow
          danger: '#7f1d1d',      // Deep crimson
          success: '#047857',     // Deep emerald
          warning: '#b45309',     // Deep indigo
          info: '#1e3a8a',        // Deep indigo
        },

        // Dark background layers
        dark: {
          100: '#181818',
          200: '#141414',
          300: '#0f0f0f',
          400: '#0a0a0a',
        },

        // Deep color variants only
        deep: {
          purple: {
            900: '#3b0764',
            800: '#581c87',
            700: '#6b21a8',
            600: '#7c3aed',
          },
          indigo: {
            900: '#1e1b4b',
            800: '#312e81',
            700: '#3730a3',
            600: '#4f46e5',
          },
          blue: {
            900: '#0c4a6e',
            800: '#075985',
            700: '#0369a1',
            600: '#0284c7',
          },
          red: {
            900: '#7f1d1d',
            800: '#991b1b',
            700: '#b91c1c',
            600: '#dc2626',
          },
          green: {
            900: '#064e3b',
            800: '#065f46',
            700: '#047857',
            600: '#059669',
          },
          gray: {
            900: '#111827',
            800: '#1f2937',
            700: '#374151',
            600: '#4b5563',
          },
        },
      },

      // 🧩 Shadows - deep tones only
      boxShadow: {
        'glow': '0 0 12px rgba(107, 0, 179, 0.5)',
        'glow-intense': '0 0 20px rgba(124, 58, 237, 0.6)',
        'inner-accent': 'inset 0 0 8px rgba(107, 0, 179, 0.4)',
        'soft': '0 0 15px rgba(0, 0, 0, 0.5)',
        'deep-purple': '0 0 15px rgba(59, 7, 100, 0.7)',
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
          '0%, 100%': { boxShadow: '0 0 15px rgba(107, 0, 179, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(124, 58, 237, 0.7)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(124, 58, 237, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(124, 58, 237, 0.6)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out',
        pulseAccent: 'pulseAccent 2s infinite ease-in-out',
        glowPulse: 'glowPulse 3s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};
