/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        backdround: "#0e1111",
        primary: "#ECB365",
        secondary: "#064663",
        gold: "#FFD700"
      }
    },
  },
  plugins: [],
}

