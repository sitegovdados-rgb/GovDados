/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          bg:       '#0a0f1e',
          surface:  '#111827',
          border:   '#1e2d4a',
          accent:   '#1d6fa4',
          highlight:'#38bdf8',
          muted:    '#4a6080',
          text:     '#e2eaf4',
          textDim:  '#8ba0b8',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"IBM Plex Sans"', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(29,111,164,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(29,111,164,0.07) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
