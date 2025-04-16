import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

// Định nghĩa font Inter
const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'Event HoLiHu - Giám sát sự kiện blockchain',
  description: 'Ứng dụng giám sát và theo dõi sự kiện blockchain trên mạng HoLiHu',
  generator: 'Next.js',
  keywords: ['blockchain', 'HoLiHu', 'events', 'monitor', 'ethereum', 'smart contract'],
  authors: [{ name: 'HoLiHu Team' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
