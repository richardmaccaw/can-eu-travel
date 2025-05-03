/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],  theme: {
    extend: {},
  },

  // 🔒 keep runtime‑only classes alive during purge
  safelist: [
    // layout
    'flex', 'flex-col',
    'gap-1', 'gap-1.5', 'mr-1',

    // sizing for squares & labels
    'w-4', 'h-4',
    // uncomment if you ever go back to 20‑px cells
    // 'w-5', 'h-5',

    // colours & borders applied in JS
    'bg-blue-500', 'bg-gray-100', 'bg-transparent',
    'rounded-sm',
    'hover:border', 'hover:border-gray-300',

    // typography
    'text-xs', 'text-gray-500', 'text-gray-700',
  ],

  plugins: [],
};
