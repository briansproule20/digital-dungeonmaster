import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Digital Dungeonmaster',
  description: 'An intelligent platform for tabletop RPGs',
  icons: {
    icon: '/dungeonmaster-favicon.png',
    shortcut: '/dungeonmaster-favicon.png',
    apple: '/dungeonmaster-favicon.png',
  },
  openGraph: {
    title: 'Digital Dungeonmaster',
    description: 'An intelligent platform for tabletop RPGs',
    url: 'https://digitaldungeonmaster.com',
    siteName: 'Digital Dungeonmaster',
    images: [
      {
        url: '/dungeonmaster-favicon.png',
        width: 256,
        height: 256,
        alt: 'Digital Dungeonmaster',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Dungeonmaster',
    description: 'An intelligent platform for tabletop RPGs',
    images: ['/dungeonmaster-favicon.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
