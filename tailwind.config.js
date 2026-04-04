// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B1E39',
        accent: '#76B900',
        secondary: '#1E293B',
        dark: '#0F172A',
        'dark-light': '#1E293B',
        'gray-custom': '#64748B',
        border: '#334155',
      },
      backgroundColor: {
        dark: '#0F172A',
        'dark-light': '#1E293B',
        primary: '#0B1E39',
        secondary: '#1E293B',
      },
      textColor: {
        gray: {
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
        },
        accent: '#76B900',
      }
    },
  },
  plugins: [],
}