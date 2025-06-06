/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Proxima Nova"', 'sans-serif'],
        serif: ['"Proxima Nova"', 'serif'],
      },
    },
  },
  plugins: [],
}
