/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js}'],
  corePlugins: {
    preflight: false,  // Disable Tailwind reset — use our own global.css
  },
  theme: {
    extend: {
      colors: {
        red: { DEFAULT: '#E8001D' },
        amber: { DEFAULT: '#FF9500' },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        condensed: ['Barlow Condensed', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
      },
    },
  },
};
