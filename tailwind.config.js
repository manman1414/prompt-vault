/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#409eff',
          light: '#ecf5ff',
          dark: '#337ecc',
        },
      },
    },
  },
  plugins: [],
}
