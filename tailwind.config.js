/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'accent-green': 'var(--accent-green)',
        'accent-gold': 'var(--accent-gold)',
        'state-valid': 'var(--state-valid)',
        'state-invalid': 'var(--state-invalid)',
        'state-warning': 'var(--state-warning)',
        'state-info': 'var(--state-info)',
      },
    },
  },
  plugins: [],
}
