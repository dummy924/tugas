/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        maroon: {
          50: '#FBEFEF',
          100: '#F3D9DB',
          300: '#C97B85',
          500: '#8A2A42',
          600: '#7A2038',
          700: '#5C1729',
          800: '#4C1220',
        },
        gold: {
          400: '#D8B848',
          500: '#C9A227',
          600: '#A6821D',
        },
      },
    },
  },
  plugins: [],
}
