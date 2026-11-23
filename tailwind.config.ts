import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: { 50: '#fff8f9', 100: '#ffeef1', 200: '#fddce3', 300: '#f9bfcb', 400: '#f19bb0', 500: '#e47094', 600: '#c94a74', 700: '#a53760' },
        ink: { DEFAULT: '#2a2024', soft: '#6b5a61' },
      },
      fontFamily: { display: ['var(--font-display)', 'Georgia', 'serif'], sans: ['var(--font-body)', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
export default config;
