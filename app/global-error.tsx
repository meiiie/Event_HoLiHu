'use client'

import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="container flex flex-col items-center justify-center min-h-screen py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Đã xảy ra lỗi</h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Hệ thống gặp sự cố. Vui lòng thử lại sau.
          </p>
          <Button onClick={() => reset()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
        </div>
      </body>
    </html>
  )
}
