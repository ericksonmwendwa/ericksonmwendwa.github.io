/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark': '#04454D',
        'light': '#F5F2EB',
        'primary': '#F4CBAB',
        'secondary': '#269196',
      },
      fontFamily: {
        'display': ['"SF Pro Display"', 'sans'],
        'mono': ['"SF Mono"', 'mono'],
        'body': ['"SF Pro Text"', 'sans'],
      },
      backdropBlur: ['hover'],
    },
  },
  plugins: [],
}
