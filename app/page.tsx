"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ActivitySquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if blockchain is initialized
    const checkInitialization = async () => {
      try {
        const response = await fetch("/api/blockchain/contracts")

        if (response.ok) {
          const data = await response.json()

          if (data.length > 0) {
            // If initialized, go to monitor page
            router.push("/blockchain-monitor")
          } else {
            // If not initialized, go to init page
            router.push("/blockchain-init")
          }
        } else {
          // If error, go to init page
          router.push("/blockchain-init")
        }
      } catch (error) {
        console.error("Error checking initialization:", error)
        router.push("/blockchain-init")
      }
    }

    // Add a small delay to show loading animation
    const timer = setTimeout(() => {
      checkInitialization()
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/10 px-4">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <ActivitySquare className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Event HoLiHu</h1>
          </div>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            </div>
            <h2 className="text-xl font-medium">Đang tải ứng dụng giám sát blockchain...</h2>
            <p className="text-muted-foreground">
              Hệ thống giám sát sự kiện blockchain trên mạng HoLiHu
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
