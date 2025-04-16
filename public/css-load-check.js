// This script verifies if CSS has loaded correctly
(function() {
  function checkCSSLoaded() {
    // Check if CSS variables are loaded correctly
    const body = document.body;
    const computedStyle = window.getComputedStyle(body);
    
    // Check if we're getting CSS variables correctly
    const bgColor = computedStyle.getPropertyValue('--background').trim();
    const hasTailwind = document.querySelector('[class*="bg-"]') !== null;
    
    // Add indicator based on whether CSS is loaded
    if (bgColor && hasTailwind) {
      body.classList.add('css-loaded');
      console.log('✅ CSS loaded successfully');
    } else {
      console.error('❌ CSS may not be loaded correctly');
      // Create visual error indicator
      const errorDiv = document.createElement('div');
      errorDiv.style.position = 'fixed';
      errorDiv.style.bottom = '10px';
      errorDiv.style.right = '10px';
      errorDiv.style.background = 'red';
      errorDiv.style.color = 'white';
      errorDiv.style.padding = '8px 12px';
      errorDiv.style.borderRadius = '4px';
      errorDiv.style.zIndex = '9999';
      errorDiv.style.fontSize = '12px';
      errorDiv.textContent = 'CSS Load Error';
      document.body.appendChild(errorDiv);
    }
  }
  
  // Check after page has loaded
  if (document.readyState === 'complete') {
    checkCSSLoaded();
  } else {
    window.addEventListener('load', checkCSSLoaded);
  }
})();
