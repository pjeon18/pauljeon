/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0f5',
          100: '#e1e1eb',
          200: '#c3c3d7',
          300: '#a5a5c3',
          400: '#8787af',
          500: '#030213',
          600: '#020210',
          700: '#02020e',
          800: '#01010b',
          900: '#010108',
        },
        accent: {
          light: '#e9ebef',
          DEFAULT: '#e9ebef',
          dark: '#cbced4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Menlo', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.625rem',
      },
      transitionDuration: {
        DEFAULT: '200ms',
        slow: '500ms',
        slower: '1000ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          md: '2rem',
          lg: '4rem',
        },
      },
    },
  },
  plugins: [],
}

