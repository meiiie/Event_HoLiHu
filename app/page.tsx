import Link from "next/link"
import Image from "next/image"
import { Activity, Database, BarChart2, ArrowRight, ExternalLink, Shield, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center space-y-10">
        <div className="mx-auto max-w-[800px] space-y-6">
          <div className="flex items-center justify-center mb-8">
            {/* Sử dụng tệp ảnh với xử lý dự phòng */}
            <div className="w-[120px] h-[120px] rounded-full border-4 border-primary/20 shadow-lg overflow-hidden relative">
              {/* Sử dụng thẻ div với background-image làm giải pháp dự phòng thay vì Image component */}
              <div 
                className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center text-white text-xl font-bold"
                style={{
                  backgroundImage: "url('/logo-holihu.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                HLH
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            HoLiHu Blockchain Event Monitor
          </h1>
          
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Hệ thống giám sát blockchain chuyên nghiệp cho mạng HoLiHu. 
            Theo dõi, phân tích và quản lý các sự kiện blockchain trong thời gian thực.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/blockchain-monitor">
                <Activity className="mr-2 h-5 w-5" /> 
                Truy cập bảng điều khiển
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/blockchain-init">
                <Database className="mr-2 h-5 w-5" /> 
                Khởi tạo kết nối
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Giám sát sự kiện</CardTitle>
              <CardDescription>Theo dõi các sự kiện blockchain trên mạng HoLiHu trong thời gian thực</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Giám sát đầy đủ các hoạt động trên chuỗi, bao gồm các sự kiện hợp đồng thông minh, giao dịch và các hoạt động quản trị.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href="/blockchain-monitor">
                  Khám phá <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle>Phân tích dữ liệu</CardTitle>
              <CardDescription>Biểu đồ và các công cụ phân tích trực quan</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Nắm bắt xu hướng quan trọng và hiểu rõ hoạt động blockchain với các phân tích trực quan cao cấp.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href="/blockchain-monitor?tab=charts">
                  Xem biểu đồ <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center mb-4">
                <Terminal className="h-6 w-6 text-rose-500" />
              </div>
              <CardTitle>Smart Account Operations</CardTitle>
              <CardDescription>Theo dõi hoạt động của tài khoản thông minh EIP-4337</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Giám sát các hoạt động của EntryPoint, Paymaster và sự kiện tạo tài khoản người dùng.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href="/blockchain-monitor?contract=EntryPoint">
                  Xem EntryPoint <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* EntryPoint Section */}
      <section className="py-12 bg-gradient-to-r from-gray-900/50 to-gray-800/30 rounded-xl p-8 my-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <Badge className="mb-4 bg-gradient-to-r from-rose-400 to-rose-600 text-white">Mới</Badge>
            <h2 className="text-3xl font-bold mb-4">Giám sát EntryPoint</h2>
            <p className="text-muted-foreground mb-6">
              Theo dõi chi tiết các hoạt động của hợp đồng EntryPoint EIP-4337 trên mạng HoLiHu. 
              Giám sát các sự kiện User Operation, Paymaster và quá trình tạo tài khoản.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="px-3 py-1">
                <Shield className="mr-1 h-3 w-3" /> Paymaster
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Terminal className="mr-1 h-3 w-3" /> User Operations
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Activity className="mr-1 h-3 w-3" /> Account Creation
              </Badge>
            </div>
          </div>
          <div className="flex-1">
            <Card className="bg-black/30 border-gray-800">
              <CardHeader>
                <CardTitle>EntryPoint Events</CardTitle>
                <CardDescription>Recently monitored activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { event: "ThaoTacNguoiDungDuocThucThi", status: "Success" },
                    { event: "PaymasterXacThucThanhCong", status: "Success" },
                    { event: "TaoNguoiGuiThanhCong", status: "Success" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-2 border-b border-gray-800">
                      <span className="font-mono text-sm">{item.event}</span>
                      <Badge variant={item.status === "Success" ? "default" : "destructive"} className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm" className="w-full" asChild>
                  <Link href="/blockchain-monitor?tab=events&contract=EntryPoint">
                    Xem tất cả sự kiện EntryPoint
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold mb-6">Bắt đầu giám sát ngay hôm nay</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-[600px]">
          Kết nối với blockchain HoLiHu và bắt đầu giám sát các sự kiện từ các hợp đồng thông minh của bạn.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/blockchain-monitor">
              Truy cập bảng điều khiển
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://event.holihu.online/blockchain-monitor" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-5 w-5" />
              HoLiHu Event Monitor
            </a>
          </Button>
        </div>
      </section>

      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "HoLiHu Blockchain Monitor",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Professional blockchain event monitoring and tracking system for the HoLiHu network",
            "url": "https://event.holihu.online"
          })
        }}
      />
    </div>
  )
}
