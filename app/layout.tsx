import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import '../styles/reset.css'  // Import CSS reset first
import '../styles/index.css'  // Import our combined CSS file
import './globals.css'       // Then import globals.css with Tailwind
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { Analytics } from '@/components/analytics'
import { SiteHeader } from '@/components/site-header'

// Define fonts - Inter for body text, Space Grotesk for headings
const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={cn(
        inter.variable, 
        spaceGrotesk.variable,
        'min-h-screen font-sans antialiased bg-background css-loaded',
        'flex flex-col overflow-x-hidden relative',
        process.env.NODE_ENV === 'development' ? 'css-debug' : '',
      )}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* Gradient background */}
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-background to-background"></div>
          <div className="fixed inset-0 z-[-2] bg-[linear-gradient(to_bottom_right,_var(--tw-gradient-stops))] from-gray-900/5 via-background to-background opacity-30"></div>
          
          <SiteHeader />
          <main className="flex-1 relative">{children}</main>
          
          <footer className="border-t border-border/30 py-6 px-4">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2025 HoLiHu Blockchain. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
          </footer>
          
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
