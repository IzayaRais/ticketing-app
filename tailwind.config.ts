import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf4f4',
          100: '#fbe8e8',
          200: '#f6d2d2',
          300: '#f0b3b3',
          400: '#e88a8a',
          500: '#df6666',
          600: '#d94a4a',
          700: '#b33a3a',
          800: '#943434',
          900: '#7a2d2d',
          950: '#4a1a1a',
        },
        offwhite: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eaeaea',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
        },
        primary: {
          50: '#fdf4f4',
          100: '#fbe8e8',
          200: '#f6d2d2',
          300: '#f0b3b3',
          400: '#e88a8a',
          500: '#df6666',
          600: '#d94a4a',
          700: '#b33a3a',
          800: '#943434',
          900: '#7a2d2d',
          950: '#4a1a1a',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
