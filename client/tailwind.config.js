/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        logo: 'Space Grotesk'
      },
      // 1. Define the actual movement here
      keyframes: { 
        scan: { 
          '0%': { transform: 'translateY(-100%)' }, 
          '100%': { transform: 'translateY(100%)' } 
        } 
      },
      // 2. Register the class name here
      animation: {
        scan: 'scan 3s ease-in-out infinite'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}