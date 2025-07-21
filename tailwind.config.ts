import { type Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/globals.css',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-barlow)', 'sans-serif'],
      },
      colors: {
        primary: colors.blue,
        secondary: colors.gray,
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
    },
  },
  plugins: [],
}

export default config

