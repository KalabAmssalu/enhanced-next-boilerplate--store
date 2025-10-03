/** @type {import('tailwindcss').Config} */
module.exports = {
  extends: ['@repo/shared-configs/tailwind'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@repo/shared-ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Add custom theme extensions here
    },
  },
  plugins: [],
};
