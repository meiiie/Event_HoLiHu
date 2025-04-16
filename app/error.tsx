'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <Alert className="bg-red-50/70 dark:bg-red-900/20 border border-red-100/50 dark:border-red-800/30 backdrop-blur-sm mb-6">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-700 dark:text-red-400">
            Đã xảy ra lỗi trong quá trình xử lý yêu cầu của bạn.
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">Xảy ra sự cố</h2>
          <p className="text-muted-foreground mb-6">
            Chúng tôi gặp vấn đề khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.
          </p>
          <Button onClick={reset} variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
        </div>
      </div>
    </div>
  )
}
