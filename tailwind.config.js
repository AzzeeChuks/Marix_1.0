/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marix: {
          cream: '#fcf8f4',
          brown: '#452b1fd2',
          teal: '#2e6b66',
        }
      }
    },
  },
  plugins: [],
}