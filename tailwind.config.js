/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gov: {
          bg:       '#f4f6fa',
          surface:  '#ffffff',
          border:   '#dce3ef',
          accent:   '#1a56a0',
          light:    '#e8eef8',
          muted:    '#6b7fa3',
          text:     '#1a2340',
          textDim:  '#4a5880',
          highlight:'#0ea5e9',
          green:    '#16a34a',
        }
      },
      fontFamily: {
        display: ['"Merriweather"', 'Georgia', 'serif'],
        body:    ['"Source Sans 3"', 'sans-serif'],
        mono:    ['"Source Code Pro"', 'monospace'],
      },
    },
  },
  plugins: [],
}
