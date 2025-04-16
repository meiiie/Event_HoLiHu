"use client"

import { useState } from "react"
import { CssDebugger } from "@/components/ui-elements"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CSSTestPage() {
  const [activeTab, setActiveTab] = useState("test1")
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">CSS Test Page</h1>
      <p className="text-muted-foreground mb-8">
        This page tests various CSS features to ensure they're working correctly.
      </p>
      
      <CssDebugger />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
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
      
      <div className="flex justify-end mt-8">
        <Button variant="outline" onClick={() => window.history.back()}>Back</Button>
      </div>
    </div>
  )
}

