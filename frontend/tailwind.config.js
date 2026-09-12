/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          green: '#0d5c3a',
          darkgreen: '#083c25',
          lightgreen: '#e6f4ea',
          saffron: '#c2410c',
          amber: '#d97706',
          slate: '#0f172a',
          border: '#cbd5e1',
          bg: '#f8fafc',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


