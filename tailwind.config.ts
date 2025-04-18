import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'light-blue-bg': '#defaff',
        'bubble-blue': '#4fc3f7',
        'navy-blue': '#2196f3',
      },
    },
  },
  plugins: [],
}

export default config
