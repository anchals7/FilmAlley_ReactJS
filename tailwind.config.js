/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#212426',
        secondary: '#f9d3b4',
      },
      fontFamily: {
        merriweather: ['Merriweather', 'serif'],
        delius: ['Delius Swash Caps', 'cursive'],
      },
    },
  },
  plugins: [],
} 