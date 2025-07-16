import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))',
      },
      colors: {
        primary: {
          from: '#667eea',
          to: '#764ba2',
        },
      },
    },
  },
} satisfies Config
