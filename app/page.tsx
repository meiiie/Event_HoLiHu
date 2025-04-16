"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Activity } from "lucide-react"
import Head from "next/head"

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

    checkInitialization()
  }, [router])

  return (
    <>
      <Head>
        <title>Event HoLiHu - Giám sát blockchain</title>
        <meta name="description" content="Hệ thống giám sát và phân tích sự kiện blockchain trên mạng HoLiHu" />
        <meta name="keywords" content="blockchain, ethereum, events, smart contracts, monitoring, HoLiHu" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="flex flex-col items-center text-center max-w-md mx-auto px-4">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 blur-xl rounded-full"></div>
            <div className="relative bg-background p-4 rounded-full border shadow-md">
              <Activity className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Event HoLiHu</h1>
          <p className="text-muted-foreground mb-8">
            Hệ thống giám sát sự kiện blockchain trên mạng HoLiHu
          </p>
          <div className="flex items-center space-x-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-lg">Đang tải ứng dụng...</p>
          </div>
        </div>
      </div>
    </>
  )
}
