(function() {
  // Check if CSS is loaded properly
  function isCSSLoaded() {
    try {
      // Check for container styles
      const container = document.querySelector('.container');
      if (container) {
        const style = window.getComputedStyle(container);
        if (style.maxWidth === 'none' || style.maxWidth === '') {
          return false;
        }
      }
      
      // Check for CSS variables
      const body = document.body;
      const style = window.getComputedStyle(body);
      const background = style.getPropertyValue('--background').trim();
      if (!background) {
        return false;
      }
      
      return true;
    } catch (e) {
      console.error('Error checking CSS:', e);
      return false;
    }
  }
  
  // Load emergency CSS
  function loadEmergencyCSS() {
    console.log('Loading emergency CSS...');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/emergency.css';
    document.head.appendChild(link);
    document.body.classList.add('css-emergency-fixes');
  }
  
  // Wait for DOM to be ready
  function checkAndFixCSS() {
    if (!isCSSLoaded()) {
      loadEmergencyCSS();
      return true;
    }
    return false;
  }
  
  // Check immediately 
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    checkAndFixCSS();
  } else {
    document.addEventListener('DOMContentLoaded', checkAndFixCSS);
  }
  
  // Double check after a short delay
  setTimeout(() => {
    checkAndFixCSS();
  }, 1000);
})();
