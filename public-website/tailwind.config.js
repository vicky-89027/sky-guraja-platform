/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          darkest: '#030A16',
          navy: '#061224',
          card: '#0B1B36',
          cardHover: '#0F274C',
          border: 'rgba(245, 158, 11, 0.25)',
          gold: '#F59E0B',
          goldLight: '#FBBF24',
          goldDark: '#D97706',
          peacock: '#0D9488',
          emerald: '#059669',
          cyan: '#0284C7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}
