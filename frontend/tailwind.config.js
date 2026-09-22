/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        roblox: {
          red: '#e74c3c',
          dark: '#191919',
          darker: '#0d0d0d',
          gray: '#393b3d',
          light: '#bdbebe'
        }
      },
      fontFamily: {
        'roblox': ['HCo Gotham SSm', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
