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
        'dark': '#011627',
        'light': '#ECFEE8',
        'primary': '#E09F3E',
        'secondary': '#003559',
        'tertiaryLight': '#FFF1D0',
        'tertiaryDark': '#264653',
        'outlineLight': '#AAFAC8',
        'outlineDark': '#21897E',
        'outline': '#2A9D8F',
        'variant': '#FF4365',
        'variantLight': '#EDDEA4',
        'variantDark': '#386150',
      },
      fontFamily: {
        'display': ['Courgette', 'sans-serif'],
        'displayBold': ['"Fredoka One"', 'sans-serif'],
        'displayText': ['"Fira Code"', 'sans-serif'],
        'body': ['"Helvetica Neue"', 'sans'],
      },
      backdropBlur: ['hover'],
    },
  },
  plugins: [],
}
