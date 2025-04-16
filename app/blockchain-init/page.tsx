"use client"

import { useEffect, useState } from "react"
import { InitContractConfigs } from "@/scripts/init-contract-configs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { testConnection } from "@/lib/blockchain-provider"

export default function BlockchainInitPage() {
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [initError, setInitError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check connection and configs
    const checkConnectionAndConfigs = async () => {
      try {
        setLoading(true)

        // Test blockchain connection first
        const isConnected = await testConnection()

        if (!isConnected) {
          setConnectionError("Không thể kết nối đến blockchain. Vui lòng kiểm tra kết nối mạng và thử lại.")
          setLoading(false)
          return
        }

        // Check if configs exist
        const response = await fetch("/api/blockchain/contracts")

        if (response.ok) {
          const data = await response.json()
          setInitialized(data.length > 0)
        } else {
          const errorData = await response.json()
          setInitError(`Lỗi API: ${errorData.error || response.statusText}`)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error checking configs:", error)
        setConnectionError(`Lỗi khi kiểm tra cấu hình: ${error instanceof Error ? error.message : String(error)}`)
        setLoading(false)
      }
    }

    checkConnectionAndConfigs()
  }, [])

  // Redirect to blockchain monitor page after initialization
  const goToMonitorPage = () => {
    router.push("/blockchain-monitor")
  }

  // Auto-redirect after 3 seconds if initialized
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout

    if (initialized && !loading && !connectionError && !initError) {
      redirectTimer = setTimeout(() => {
        goToMonitorPage()
      }, 3000)
    }

    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer)
      }
    }
  }, [initialized, loading, connectionError, initError])

  // Retry connection
  const retryConnection = () => {
    setConnectionError(null)
    setInitError(null)
    setLoading(true)
    testConnection().then((isConnected) => {
      if (isConnected) {
        // Check configs again
        fetch("/api/blockchain/contracts")
          .then((response) => {
            if (response.ok) {
              response.json().then((data) => {
                setInitialized(data.length > 0)
                setLoading(false)
              })
            } else {
              response.json().then((errorData) => {
                setInitError(`Lỗi API: ${errorData.error || response.statusText}`)
                setLoading(false)
              })
            }
          })
          .catch((error) => {
            console.error("Error checking configs:", error)
            setInitError(`Lỗi khi kiểm tra cấu hình: ${error instanceof Error ? error.message : String(error)}`)
            setLoading(false)
          })
      } else {
        setConnectionError("Không thể kết nối đến blockchain. Vui lòng kiểm tra kết nối mạng và thử lại.")
        setLoading(false)
      }
    })
  }

  // Handle initialization error
  const handleInitError = (error: Error) => {
    setInitError(`Lỗi khởi tạo: ${error.message}`)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Blockchain Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {connectionError && (
            <Alert className="mb-4 bg-red-50/70 dark:bg-red-900/20 border border-red-100/50 dark:border-red-800/30">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-400">{connectionError}</AlertDescription>
              <Button onClick={retryConnection} variant="outline" size="sm" className="mt-2">
                Thử lại
              </Button>
            </Alert>
          )}

          {initError && (
            <Alert className="mb-4 bg-red-50/70 dark:bg-red-900/20 border border-red-100/50 dark:border-red-800/30">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-400">{initError}</AlertDescription>
              <Button onClick={retryConnection} variant="outline" size="sm" className="mt-2">
                Thử lại
              </Button>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2">Đang kiểm tra cấu hình...</span>
            </div>
          ) : initialized ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="flex items-center text-green-600 mb-4">
                <CheckCircle2 className="h-6 w-6 mr-2" />
                <span>Cấu hình blockchain đã được khởi tạo</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Đang chuyển hướng đến trang giám sát...</p>
              <Button onClick={goToMonitorPage}>Đi đến trang giám sát ngay</Button>
            </div>
          ) : !connectionError && !initError ? (
            <div className="py-6">
              <p className="mb-4">Đang khởi tạo cấu hình blockchain...</p>
              <InitContractConfigs onInitialized={() => setInitialized(true)} onError={handleInitError} />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
