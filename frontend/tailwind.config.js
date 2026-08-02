/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderColor: {
        'neutral-850': 'rgb(30, 30, 35)',
      },
      backgroundColor: {
        'neutral-850': 'rgb(30, 30, 35)',
      },
    },
  },
  plugins: [],
};
