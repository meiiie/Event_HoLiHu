// This script verifies if CSS has loaded correctly
(function() {
  function checkCSSLoaded() {
    // Check if CSS variables are loaded correctly
    const body = document.body;
    const computedStyle = window.getComputedStyle(body);
    
    // Kiểm tra chi tiết các CSS variables
    const cssVariables = [
      '--background', '--foreground', '--card', '--card-foreground',
      '--primary', '--primary-foreground', '--border'
    ];
    
    const missingVariables = [];
    cssVariables.forEach(variable => {
      const value = computedStyle.getPropertyValue(variable).trim();
      if (!value) {
        missingVariables.push(variable);
      }
    });
    
    // Check if Tailwind classes are applied
    const hasTailwind = document.querySelector('[class*="bg-"], [class*="text-"], [class*="flex-"]') !== null;
    
    // Check if container styles are correctly applied
    const containers = document.querySelectorAll('.container');
    const layoutIssues = [];
    
    // More detailed container check
    if (containers.length > 0) {
      const containerStyle = window.getComputedStyle(containers[0]);
      if (containerStyle.maxWidth === 'none' || containerStyle.maxWidth === '') {
        layoutIssues.push('Container max-width not applied');
      }
      
      // Check if margins are applied
      if (containerStyle.marginLeft !== 'auto' || containerStyle.marginRight !== 'auto') {
        layoutIssues.push('Container margins not applied correctly');
      }
    } else {
      console.info('No container elements found on page');
    }
    
    // Inject critical CSS directly
    const injectCSS = () => {
      console.log("Applying emergency CSS fixes...");
      
      const criticalStyles = document.createElement('style');
      criticalStyles.textContent = `
        :root {
          --background: 0 0% 100%;
          --foreground: 0 0% 3.9%;
          --card: 0 0% 100%;
          --card-foreground: 0 0% 3.9%;
          --primary: 0 0% 9%;
          --primary-foreground: 0 0% 98%;
          --border: 0 0% 89.8%;
          --radius: 0.5rem;
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
        
        @media (min-width: 640px) {
          .container {
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
          }
        }
        
        @media (min-width: 1024px) {
          .container {
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
        }
        
        .bg-background { background-color: white !important; }
        .dark .bg-background { background-color: #111 !important; }
        .text-foreground { color: black !important; }
        .dark .text-foreground { color: white !important; }
        
        /* Ensure proper flexbox behavior */
        .flex { display: flex !important; }
        .flex-col { flex-direction: column !important; }
        .items-center { align-items: center !important; }
        .justify-center { justify-content: center !important; }
        .justify-between { justify-content: space-between !important; }
        .flex-1 { flex: 1 1 0% !important; }
      `;
      document.head.appendChild(criticalStyles);
      
      // Mark that emergency CSS was applied
      document.body.classList.add('emergency-css-applied');
      console.log('✅ Critical CSS fix applied successfully');
      
      return true;
    };
    
    // Apply emergency CSS if needed
    const needsEmergencyFix = missingVariables.length > 0 || !hasTailwind || layoutIssues.length > 0;
    let fixApplied = false;
    
    if (needsEmergencyFix) {
      fixApplied = injectCSS();
    }
    
    // Add indicator based on whether CSS is loaded
    if (missingVariables.length === 0 && hasTailwind && layoutIssues.length === 0) {
      body.classList.add('css-loaded');
      console.log('✅ CSS loaded successfully');
      return true;
    } else {
      console.error('❌ CSS may not be loaded correctly');
      if (missingVariables.length > 0) console.warn('Missing CSS variables:', missingVariables);
      if (layoutIssues.length > 0) console.warn('Layout issues:', layoutIssues);
      if (!hasTailwind) console.warn('Tailwind classes not detected');
      
      // Apply emergency fixes if not already applied
      body.classList.add('css-emergency-fixes');
      
      // Create visual error indicator with details
      const errorDiv = document.createElement('div');
      errorDiv.style.position = 'fixed';
      errorDiv.style.bottom = '10px';
      errorDiv.style.right = '10px';
      errorDiv.style.background = '#f44336';
      errorDiv.style.color = 'white';
      errorDiv.style.padding = '8px 12px';
      errorDiv.style.borderRadius = '4px';
      errorDiv.style.zIndex = '9999';
      errorDiv.style.fontSize = '12px';
      errorDiv.style.fontFamily = 'monospace';
      errorDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      errorDiv.innerHTML = `
        <div>CSS Issue${missingVariables.length > 0 ? ': Missing Variables' : layoutIssues.length > 0 ? ': Layout Issues' : ''}</div>
        <div style="font-size: 10px; opacity: 0.8; margin-top: 4px;">${fixApplied ? 'Emergency CSS applied' : 'Try refreshing the page'}</div>
      `;
      
      // Add fix button
      const fixButton = document.createElement('button');
      fixButton.textContent = fixApplied ? "Refresh Page" : "Apply Fix";
      fixButton.style.marginTop = '8px';
      fixButton.style.padding = '4px 8px';
      fixButton.style.background = '#2563eb';
      fixButton.style.border = 'none';
      fixButton.style.borderRadius = '4px';
      fixButton.style.color = 'white';
      fixButton.style.cursor = 'pointer';
      fixButton.style.width = '100%';
      fixButton.onclick = function() {
        if (fixApplied) {
          location.reload();
        } else {
          injectCSS();
          this.textContent = "Refresh Page";
          this.onclick = function() {
            location.reload();
          };
        }
      };
      errorDiv.appendChild(fixButton);
      document.body.appendChild(errorDiv);
      
      return false;
    }
  }
  
  // Function to run the check
  const runCheck = () => {
    try {
      return checkCSSLoaded();
    } catch (error) {
      console.error('Error checking CSS:', error);
      return false;
    }
  };
  
  // Check after page has loaded
  if (document.readyState === 'complete') {
    runCheck();
  } else {
    window.addEventListener('load', runCheck);
  }
  
  // Also check after a short delay to give CSS time to load
  setTimeout(runCheck, 1000);
})();
