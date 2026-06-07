/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'military': {
          50: '#f0f7f0',
          100: '#dcecdc',
          200: '#b8d9b8',
          300: '#8abf8a',
          400: '#5a9e5a',
          500: '#2C5F2D',
          600: '#244d25',
          700: '#1e3e1f',
          800: '#183219',
          900: '#122813',
        },
        'navy': {
          50: '#f0f4f8',
          100: '#dbe5ef',
          200: '#b9cadd',
          300: '#8da8c5',
          400: '#5b81a9',
          500: '#1E3A5F',
          600: '#1a3251',
          700: '#162a44',
          800: '#122237',
          900: '#0e1b2c',
        },
        'alert': {
          red: '#D62828',
          orange: '#F77F00',
          green: '#00A86B',
          blue: '#0077B6',
        }
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'sans': ['Noto Sans SC', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(44, 95, 45, 0.5)',
        'glow-red': '0 0 20px rgba(214, 40, 40, 0.5)',
        'glow-orange': '0 0 20px rgba(247, 127, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
