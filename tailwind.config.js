/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'rm-blue':       '#003DA5',
        'rm-blue-dark':  '#002d7a',
        'rm-blue-light': '#e8eef9',
        'rm-red':        '#DC1C2E',
        'rm-red-dark':   '#b81525',
        'rm-red-light':  '#fde8ea',
        'gold':          '#d4a017',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
