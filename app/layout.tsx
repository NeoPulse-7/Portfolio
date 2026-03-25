import type { Metadata } from 'next'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'
import Cursor from '@/components/Cursor'

export const metadata: Metadata = {
  title: 'Ayush — Web Developer',
  description: 'Web Developer from India. Crafting digital experiences that matter.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@300;400;500;700;800&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Cursor />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
