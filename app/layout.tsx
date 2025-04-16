import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css' 
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { Analytics } from '@/components/analytics'
import { SiteHeader } from '@/components/site-header'

// Define fonts - Inter for body text, Space Grotesk for headings
const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
})

export const metadata: Metadata = {
  title: 'Blockchain Event Listener',
  description: 'Monitor and visualize blockchain events',
  generator: 'Next.js',
  keywords: ['blockchain', 'HoLiHu', 'events', 'monitor', 'ethereum', 'smart contract', 'DApp', 'blockchain analytics'],
  authors: [{ name: 'HoLiHu Team' }],
  creator: 'HoLiHu Development Team',
  publisher: 'HoLiHu',
  metadataBase: new URL('https://event.holihu.online'),
  openGraph: {
    type: 'website',
    title: 'HoLiHu Blockchain Monitor',
    description: 'Professional blockchain event monitoring and tracking system for decentralized applications',
    siteName: 'HoLiHu Event Monitor',
    images: [
      {
        url: '/logo-holihu.jpg', // Sử dụng URL tương đối với fallback nội bộ
        width: 800,
        height: 600,
        alt: 'HoLiHu Blockchain Monitor Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HoLiHu Blockchain Monitor',
    description: 'Professional blockchain event monitoring and tracking system',
    images: ['/logo-holihu.jpg'], // Sử dụng URL tương đối với fallback nội bộ
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Không cần thẻ link favicon riêng biệt vì đã định nghĩa trong metadata */}
        {/* Thêm để debug CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          .css-loaded::after {
            content: "CSS loaded";
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: green;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999;
            opacity: 0.7;
          }
        `}} />
      </head>
      <body className={cn(
        inter.variable, 
        spaceGrotesk.variable,
        'min-h-screen font-sans antialiased bg-background css-loaded',
        'flex flex-col overflow-x-hidden',
      )}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-gray-900 to-background"></div>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
