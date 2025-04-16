"use client"

import { useEffect, useState } from "react"
import { InitContractConfigs } from "@/scripts/init-contract-configs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { CheckCircle2, Loader2, AlertCircle, RefreshCw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { testConnection } from "@/lib/blockchain-provider"
import { PageTitle } from "@/components/page-title"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

export default function BlockchainInitPage() {
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [initError, setInitError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(10)
  const router = useRouter()

  useEffect(() => {
    // Check connection and configs
    const checkConnectionAndConfigs = async () => {
      try {
        setLoading(true)
        setProgress(10)

        // Test blockchain connection first
        const isConnected = await testConnection()
        setProgress(40)

        if (!isConnected) {
          setConnectionError("Không thể kết nối đến blockchain. Vui lòng kiểm tra kết nối mạng và thử lại.")
          setLoading(false)
          return
        }
        
        setProgress(60)

        // Check if configs exist
        const response = await fetch("/api/blockchain/contracts")

        setProgress(80)
        
        if (response.ok) {
          const data = await response.json()
          setInitialized(data.length > 0)
          setProgress(100)
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
  const handleInitError = (error: string) => {
    setInitError(error)
    setLoading(false)
  }

  return (
    <div className="container mx-auto py-12 px-4 lg:px-8 max-w-3xl">
      <PageTitle 
        title="Khởi tạo Event Listener" 
        description="Thiết lập và kết nối với mạng blockchain HoLiHu để theo dõi các sự kiện"
      />
      
      <Card className="border shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Kết nối Blockchain</CardTitle>
          <CardDescription className="text-center">
            Thiết lập kết nối với mạng blockchain HoLiHu và khởi tạo cấu hình theo dõi sự kiện
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className="space-y-2">
                  <p className="font-medium">Đang kết nối...</p>
                  <p className="text-sm text-muted-foreground">Thiết lập kết nối đến mạng blockchain và kiểm tra cấu hình</p>
                </div>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}

          {connectionError && (
            <Alert className="mb-4 bg-red-50/70 dark:bg-red-900/20 border border-red-100/50 dark:border-red-800/30">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-400">{connectionError}</AlertDescription>
              <Button onClick={retryConnection} variant="outline" size="sm" className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </Alert>
          )}

          {initError && (
            <Alert className="mb-4 bg-red-50/70 dark:bg-red-900/20 border border-red-100/50 dark:border-red-800/30">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-400">{initError}</AlertDescription>
              <Button onClick={retryConnection} variant="outline" size="sm" className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </Alert>
          )}

          {initialized && !loading && !connectionError && !initError ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="flex flex-col items-center text-green-600 mb-4">
                <CheckCircle2 className="h-16 w-16 mb-2 text-green-500" />
                <span className="text-xl font-medium">Cấu hình blockchain đã được khởi tạo thành công!</span>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-gray-500 mb-6">Đang chuyển hướng đến trang giám sát...</p>
              <Button onClick={goToMonitorPage} className="flex items-center gap-2">
                Đi đến trang giám sát ngay
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : !connectionError && !initError && !loading ? (
            <div className="py-6">
              <p className="mb-4 font-medium text-center">Đang khởi tạo cấu hình blockchain...</p>
              <Separator className="my-4" />
              <InitContractConfigs onInitialized={() => setInitialized(true)} onError={handleInitError} />
            </div>
          ) : null}
        </CardContent>
        
        <CardFooter className="flex justify-center pt-6 pb-8">
          <p className="text-center text-sm text-muted-foreground">
            Hệ thống sẽ tự động kết nối đến mạng blockchain HoLiHu để theo dõi các sự kiện từ các hợp đồng thông minh.
            <br />Khi quá trình khởi tạo hoàn tất, bạn sẽ được chuyển hướng đến trang giám sát blockchain.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
