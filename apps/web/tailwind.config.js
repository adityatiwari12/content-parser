/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        axiom: {
          paper: '#F8F8F5',
          ink: '#101010',
          muted: '#5F6368',
          navy: '#1A365D',
          line: 'rgba(0,0,0,0.08)',
          bg: '#09090b',
          surface: '#141418',
        },
      },
    },
  },
  plugins: [],
}
