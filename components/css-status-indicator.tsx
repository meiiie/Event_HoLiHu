"use client"

import { useState, useEffect } from 'react'

export function CSSStatusIndicator() {
  const [status, setStatus] = useState<{
    loaded: boolean;
    issues: string[];
    details: {
      cssVariables: boolean;
      tailwind: boolean;
      container: boolean;
      customStyles: boolean;
      version: string;
    };
  }>({
    loaded: false,
    issues: [],
    details: {
      cssVariables: false,
      tailwind: false,
      container: false,
      customStyles: false,
      version: '1.0.4' // Increment version when updating
    }
  });
  
  useEffect(() => {
    const checkCss = () => {
      // Container styles check
      const containers = document.querySelectorAll('.container');
      const issues: string[] = [];
      let containerCheck = false;
      
      if (containers.length > 0) {
        const containerStyle = window.getComputedStyle(containers[0]);
        containerCheck = containerStyle.maxWidth !== 'none' && containerStyle.maxWidth !== '';
        if (!containerCheck) {
          issues.push('Container max-width not applied');
        }
      } else {
        issues.push('No container elements found');
      }
      
      // CSS variables check
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const bgColorVar = computedStyle.getPropertyValue('--background').trim();
      const cssVarsCheck = bgColorVar !== '';
      
      if (!cssVarsCheck) {
        issues.push('CSS variables not loaded');
      }
      
      // Tailwind check
      const hasTailwind = document.querySelector('[class*="bg-"], [class*="text-"], [class*="flex-"]') !== null;
      if (!hasTailwind) {
        issues.push('Tailwind classes not applied');
      }
      
      // Custom styles check
      const testElement = document.createElement('div');
      testElement.className = 'blockchain-card';
      testElement.style.visibility = 'hidden';
      document.body.appendChild(testElement);
      const cardStyle = window.getComputedStyle(testElement);
      const hasCustomStyles = cardStyle.borderRadius !== '0px' && cardStyle.borderRadius !== '';
      document.body.removeChild(testElement);
      
      if (!hasCustomStyles) {
        issues.push('Custom styles not applied');
      }
      
      // Set status
      setStatus({
        loaded: issues.length === 0,
        issues,
        details: {
          cssVariables: cssVarsCheck,
          tailwind: hasTailwind,
          container: containerCheck,
          customStyles: hasCustomStyles,
          version: '1.0.4'
        }
      });
    };
    
    // Wait for everything to load
    if (document.readyState === 'complete') {
      setTimeout(checkCss, 500); // Small delay to ensure all styles are applied
    } else {
      window.addEventListener('load', () => setTimeout(checkCss, 500));
    }
    
    return () => {
      window.removeEventListener('load', checkCss);
    };
  }, []);
  
  // Only show if there are issues
  if (status.loaded || status.issues.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-4 py-3 rounded-md shadow-lg border border-orange-200 dark:border-orange-800/30 max-w-md">
      <div className="font-medium flex items-center gap-2 mb-2">
        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
        <span>CSS Status: v{status.details.version}</span>
      </div>
      
      <div className="mb-3 text-sm">
        <ul className="list-disc list-inside space-y-1 pl-1">
          {status.issues.map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>
      </div>
      
      <div className="text-xs grid grid-cols-2 gap-1">
        <div className="flex justify-between">
          <span>CSS Variables:</span>
          <span className={status.details.cssVariables ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {status.details.cssVariables ? 'OK' : 'Failed'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tailwind:</span>
          <span className={status.details.tailwind ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {status.details.tailwind ? 'OK' : 'Failed'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Container:</span>
          <span className={status.details.container ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {status.details.container ? 'OK' : 'Failed'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Custom Styles:</span>
          <span className={status.details.customStyles ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {status.details.customStyles ? 'OK' : 'Failed'}
          </span>
        </div>
      </div>
      
      <div className="flex justify-end mt-3">
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded-md transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  )
}
