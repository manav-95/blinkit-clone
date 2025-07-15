/** @type {import('tailwindcss').Config} */


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-red-500',
    'text-yellow-500',
    'text-green-500',
    'text-blue-500'
  ],
  theme: {
    extend: {
      fontFamily: {
        gilroy: ['Gilroy', '"Helvetica Neue"'],
        okraish: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        poppins: ["Poppins", 'sans-serif'],
      },
      textColor: {
        green: "#3AB757",
        darkGreen: "#318616",
      },
      backgroundColor: {
        darkGreen: "#318616",
        lightGray: "#f8f8f8",
      },
      borderColor: {
        darkGreen: "#318616",
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

