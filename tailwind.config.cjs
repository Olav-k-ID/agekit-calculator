/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'kid-purple': '#715DEC',
        'blackberry': '#1E1B26',
        'blackberry-light': '#2C216F',
        'kid-orange': '#FC6E0F',
        'white': '#FFFFFF'
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0,0,0,0.15)'
      },
      borderRadius: {
        'xl2': '1.25rem'
      }
    },
  },
  plugins: [],
}
