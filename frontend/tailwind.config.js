/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // مهم جداً للوضع اليدوي
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
