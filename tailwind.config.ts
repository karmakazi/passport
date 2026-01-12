import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f5ed',
          100: '#ccead9',
          200: '#99d6b3',
          300: '#66c18d',
          400: '#33ad67',
          500: '#005030',
          600: '#004027',
          700: '#00301e',
          800: '#002014',
          900: '#00100a',
        },
        accent: {
          50: '#e6f5ed',
          100: '#ccead9',
          200: '#99d6b3',
          300: '#66c18d',
          400: '#33ad67',
          500: '#005030',
          600: '#004027',
          700: '#00301e',
          800: '#002014',
          900: '#00100a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'stamp': 'stamp 0.6s cubic-bezier(0.36, 0, 0.66, -0.56)',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        stamp: {
          '0%': { transform: 'scale(0) rotate(-12deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(-8deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-6deg)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config

