import type { Metadata } from 'next'
import type React from "react"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: 'Giám sát Blockchain HoLiHu',
  description: 'Trang giám sát và theo dõi các sự kiện blockchain trên mạng HoLiHu',
}

export default function BlockchainMonitorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Event HoLiHu</span>
            </a>
          </div>
          <Separator orientation="vertical" className="h-6 mx-4" />
          <nav className="hidden md:flex flex-1 items-center space-x-4 lg:space-x-6 text-sm">
            <a
              href="/blockchain-monitor"
              className="transition-colors hover:text-primary"
            >
              Giám sát
            </a>
            <a
              href="/blockchain-init"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Cấu hình
            </a>
            <a
              href="https://explorer.holihu.online"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              HoLiHu Explorer
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-muted/25">{children}</main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Powered by{" "}
            <a
              href="https://holihu.online"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              HoLiHu Blockchain
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
