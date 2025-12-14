/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        'on-surface': '#1F2937',
        'on-surface-secondary': '#6B7280',
      },
    },
  },
  plugins: [],
}

