/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  
    extend: {
      colors: {
        primary: '#125ca6',
        secondary: '#a62424',
      },
      fontFamily: {
        playWriteFont: [ "Playwrite CU", "cursive"],
        sourceSansFont: [ "Source Sans 3", "sans-serif"],
        // Add more custom font families as needed
      },
      
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
