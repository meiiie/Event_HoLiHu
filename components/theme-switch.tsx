"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  
  // Wait for component to mount to avoid hydration issues
  useEffect(() => setMounted(true), [])
  
  if (!mounted) return null
  
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full w-10 h-10 bg-background/50 backdrop-blur-sm border"
    >
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.2 }}
        key={theme}
      >
        {theme === "light" ? 
          <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" /> : 
          <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
        }
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
