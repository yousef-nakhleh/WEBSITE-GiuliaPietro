/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        primary: ['Roboto', 'sans-serif'],
        script: ['Alex Brush', 'cursive'],
      },
      colors: {
        beige: '#F5F0E6',
        brown: '#3C2A21',
        'brown-soft': '#6e5a49',
        'cream': '#ece3d8',
        gold: '#D4AF37',
      },
    },
  },
  plugins: [],
};