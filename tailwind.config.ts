import type { Config } from 'tailwindcss'

export default <Config>{
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#060d17',
          50: '#1a2a3d',
          100: '#152233',
          200: '#10161d',
          300: '#0b1018',
          400: '#060d17',
          500: '#040a12',
          600: '#02060c',
          700: '#010307',
          800: '#000102',
          900: '#000000',
        },
        accent: {
          DEFAULT: '#517fa4',
          light: '#6b9fc4',
          dark: '#243949',
        },
        surface: {
          DEFAULT: '#10161d',
          light: '#1c252f',
          dark: '#060d17',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-skeleton': 'pulseSkeleton 1.5s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        pulseSkeleton: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
