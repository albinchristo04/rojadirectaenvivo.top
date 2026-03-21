/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#D32F2F',
        'on-primary': '#FFFFFF',
        surface: '#121212',
        'on-surface': '#E0E0E0',
        'surface-variant': '#1E1E1E',
        secondary: '#FF6F00',
        'surface-dim': '#0A0A0A',
        'surface-bright': '#2A2A2A',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
