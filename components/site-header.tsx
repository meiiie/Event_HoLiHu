import Link from "next/link"
import Image from "next/image"
import { ThemeSwitch } from "@/components/theme-switch"
import { Button } from "@/components/ui/button"
import { Activity, Database, LineChart } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="https://i.pinimg.com/736x/f5/49/24/f549248b1467667259f113f51ff16f96.jpg"
              alt="HoLiHu Logo"
              width={36}
              height={36}
              className="rounded-full"
              priority
            />
            <span className="hidden font-bold sm:inline-block">
              HoLiHu Blockchain Monitor
            </span>
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex items-center space-x-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/blockchain-monitor" className="flex items-center">
                <Activity className="mr-2 h-4 w-4" />
                Giám sát
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/blockchain-init" className="flex items-center">
                <Database className="mr-2 h-4 w-4" />
                Khởi tạo
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/analytics" className="flex items-center">
                <LineChart className="mr-2 h-4 w-4" />
                Phân tích
              </Link>
            </Button>
          </nav>
          
          <div className="flex items-center">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </header>
  )
}
