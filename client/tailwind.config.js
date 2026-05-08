/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: '#root', // Ensures Tailwind classes can override MUI defaults if needed
  theme: {
    extend: {},
  },
  plugins: [],
};
