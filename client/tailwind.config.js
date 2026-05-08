/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: '#root', // Ensures Tailwind classes can override MUI defaults if needed
  theme: {
    extend: {
      fontFamily: {
        // This replaces the default sans-serif stack
        sans: ['"Yanone Kaffeesatz"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
