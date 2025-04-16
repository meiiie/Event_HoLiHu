"use client"

import { useState, useEffect } from "react"
import { CSSDebugger } from "@/components/css-debugger"
import { CSSStatusIndicator } from "@/components/css-status-indicator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import '../../styles/standalone.css'  // Ensure standalone CSS is loaded
import '../../styles/critical.css'    // Ensure critical CSS is loaded
import '../../styles/main.css'        // Ensure main CSS is loaded

export default function CSSTestPage() {
  const [activeTab, setActiveTab] = useState("test1")
  const [loaded, setLoaded] = useState(false)
  
  // Use effect để xác nhận CSS đã được tải
  useEffect(() => {
    // Kiểm tra CSS đã được áp dụng chưa
    const testElement = document.createElement('div')
    testElement.className = 'container'
    document.body.appendChild(testElement)
    
    // Lấy computed style
    const style = window.getComputedStyle(testElement)
    const hasContainerStyles = style.maxWidth !== 'none' && style.maxWidth !== ''
    
    // Xóa element test
    document.body.removeChild(testElement)
    
    // Kiểm tra CSS variables
    const computedStyle = window.getComputedStyle(document.body)
    const hasCSSVariables = computedStyle.getPropertyValue('--background').trim() !== ''
    
    // Cập nhật trạng thái dựa trên cả hai điều kiện
    setLoaded(hasContainerStyles && hasCSSVariables)
    
    // Thêm stylesheet khắc phục nếu cần
    if (!hasContainerStyles || !hasCSSVariables) {
      console.warn('CSS styles not properly loaded, applying inline fixes')
      
      // Áp dụng các styles trực tiếp nếu CSS không tải đúng
      const fixStyle = document.createElement('style')
      fixStyle.innerHTML = `
        :root {
          --background: 0 0% 100%;
          --foreground: 0 0% 3.9%;
          --card: 0 0% 100%;
          --card-foreground: 0 0% 3.9%;
          --primary: 0 0% 9%;
          --primary-foreground: 0 0% 98%;
          --border: 0 0% 89.8%;
        }
        
        .dark {
          --background: 0 0% 3.9%;
          --foreground: 0 0% 98%;
          --card: 0 0% 3.9%;
          --card-foreground: 0 0% 98%;
          --primary: 0 0% 98%;
          --primary-foreground: 0 0% 9%;
          --border: 0 0% 14.9%;
        }
        
        .container {
          width: 100% !important;
          max-width: 1400px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }
        
        .card, .bg-card {
          background-color: white;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }
        
        .dark .card, .dark .bg-card {
          background-color: #1e293b;
          border-color: #334155;
        }
        
        .bg-blue-600 {
          background-color: #2563eb;
        }
        
        .text-blue-600 {
          color: #2563eb;
        }
        
        /* Ensure critical Tailwind classes work */
        .flex { display: flex !important; }
        .items-center { align-items: center !important; }
        .justify-center { justify-content: center !important; }
        .space-x-4 > * + * { margin-left: 1rem !important; }
        .font-bold { font-weight: 700 !important; }
        .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
      `
      document.head.appendChild(fixStyle)
    }
  }, [])
  
  // Detect middleware path for debug mode
  useEffect(() => {
    const checkDebugMode = () => {
      if (window.location.search.includes('debug=true')) {
        // Add debug class to body
        document.body.classList.add('debug-mode')
        
        // Add debug stylesheet
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = '/layout-debug.css'
        document.head.appendChild(link)
        
        console.log('Debug mode activated')
      }
    }
    
    checkDebugMode()
  }, [])
  
  // Force reload CSS
  const reloadCSS = () => {
    // Get all stylesheets
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    
    // Force reload each stylesheet
    links.forEach(link => {
      const href = link.getAttribute('href')
      if (href) {
        const newHref = href.includes('?') 
          ? `${href}&reload=${new Date().getTime()}`
          : `${href}?reload=${new Date().getTime()}`
        link.setAttribute('href', newHref)
      }
    })
    
    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">CSS Test Page</h1>
      <p className="text-muted-foreground mb-8">
        This page tests various CSS features to ensure they're working correctly.
      </p>
      
      {/* Hiển thị trạng thái CSS */}
      <div className="mb-4 p-4 rounded-md bg-green-50/50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40">
        <p className="text-green-700 dark:text-green-300 flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full ${loaded ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
          CSS Status: {loaded ? 'Loaded successfully' : 'Not properly loaded'} (v1.0.4)
        </p>
      </div>
      
      <CSSDebugger />
      <CSSStatusIndicator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="test1">Tailwind Tests</TabsTrigger>
          <TabsTrigger value="test2">Custom Components</TabsTrigger>
          <TabsTrigger value="test3">Animations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="test1" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Tailwind Test</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>This text should be in a card with shadow</li>
                  <li>The box should have rounded corners</li>
                  <li>This list should have bullets</li>
                  <li>This text should be <span className="text-green-500">green</span></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Background Test</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md text-white">
                  <p>This box should have a purple-to-blue gradient background</p>
                  <Button className="mt-4 bg-white text-purple-700 hover:bg-gray-100 transition-colors">
                    Button with hover effect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="test2" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-4">Custom Component Classes</h2>
              
              <div className="blockchain-card mt-4">
                <h3 className="font-semibold">Blockchain Card</h3>
                <p>This card should have special styling from the blockchain-card class</p>
              </div>
              
              <div className="mt-4">
                <h3 className="blockchain-heading text-2xl mb-2">Blockchain Heading</h3>
                <p>The heading above should have a gradient text effect</p>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Badge variant="default">Default Badge</Badge>
                <Badge variant="secondary">Secondary Badge</Badge>
                <Badge className="bg-blue-500">Custom Badge</Badge>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="test3" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Pulse Glow Effect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="pulse-glow p-4 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block">
                  This box should have a pulsing glow animation
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hover Lift Effect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="hover-lift p-4 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block">
                  This should lift up when you hover over it
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Stream Effect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="data-stream w-full h-16 rounded-lg flex items-center justify-center">
                  Streaming data background
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => window.history.back()}>Back</Button>
        <Button onClick={reloadCSS}>Reload CSS</Button>
      </div>
    </div>
  )
}

