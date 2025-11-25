/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Cores extraídas do portal da SEFAZ
      colors: {
        'sefaz-blue': {
          DEFAULT: '#004a91', // Azul principal (header do site)
          dark: '#003a74',
          light: '#007bff', // Azul de links
        },
        'sefaz-background': {
          DEFAULT: '#e6f0f9', // Fundo azul claro do header
          light: '#f8f9fa' // Fundo geral
        },
      },
      // Fonte padrão (Inter)
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}