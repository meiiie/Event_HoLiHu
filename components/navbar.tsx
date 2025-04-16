"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, Database, Settings, LineChart } from "lucide-react"
import { ThemeSwitch } from "./theme-switch"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Button } from "./ui/button"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  highlight?: boolean
}

export function Navbar() {
  const pathname = usePathname()
  
  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/blockchain-monitor",
      icon: <LineChart className="h-4 w-4 mr-2" />,
    },
    {
      label: "Events",
      href: "/blockchain-monitor?tab=events",
      icon: <Activity className="h-4 w-4 mr-2" />,
      highlight: true,
    },
    {
      label: "Contracts",
      href: "/blockchain-monitor?tab=settings",
      icon: <Database className="h-4 w-4 mr-2" />,
    },
    {
      label: "Config",
      href: "/blockchain-init",
      icon: <Settings className="h-4 w-4 mr-2" />,
    }
  ]
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md dark:bg-background/70">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-5 flex">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-primary/20">
              <motion.div 
                className="absolute inset-0 flex items-center justify-center" 
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Activity className="h-5 w-5 text-primary" />
              </motion.div>
            </div>
            <span className="hidden sm:inline-block font-heading font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              HoLiHu Monitor
            </span>
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className={cn("relative px-4", 
                  item.highlight && "after:absolute after:right-1 after:top-1 after:h-2 after:w-2 after:rounded-full after:bg-primary"
                )}
              >
                <Link href={item.href} className="flex items-center">
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
          
          <div className="flex items-center">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </header>
  )
}
