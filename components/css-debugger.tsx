"use client"

import { useEffect, useState } from "react"

export function CSSDebugger() {
  const [cssStatus, setCssStatus] = useState({
    loaded: false,
    tailwind: false,
    customStyles: false,
    animations: false
  })
  
  useEffect(() => {
    // Kiểm tra CSS đã được tải
    const checkCSS = () => {
      // Kiểm tra Tailwind
      const testDiv = document.createElement('div')
      testDiv.className = 'bg-blue-500 text-white'
      document.body.appendChild(testDiv)
      
      const style = window.getComputedStyle(testDiv)
      const hasTailwind = style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent'
      
      document.body.removeChild(testDiv)
      
      // Kiểm tra blockchain-animations
      const animDiv = document.createElement('div')
      animDiv.className = 'pulse-glow'
      document.body.appendChild(animDiv)
      
      const animStyle = window.getComputedStyle(animDiv)
      const hasAnimations = animStyle.animation !== '' && animStyle.animation !== 'none'
      
      document.body.removeChild(animDiv)
      
      // Kiểm tra custom styles
      const customDiv = document.createElement('div')
      customDiv.className = 'blockchain-card'
      document.body.appendChild(customDiv)
      
      const customStyle = window.getComputedStyle(customDiv)
      const hasCustomStyles = customStyle.borderRadius !== '0px' && customStyle.borderRadius !== ''
      
      document.body.removeChild(customDiv)
      
      setCssStatus({
        loaded: true,
        tailwind: hasTailwind,
        customStyles: hasCustomStyles,
        animations: hasAnimations
      })
    }
    
    // Chạy kiểm tra sau khi component đã mount
    checkCSS()
  }, [])

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-1">
      <div className="bg-black/80 text-white px-3 py-2 rounded-md backdrop-blur-sm text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className={`inline-block w-3 h-3 rounded-full ${cssStatus.loaded ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span>CSS Status: v1.0.3</span>
        </div>
        
        <div className="flex flex-col text-[10px] text-gray-300 mt-1">
          <div className="flex justify-between">
            <span>Tailwind:</span>
            <span className={cssStatus.tailwind ? 'text-green-400' : 'text-red-400'}>
              {cssStatus.tailwind ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Custom Styles:</span>
            <span className={cssStatus.customStyles ? 'text-green-400' : 'text-red-400'}>
              {cssStatus.customStyles ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Animations:</span>
            <span className={cssStatus.animations ? 'text-green-400' : 'text-red-400'}>
              {cssStatus.animations ? '✓' : '✗'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
