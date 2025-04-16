"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"
import { useEffect } from "react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      // You can use this to track page views when the route changes
      // For example, if you have Google Analytics:
      // window.gtag('config', 'GA_MEASUREMENT_ID', {
      //   page_path: pathname,
      // })
      
      // This is a placeholder for your analytics code
      console.log(`Page route changed to ${pathname}${searchParams ? `?${searchParams}` : ''}`)
    }
  }, [pathname, searchParams])

  return (
    <>
      {/* Google Analytics Script - Replace G-XXXXXXXXXX with your real ID if you use GA */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `,
        }}
      />
    </>
  )
}
