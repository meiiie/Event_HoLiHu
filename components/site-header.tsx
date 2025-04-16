import Link from "next/link"
import { ThemeSwitch } from "@/components/theme-switch"
import { Activity, Database, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-bold hidden md:inline-block">HoLiHu Event Monitor</span>
            <span className="font-bold md:hidden">HLH</span>
          </Link>
        </div>
        
        <nav className="flex-1 flex items-center space-x-1 md:space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blockchain-monitor">
              <Activity className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Giám sát</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blockchain-init">
              <Database className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Cấu hình</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="https://explorer.holihu.online" target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Explorer</span>
            </a>
          </Button>
        </nav>
        
        <div className="flex items-center">
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
