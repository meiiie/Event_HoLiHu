import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
// Import theo thứ tự đúng - đảm bảo thứ tự ưu tiên phù hợp
import '../styles/reset.css'       // Reset CSS luôn được ưu tiên đầu tiên
import '../styles/critical.css'    // CSS quan trọng luôn được áp dụng core styles
import '../styles/main.css'        // CSS tổng hợp từ nhiều nguồn dụng
import '../styles/fixes.css'       // CSS khắc phục sau tất cảuồn
import './globals.css'             // Sau đó import globals.css với Tailwind
import { ThemeProvider } from '@/components/theme-provider'.css với Tailwind
import { Toaster } from '@/components/ui/toaster'-provider'
import { cn } from '@/lib/utils'nents/ui/toaster'
import { Analytics } from '@/components/analytics'
import { SiteHeader } from '@/components/site-header'
import Script from 'next/script'mponents/site-header'
import Script from 'next/script'
// Define fonts - Inter for body text, Space Grotesk for headings
const inter = Inter({ r for body text, Space Grotesk for headings
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',amese'],
  display: 'swap',t-inter',
})display: 'swap',
})
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],Space_Grotesk({
  variable: '--font-space',
  display: 'swap',t-space',
})display: 'swap',
})
export const metadata: Metadata = {
  title: 'Blockchain Event Listener',
  description: 'Monitor and visualize blockchain events',
  generator: 'Next.js', and visualize blockchain events',
  keywords: ['blockchain', 'HoLiHu', 'events', 'monitor', 'ethereum', 'smart contract', 'DApp', 'blockchain analytics'],
  authors: [{ name: 'HoLiHu Team' }],'events', 'monitor', 'ethereum', 'smart contract', 'DApp', 'blockchain analytics'],
  creator: 'HoLiHu Development Team',
  publisher: 'HoLiHu',elopment Team',
  metadataBase: new URL('https://event.holihu.online'),
  openGraph: {: new URL('https://event.holihu.online'),
    type: 'website',
    title: 'HoLiHu Blockchain Monitor',
    description: 'Professional blockchain event monitoring and tracking system for decentralized applications',
    siteName: 'HoLiHu Event Monitor',hain event monitoring and tracking system for decentralized applications',
    images: [ 'HoLiHu Event Monitor',
      {ges: [
        url: '/logo-holihu.jpg', // Sử dụng URL tương đối với fallback nội bộ
        width: 800,-holihu.jpg', // Sử dụng URL tương đối với fallback nội bộ
        height: 600,
        alt: 'HoLiHu Blockchain Monitor Logo',
      } alt: 'HoLiHu Blockchain Monitor Logo',
    ],}
  },],
  twitter: {
    card: 'summary_large_image',
    title: 'HoLiHu Blockchain Monitor',
    description: 'Professional blockchain event monitoring and tracking system',
    images: ['/logo-holihu.jpg'], // Sử dụng URL tương đối với fallback nội bộ',
  },images: ['/logo-holihu.jpg'], // Sử dụng URL tương đối với fallback nội bộ
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  } apple: '/apple-touch-icon.png',
} }
}
export default function RootLayout({
  children,ult function RootLayout({
}: Readonly<{
  children: React.ReactNode
}>) {ldren: React.ReactNode
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>ng="en" suppressHydrationWarning className="scroll-smooth">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />>
        <meta name="color-scheme" content="light dark" />, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        {/* Inline critical CSS để đảm bảo luôn được tải đầu tiên */}
        <style dangerouslySetInnerHTML={{ __html: `c tải đầu tiên */}
          .container {width: 100%; max-width: 1400px; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem;}
          @media (min-width: 640px) {.container {padding-left: 1.5rem; padding-right: 1.5rem;}}
          @media (min-width: 1024px) {.container {padding-left: 2rem; padding-right: 2rem;}}
          body {min-height: 100vh; font-family: system-ui, sans-serif;}
        `}} />primary: 0 0% 9%;
        -primary-foreground: 0 0% 98%;
        {/* Preload critical CSS files */}00%;
        <link rel="preload" href="/styles/standalone.css" as="style" />round: 0 0% 3.9%;
        <link rel="preload" href="/styles/critical.css" as="style" />8%;
        
        {/* Emergency CSS loader script - load as early as possible */}
        <script dangerouslySetInnerHTML={{ __html: `
          // Simple emergency CSS loader   --background: 0 0% 3.9%;
          (function() {
            function addEmergencyCSS() {
              if (document.querySelector('.container')) {
                const style = window.getComputedStyle(document.querySelector('.container'));
                if (style.maxWidth === 'none' || style.maxWidth === '') {  --card-foreground: 0 0% 98%;
                  const link = document.createElement('link');0% 14.9%;
                  link.rel = 'stylesheet';
                  link.href = '/emergency.css';.container {width: 100%; max-width: 1400px; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem;}
                  document.head.appendChild(link);rem; padding-right: 1.5rem;}}
                  console.log('Emergency CSS loaded');
                }if;}
              }
            }
            // Run immediately
            if (document.readyState !== 'loading') {
              addEmergencyCSS();reload" href="/styles/critical.css" as="style" />
            } else {
              document.addEventListener('DOMContentLoaded', addEmergencyCSS);me={cn(
            }ter.variable, 
            // Check again after a delayvariable,
            setTimeout(addEmergencyCSS, 1000);ont-sans antialiased bg-background css-loaded',
          })();verflow-x-hidden relative container-fix',
        `}} />process.env.NODE_ENV === 'development' ? 'css-debug' : '',
      </head>
      <body className={cn(em>
        inter.variable,  Gradient background */}
        spaceGrotesk.variable,div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-background to-background"></div>
        'min-h-screen font-sans antialiased bg-background css-loaded',       <div className="fixed inset-0 z-[-2] bg-[linear-gradient(to_bottom_right,_var(--tw-gradient-stops))] from-gray-900/5 via-background to-background opacity-30"></div>
        'flex flex-col overflow-x-hidden relative container-fix',         
        process.env.NODE_ENV === 'development' ? 'css-debug' : '',          <SiteHeader />


































}  )    </html>      </body>        <Script src="/css-load-check.js" strategy="afterInteractive" />        {/* Add CSS load check script with proper strategy */}                <Script src="/emergency-css-loader.js" strategy="beforeInteractive" />        {/* Load emergency CSS loader script */}                </ThemeProvider>          <Analytics />          <Toaster />                    </footer>            </div>              </div>                <a href="#" className="hover:text-foreground transition-colors">Contact</a>                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>                <a href="#" className="hover:text-foreground transition-colors">Terms</a>              <div className="flex items-center gap-4">              <p>© 2025 HoLiHu Blockchain. All rights reserved.</p>            <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">          <footer className="border-t border-border/30 py-6 px-4">                    <main className="flex-1 relative">{children}</main>          <SiteHeader />                    <div className="fixed inset-0 z-[-2] bg-[linear-gradient(to_bottom_right,_var(--tw-gradient-stops))] from-gray-900/5 via-background to-background opacity-30"></div>          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-background to-background"></div>          {/* Gradient background */}        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>      )}>          <main className="flex-1 relative">{children}</main>
          
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
        
        {/* Add CSS load check script first to catch CSS loading issues early */}
        <Script src="/css-load-check.js" strategy="beforeInteractive" />
        
        {/* Add scripts to detect dark mode early */}
        <Script id="detect-dark-mode" strategy="beforeInteractive">
          {`
            try {
              if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
              } else {
                document.documentElement.classList.remove('dark')
              }
            } catch (e) {}
          `}
        </Script>
      </body>
    </html>
  )
}
