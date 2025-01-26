/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'space': {
          900: '#0a0a1f',
          800: '#16163f',
          700: '#1e1e4f',
          600: '#2a2a6f',
          500: '#3636af',
          DEFAULT: '#0a0a1f'
        },
        'alien': {
          500: '#6366f1',
          600: '#8b5cf6',
          DEFAULT: '#6366f1'
        },
        'glow': {
          400: '#60a5fa',
          500: '#3b82f6',
          DEFAULT: '#60a5fa'
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { textShadow: '0 0 4px #60a5fa' },
          '100%': { textShadow: '0 0 8px #3b82f6, 0 0 12px #6366f1' },
        }
      },
    },
  },
  plugins: [],
}
