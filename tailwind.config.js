/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0067A0',
        'primary-dark': '#004f7c',
        'primary-light': '#e6f2f9',
        safe: '#16A34A',
        warning: '#CA8A04',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
