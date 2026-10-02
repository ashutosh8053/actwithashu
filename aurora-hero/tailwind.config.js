/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        ink: '#07050d',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '17%': { transform: 'translate3d(-8%, 6%, 0)' },
          '33%': { transform: 'translate3d(6%, -10%, 0)' },
          '50%': { transform: 'translate3d(-12%, -4%, 0)' },
          '67%': { transform: 'translate3d(10%, 8%, 0)' },
          '83%': { transform: 'translate3d(-4%, 12%, 0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translate3d(0, 24px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
      },
      animation: {
        grain: 'grain 0.9s steps(6) infinite',
        'fade-up': 'fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
