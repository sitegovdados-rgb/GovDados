/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        pci: {
          navy:   '#1a2a5e',
          blue:   '#2563a8',
          cyan:   '#00a8cc',
          light:  '#e8f4fa',
          bg:     '#f5f7fc',
          white:  '#ffffff',
          border: '#d4dff0',
          text:   '#0f1d3d',
          dim:    '#4a5f8a',
          muted:  '#8fa3c8',
          green:  '#16a34a',
          amber:  '#d97706',
        }
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body:    ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
