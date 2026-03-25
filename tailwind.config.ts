import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:  '#080808',
        s1:  '#0f0f0f',
        s2:  '#161616',
        t1:  '#EFEFEF',
        t2:  '#707070',
        t3:  '#333333',
        acc: '#E8FF00',
      },
      fontFamily: {
        sans:  ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        mono:  ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
